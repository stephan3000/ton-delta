import { useEffect } from 'react';
import { useTonDelta } from './useTonDelta';
import { useOrderHistory } from './useOrderHistory';
import { Address } from '@ton/core';

export function useOrderNotifications() {
    const { tonDelta } = useTonDelta();
    const { orders, updateOrder } = useOrderHistory();

    useEffect(() => {
        if (!tonDelta || orders.length === 0) return;

        const interval = setInterval(async () => {
            for (const order of orders) {
                if (order.status !== 'open') continue; // Skip closed orders (unless checking for re-org?)

                try {
                    // Check contract for fill amount
                    // We need input args to reconstruct the key to query `orderFills`?
                    // Wait, `orderFill` getter needs ALL args: tokenGet, amountGet, etc.
                    // StoredOrder has them.

                    const tokenGet = order.tokenGet ? Address.parse(order.tokenGet) : null;
                    const tokenGive = order.tokenGive ? Address.parse(order.tokenGive) : null;
                    const maker = Address.parse(order.maker);

                    const filled = await tonDelta.getOrderFill(
                        tokenGet,
                        BigInt(order.amountGet),
                        tokenGive,
                        BigInt(order.amountGive),
                        BigInt(order.expires),
                        BigInt(order.nonce),
                        maker
                    );

                    const currentFilled = BigInt(filled);
                    const prevFilled = BigInt(order.filledAmount || '0');
                    const totalAmountGet = BigInt(order.amountGet);

                    if (currentFilled > prevFilled) {
                        // Notify!
                        const diff = currentFilled - prevFilled;
                        new Notification('Order Filled!', {
                            body: `Your order was filled by ${diff.toString()} units!`
                        });

                        updateOrder(order.hash, {
                            filledAmount: currentFilled.toString(),
                            status: currentFilled >= totalAmountGet ? 'filled' : 'open'
                        });
                    }
                } catch (e) {
                    console.error('Failed to poll order:', order.hash, e);
                }
            }
        }, 10000); // Poll every 10 seconds

        return () => clearInterval(interval);
    }, [tonDelta, orders]); // Re-run if orders change? optimize later
}
