import { useState } from 'react';
import { useTonDelta } from '../hooks/useTonDelta';
import './TradeForm.scss';

export function TradeForm() {
    const { tonDelta } = useTonDelta();
    const [side, setSide] = useState<'buy' | 'sell'>('buy');
    const [price, setPrice] = useState('');
    const [amount, setAmount] = useState('');

    const handleSubmit = async () => {
        if (!tonDelta) return alert('Wallet not connected or contract not found');

        try {
            // MVP: Place Order logic (simplified)
            // Real implementation needs constructing the Order cell, signing it (off-chain), and sending `Order` message.
            console.log('Placing order:', { side, price, amount });

            // Example: Depositing TON
            /*
            await tonDelta.send(sender, {
                value: toNano(amount)
            }, null);
            */
            alert('Order placement logic to be connected!');
        } catch (e) {
            console.error(e);
            alert('Error placing order');
        }
    };

    return (
        <div className="trade-form">
            <div className="tabs">
                <button
                    className={side === 'buy' ? 'active buy' : ''}
                    onClick={() => setSide('buy')}
                >
                    Buy
                </button>
                <button
                    className={side === 'sell' ? 'active sell' : ''}
                    onClick={() => setSide('sell')}
                >
                    Sell
                </button>
            </div>

            <div className="inputs">
                <div className="input-group">
                    <label>Price</label>
                    <input
                        type="number"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                        placeholder="0.00"
                    />
                </div>
                <div className="input-group">
                    <label>Amount</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        placeholder="0.00"
                    />
                </div>
            </div>

            <button className={`submit-btn ${side}`} onClick={handleSubmit}>
                {side === 'buy' ? 'Buy' : 'Sell'} TON
            </button>
        </div>
    );
}
