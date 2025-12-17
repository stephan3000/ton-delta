import { useState } from 'react';
import './OrderBook.scss';

interface Order {
    id: string;
    price: string;
    amount: string;
    total: string;
    type: 'buy' | 'sell';
}

export function OrderBook() {
    // Mock Data for MVP
    const [orders] = useState<Order[]>([
        { id: '1', price: '0.5', amount: '100', total: '50', type: 'sell' },
        { id: '2', price: '0.49', amount: '50', total: '24.5', type: 'sell' },
        { id: '3', price: '0.48', amount: '1000', total: '480', type: 'buy' },
        { id: '4', price: '0.45', amount: '200', total: '90', type: 'buy' },
    ]);

    return (
        <div className="order-book">
            <div className="table-header">
                <span>Price (TON)</span>
                <span>Amount</span>
                <span>Total</span>
            </div>
            <div className="table-body">
                {orders.map(order => (
                    <div key={order.id} className={`row ${order.type}`}>
                        <span>{order.price}</span>
                        <span>{order.amount}</span>
                        <span>{order.total}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
