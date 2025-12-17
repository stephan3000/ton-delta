import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano, Dictionary, beginCell } from '@ton/core';
import { TonDelta, JettonTransferNotification, Trade, Withdraw, Order } from '../build/TonDelta/TonDelta_TonDelta';
import '@ton/test-utils';

describe('TonDelta', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let userA: SandboxContract<TreasuryContract>;
    let userB: SandboxContract<TreasuryContract>;
    let tonDelta: SandboxContract<TonDelta>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        deployer = await blockchain.treasury('deployer'); // Owner
        userA = await blockchain.treasury('userA');
        userB = await blockchain.treasury('userB');

        tonDelta = blockchain.openContract(await TonDelta.fromInit());

        const deployResult = await tonDelta.send(
            deployer.getSender(),
            { value: toNano('0.05') },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        // @ts-ignore
        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: tonDelta.address,
            deploy: true,
            success: true,
        });
    });

    it('should receive TON deposit', async () => {
        // User A deposits 1 TON
        const result = await tonDelta.send(
            userA.getSender(),
            { value: toNano('1.0') },
            null
        );
        // @ts-ignore
        expect(result.transactions).toHaveTransaction({
            from: userA.address,
            to: tonDelta.address,
            success: true,
        });

        const balance = await tonDelta.getBalance(userA.address, null);
        expect(balance).toEqual(toNano('1.0'));
    });

    it('should receive Jetton deposit', async () => {
        // Simulate Jetton Notification
        // Sender is "FakeJettonWallet".
        const fakeJettonWallet = await blockchain.treasury('fakeJettonWallet');

        const result = await tonDelta.send(
            fakeJettonWallet.getSender(),
            { value: toNano('0.1') },
            {
                $$type: 'JettonTransferNotification',
                query_id: 0n,
                amount: toNano('50'),
                sender: userA.address, // The user who sent "transfer" to the wallet
                forward_payload: beginCell().endCell().asSlice()
            }
        );

        // @ts-ignore
        expect(result.transactions).toHaveTransaction({
            from: fakeJettonWallet.address,
            to: tonDelta.address,
            success: true,
        });

        const balance = await tonDelta.getBalance(userA.address, fakeJettonWallet.address);
        expect(balance).toEqual(toNano('50'));
    });

    it('should place order and trade with Fees', async () => {
        // Setup:
        // Maker (userA) will sell 20 TON (TokenGive) for 10 TokenA (TokenGet)
        // Taker (userB) will buy 10 TON (TokenGive) with 5 TokenA (TokenGet)
        // Fee is 0.3% on the Output to Taker (TON)

        const maker = userA;
        const taker = userB;
        const tokenA = deployer; // Mock Jetton, using deployer address as token address

        // 1. Maker deposits 20 TON
        await tonDelta.send(maker.getSender(), { value: toNano('21') }, null); // +1 for gas/deposit

        // Check Maker Balance 
        const makerInit = await tonDelta.getBalance(maker.address, null);
        expect(makerInit).toEqual(toNano('21'));

        // 2. Maker places Order
        const amountGet = toNano('10'); // TokenA
        const amountGive = toNano('20'); // TON
        const futureExpiry = BigInt(Math.floor(Date.now() / 1000) + 3600);

        const orderResult = await tonDelta.send(maker.getSender(), { value: toNano('0.1') }, {
            $$type: 'Order',
            tokenGet: tokenA.address,
            amountGet: amountGet,
            tokenGive: null, // TON
            amountGive: amountGive,
            expires: futureExpiry,
            nonce: 0n,
            maker: maker.address
        });

        expect(orderResult.transactions).toHaveTransaction({
            from: maker.address,
            to: tonDelta.address,
            success: true
        });

        // 3. Taker deposits 50 TokenA
        await tonDelta.send(tokenA.getSender(), { value: toNano('0.1') }, {
            $$type: 'JettonTransferNotification',
            query_id: 0n,
            amount: toNano('50'),
            sender: taker.address,
            forward_payload: beginCell().endCell().asSlice()
        });

        // 4. Taker Trades (Fill 5 TokenA worth) -> Should get 10 TON - 0.3% Fee
        // Trade Amount (Get) = 5.
        // Trade Amount (Give) = (20 * 5) / 10 = 10 TON.
        // Fee = 10 * 0.003 = 0.03 TON.
        // Taker gets 9.97 TON.

        const tradeFillAmount = toNano('5');

        const tradeResult = await tonDelta.send(taker.getSender(), { value: toNano('0.1') }, {
            $$type: 'Trade',
            tokenGet: tokenA.address,
            amountGet: amountGet,
            tokenGive: null,
            amountGive: amountGive,
            expires: futureExpiry,
            nonce: 0n,
            maker: maker.address,
            amount: tradeFillAmount,
            signature: beginCell().endCell().asSlice()
        });

        expect(tradeResult.transactions).toHaveTransaction({
            from: taker.address,
            to: tonDelta.address,
            success: true
        });

        // Verify Balances

        // Maker:
        // TON: 21 (Initial) - 10 (Trade) = 11
        // TokenA: 0 (Initial) + 5 (Trade) = 5
        const makerBalTON = await tonDelta.getBalance(maker.address, null);
        expect(makerBalTON).toEqual(toNano('11'));

        const makerBalTok = await tonDelta.getBalance(maker.address, tokenA.address);
        expect(makerBalTok).toEqual(toNano('5'));

        // Taker:
        // TON: 0 + 9.97 = 9.97
        // TokenA: 50 - 5 = 45
        const takerBalTok = await tonDelta.getBalance(taker.address, tokenA.address);
        expect(takerBalTok).toEqual(toNano('45'));

        const takerBalTON = await tonDelta.getBalance(taker.address, null);
        expect(takerBalTON).toEqual(toNano('9.97')); // 10 - 0.03

        // Owner (Deployer):
        // TON: 0 + 0.03 = 0.03
        const ownerBalTON = await tonDelta.getBalance(deployer.address, null);
        expect(ownerBalTON).toEqual(toNano('0.03'));
    });
});
