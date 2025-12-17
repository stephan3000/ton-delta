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
            null
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

        // Verify balance 
        // Need getter. 
        // We need to wait for contract to process (Sandbox does this).
        const balance = await tonDelta.getBalance(userA.address, null);
        expect(balance).toBeGreaterThanOrEqual(toNano('0.9')); // minimal gas deducted? 
        // Actually our code: balances.set(key, current + ctx.value);
        // It stores FULL value.
        expect(balance).toEqual(toNano('1.0'));
    });

    it('should receive Jetton deposit', async () => {
        // Simulate Jetton Notification
        // Sender is "FakeJettonWallet".
        const fakeJettonWallet = await blockchain.treasury('fakeJettonWallet');

        // The notification message
        // message JettonTransferNotification { query_id: Int as uint64; amount: Int as coins; sender: Address; forward_payload: Slice as remaining; }

        // Use Wrapper generated types if available, else manual body.
        // We will assume 'StoreJettonTransferNotification' isn't auto-exported nicely for `send`? 
        // Actually, Tact wrappers export the Message types.

        const result = await tonDelta.send(
            fakeJettonWallet.getSender(),
            { value: toNano('0.1') },
            // Body: JettonTransferNotification
            // We need to construct it. 
            // In the wrapper, typically: 
            // export type JettonTransferNotification = { $$type: 'JettonTransferNotification'; query_id: bigint; amount: bigint; sender: Address; forward_payload: Slice; }
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

    it('should place order and trade', async () => {
        // 1. User A Deposits 100 TokenA (Selling TokenA)
        const tokenA = await blockchain.treasury('tokenA');
        await tonDelta.send(tokenA.getSender(), { value: toNano('0.1') }, {
            $$type: 'JettonTransferNotification',
            query_id: 0n,
            amount: toNano('100'),
            sender: userA.address,
            forward_payload: beginCell().endCell().asSlice()
        });

        // 2. User B Deposits 10 TON (Buying with TON)
        await tonDelta.send(userB.getSender(), { value: toNano('10') }, null);

        // 3. User A places Order: Sell 50 TokenA for 5 TON.
        // TokenGet = TON (null), AmountGet = 5 TON
        // TokenGive = TokenA, AmountGive = 50 TokenA
        const amountGet = toNano('5');
        const amountGive = toNano('50');
        const nonce = 123n;
        const expires = BigInt(Math.floor(Date.now() / 1000) + 3600); // 1 hour

        const resultOrder = await tonDelta.send(userA.getSender(), { value: toNano('0.1') }, {
            $$type: 'Order', // Was renamed? contract uses 'message Order'
            tokenGet: null,
            amountGet: amountGet,
            tokenGive: tokenA.address,
            amountGive: amountGive,
            expires: expires,
            nonce: nonce,
            maker: userA.address // Self
        });

        // @ts-ignore
        expect(resultOrder.transactions).toHaveTransaction({
            from: userA.address,
            to: tonDelta.address,
            success: true
        });

        // 4. User B Trades (Fills 2.5 TON worth -> 25 TokenA)
        const fillAmount = toNano('2.5'); // In terms of TokenGet (TON)
        const tradeResult = await tonDelta.send(userB.getSender(), { value: toNano('0.1') }, {
            $$type: 'Trade',
            tokenGet: null,
            amountGet: amountGet,
            tokenGive: tokenA.address,
            amountGive: amountGive,
            expires: expires,
            nonce: nonce,
            maker: userA.address,
            amount: fillAmount,
            signature: beginCell().endCell().asSlice() // Empty for now as we don't check
        });

        // @ts-ignore
        expect(tradeResult.transactions).toHaveTransaction({
            from: userB.address,
            to: tonDelta.address,
            success: true
        });

        // Verify Balances
        // User A should have: +2.5 TON, -25 TokenA.
        // Initial: 0 TON (deposited 0?), 100 TokenA.
        // wait, User A deposited 0 TON (only gas). 
        // But logic: balances[TON] += msg.value.
        // During deployment/Setup User A didn't deposit TON.
        // So User A has 0 TON in contract.
        // Trade adds 2.5 TON.

        const balA_TON = await tonDelta.getBalance(userA.address, null);
        // User A sent some TON for gas with PlaceOrder, but that's credited!
        // `receive() { balances += msg.value }`.
        // `receive(msg: Order)` does NOT credit value? 
        // Wait, default receive credits value. 
        // Specific handlers `receive(msg: Order)` do NOT automatically credit value unless we do it manually or it falls through?
        // In Tact, specific handler executed. Value is NOT credited to custom balance map unless code does it.
        // So User A TON balance = 2.5 (from trade).
        expect(balA_TON).toEqual(fillAmount);

        // User A TokenA balance = 100 - 25 = 75.
        const balA_Tok = await tonDelta.getBalance(userA.address, tokenA.address);
        expect(balA_Tok).toEqual(toNano('75'));

        // User B:
        // Initial: 10 TON.
        // Trade: -2.5 TON. (plus gas usage? No, internal balance map).
        // Balance = 7.5 TON.
        const balB_TON = await tonDelta.getBalance(userB.address, null);
        expect(balB_TON).toEqual(toNano('7.5'));

        // User B TokenA: +25.
        const balB_Tok = await tonDelta.getBalance(userB.address, tokenA.address);
        expect(balB_Tok).toEqual(toNano('25'));
    });
});
