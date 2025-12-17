import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano, beginCell, Address } from '@ton/core';
import { TonDelta } from '../build/TonDelta/TonDelta_TonDelta';
import '@ton/test-utils';

describe('TonDelta Security Tests', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let tonDelta: SandboxContract<TonDelta>;
    let userA: SandboxContract<TreasuryContract>;
    let userB: SandboxContract<TreasuryContract>;
    let attacker: SandboxContract<TreasuryContract>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        deployer = await blockchain.treasury('deployer');
        userA = await blockchain.treasury('userA');
        userB = await blockchain.treasury('userB');
        attacker = await blockchain.treasury('attacker');

        tonDelta = blockchain.openContract(await TonDelta.fromInit());

        const deployResult = await tonDelta.send(
            deployer.getSender(),
            { value: toNano('0.05') },
            { $$type: 'Deploy', queryId: 0n }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: tonDelta.address,
            deploy: true,
            success: true,
        });

        // Seed User A with Balance
        await tonDelta.send(
            userA.getSender(),
            { value: toNano('10') },
            null
        );
    });

    it('Security: Should prevent unauthorized order placement (Spoofing)', async () => {
        // Attacker tries to place an order claiming to be User A
        const currentTimestamp = Math.floor(Date.now() / 1000);
        // We can't easily "spoof" the sender in the Sandbox send() method normally (it signs as the sender),
        // but we can check if the contract validates `msg.maker == ctx.sender`.

        // If Attacker simply sends an order where THEY are the sender, but `maker` field is User A.
        const invalidOrder = {
            $$type: 'Order' as const,
            tokenGet: null,
            amountGet: toNano('1'),
            tokenGive: null,
            amountGive: toNano('1'), // TON
            expires: BigInt(currentTimestamp + 3600),
            nonce: 1n,
            maker: userA.address // <--- Spoofed Maker
        };

        const result = await tonDelta.send(
            attacker.getSender(), // <--- Signed by Attacker
            { value: toNano('0.1') },
            invalidOrder
        );

        expect(result.transactions).toHaveTransaction({
            from: attacker.address,
            to: tonDelta.address,
            success: false, // Should fail
            exitCode: 28827 // "Invalid maker"
        });
    });

    it('Security: Should prevent overfilling an order (Double Spend)', async () => {
        // 1. User A places valid order: Give 10 TON, Get 10 TON (Self-trade for simplicity or phantom token)
        // Let's use TON for both to keep it simple, or null checks.
        // Actually the contract allows null/null (TON/TON) swap technically?

        const amount = toNano('10');
        const order = {
            $$type: 'Order' as const,
            tokenGet: null,
            amountGet: amount,
            tokenGive: null,
            amountGive: amount,
            expires: 0n,
            nonce: 123n,
            maker: userA.address
        };

        await tonDelta.send(userA.getSender(), { value: toNano('0.1') }, order);

        // 2. User B (Taker) has funds.
        await tonDelta.send(userB.getSender(), { value: toNano('20') }, null);

        // 3. Trade 1: Fill 100%
        const trade1 = {
            $$type: 'Trade' as const,
            tokenGet: null,
            amountGet: amount,
            tokenGive: null,
            amountGive: amount,
            expires: 0n,
            nonce: 123n,
            maker: userA.address,
            amount: amount, // Fill all 10
            signature: beginCell().endCell().beginParse() // Correct: Slice
        };

        const res1 = await tonDelta.send(userB.getSender(), { value: toNano('0.5') }, trade1);
        expect(res1.transactions).toHaveTransaction({ success: true });

        // 4. Trade 2: Try to fill ANY amount again
        const trade2 = { ...trade1, amount: toNano('1') }; // Try to take 1 more
        const res2 = await tonDelta.send(userB.getSender(), { value: toNano('0.5') }, trade2);

        expect(res2.transactions).toHaveTransaction({
            from: userB.address,
            to: tonDelta.address,
            success: false,
            // exitCode: 49306 
        });
    });

    it('Security: Should prevent withdrawing more than balance (Solvency)', async () => {
        const result = await tonDelta.send(
            userA.getSender(),
            { value: toNano('0.1') },
            {
                $$type: 'Withdraw' as const,
                token: null,
                amount: toNano('999999') // More than deposited 10
            }
        );

        expect(result.transactions).toHaveTransaction({
            from: userA.address,
            to: tonDelta.address,
            success: false
        });
    });

    it('Security: Should handle zero-value trades appropriately', async () => {
        // Taking 0 amount
        const amount = toNano('10');
        const order = {
            $$type: 'Order' as const,
            tokenGet: null,
            amountGet: amount,
            tokenGive: null,
            amountGive: amount,
            expires: 0n,
            nonce: 999n,
            maker: userA.address
        };
        await tonDelta.send(userA.getSender(), { value: toNano('0.1') }, order);

        const tradeZero = {
            $$type: 'Trade' as const,
            tokenGet: null,
            amountGet: amount,
            tokenGive: null,
            amountGive: amount,
            expires: 0n,
            nonce: 999n,
            maker: userA.address,
            amount: 0n, // Zero
            signature: beginCell().endCell().beginParse() // Correct: Slice
        };

        const res = await tonDelta.send(userB.getSender(), { value: toNano('0.5') }, tradeZero);
        // It "succeeds" in execution but transfers 0. This is safe, just wastes gas.
        expect(res.transactions).toHaveTransaction({ success: true });
    });

});
