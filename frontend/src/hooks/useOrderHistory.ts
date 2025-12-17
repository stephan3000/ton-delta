import { useState, useEffect } from 'react';
// import { Address } from '@ton/core'; // Unused

export interface StoredOrder {
    hash: string; // Base64 or Hex representation of Order Hash
    tokenGet: string | null;
    amountGet: string;
    tokenGive: string | null;
    amountGive: string;
    expires: string;
    nonce: string;
    maker: string;
    status: 'open' | 'filled' | 'cancelled' | 'expired';
    filledAmount: string;
    timestamp: number;
}

const STORAGE_KEY = 'ton_delta_orders';

export function useOrderHistory() {
    const [orders, setOrders] = useState<StoredOrder[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setOrders(JSON.parse(stored));
            } catch (e) {
                console.error('Failed to parse orders:', e);
            }
        }
    }, []);

    const addOrder = (order: StoredOrder) => {
        setOrders(prev => {
            const updated = [order, ...prev];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    };

    const updateOrder = (hash: string, updates: Partial<StoredOrder>) => {
        setOrders(prev => {
            const updated = prev.map(o => o.hash === hash ? { ...o, ...updates } : o);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    };

    return { orders, addOrder, updateOrder };
}
