import { useState } from 'react';
import { useTonDelta } from '../hooks/useTonDelta';
import { useOrderHistory } from '../hooks/useOrderHistory';
import { toNano, Address } from '@ton/core';
import './TradeForm.scss';

// MVP: Hardcoded Token Address for Demo (e.g. a Testnet USDT)
// In prod, this comes from a token selector
const DEMO_TOKEN = 'EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixq3xabtCNT_Br'; 

export function TradeForm() {
    const { tonDelta, sender } = useTonDelta();
    const { addOrder } = useOrderHistory();
    const [side, setSide] = useState<'buy' | 'sell'>('buy');
    const [price, setPrice] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!tonDelta || !sender) return alert('Wallet not connected');
        if (!price || !amount) return alert('Please enter price and amount');

        setLoading(true);
        try {
            const tokenAddress = Address.parse(DEMO_TOKEN);
            const amt = parseFloat(amount);
            const prc = parseFloat(price);

            // Calculate Amounts
            // Pair: TON / Token
            // If Buy TON: Give Token, Get TON
            // If Sell TON: Give TON, Get Token

            let tokenGet: Address | null;
            let amountGet: bigint;
            let tokenGive: Address | null;
            let amountGive: bigint;

            if (side === 'buy') {
                // Buy TON (Get TON, Give Token)
                tokenGet = null; // TON
                amountGet = toNano(amt.toString());
                tokenGive = tokenAddress;
                // Give = Amount * Price (in Token)
                amountGive = toNano((amt * prc).toFixed(9));
            } else {
                // Sell TON (Give TON, Get Token)
                tokenGive = null; // TON
                amountGive = toNano(amt.toString());
                tokenGet = tokenAddress;
                // Get = Amount * Price (in Token)
                amountGet = toNano((amt * prc).toFixed(9));
            }

            const expires = BigInt(Math.floor(Date.now() / 1000) + 3600); // 1 hour expiry
            const nonce = BigInt(Math.floor(Math.random() * 1000000));

            console.log('Sending Order:', { side, amountGet: amountGet.toString(), amountGive: amountGive.toString() });

            await tonDelta.send(
                sender,
                { value: toNano('0.2') }, // Gas + Storage
                {
                    $$type: 'Order',
                    tokenGet,
                    amountGet,
                    tokenGive,
                    amountGive,
                    expires,
                    nonce,
                    maker: sender.address! // Optimistic, use sender address
                }
            );

            // Save to LocalStorage for tracking/notifications
            // Note: We don't have the hash yet easily without calculating it locally similar to contract.
            // For MVP, we can try to calculate it or just save the params and try to fetch logic later.
            // But `useOrderNotifications` relies on `StoredOrder` structure.
            // We should calculate hash properly?
            // `TonDelta` contract has `getOrderHash`. We can call that getter!
            // But we need to wait for transaction to confirm? No, getters are view functions.
            // We can call getter locally if we have the contract instance? 
            // Or just store params and let poller calculate hash? No, poller iterates stored orders.

            // Let's store a "Optimistic" entry.
            // But we need the HASH to query stored `orderFills` map?
            // Actually `getOrderFill` getter takes params, NOT hash. 
            // `get fun orderFill(tokenGet: Address?, ...)`
            // So we DON'T need the hash to query fill status! We just need params.

            addOrder({
                hash: 'pending_' + Date.now(), // Placeholder
                tokenGet: tokenGet ? tokenGet.toString() : '',
                amountGet: amountGet.toString(),
                tokenGive: tokenGive ? tokenGive.toString() : '',
                amountGive: amountGive.toString(),
                expires: expires.toString(),
                nonce: nonce.toString(),
                maker: sender.address!.toString(),
                status: 'open',
                filledAmount: '0',
                timestamp: Date.now()
            });

            alert('Order Transaction Sent!');
            setAmount('');
            setPrice('');
        } catch (e: any) {
            console.error(e);
            alert('Error placing order: ' + (e.message || e));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="trade-form">
            <div className="tabs">
                <button
                    className={side === 'buy' ? 'active buy' : ''}
                    onClick={() => setSide('buy')}
                >
                    Buy TON
                </button>
                <button
                    className={side === 'sell' ? 'active sell' : ''}
                    onClick={() => setSide('sell')}
                >
                    Sell TON
                </button>
            </div>

            <div className="inputs">
                <div className="input-group">
                    <label>Price (Token)</label>
                    <input
                        type="number"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                        placeholder="0.00"
                        step="0.000001"
                    />
                </div>
                <div className="input-group">
                    <label>Amount (TON)</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        placeholder="0.00"
                    />
                </div>
                <div className="summary">
                    <span>Total: {price && amount ? (parseFloat(price) * parseFloat(amount)).toFixed(6) : '0.00'} Token</span>
                </div>
            </div>

            <button className={`submit-btn ${side}`} onClick={handleSubmit} disabled={loading}>
                {loading ? 'Confirming...' : (side === 'buy' ? 'Place Buy Order' : 'Place Sell Order')}
            </button>
        </div>
    );
}
