import { TonClient } from '@ton/ton';
import { getHttpEndpoint } from '@orbs-network/ton-access';
import { useEffect, useState } from 'react';

export function useAsyncInitialize<T>(func: () => Promise<T>, deps: any[] = []) {
    const [state, setState] = useState<T | undefined>();
    useEffect(() => {
        (async () => {
            setState(await func());
        })();
    }, deps);
    return state;
}

export function useTonClient() {
    return useAsyncInitialize(
        async () =>
            new TonClient({
                endpoint: await getHttpEndpoint({ network: 'testnet' }),
            })
    );
}
