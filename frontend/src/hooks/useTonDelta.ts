import { useEffect, useState } from 'react';
import { TonDelta } from '../contracts/TonDelta';
import { useTonClient } from './useTonClient';
import { useTonConnect } from './useTonConnect';
import { Address, type OpenedContract } from '@ton/core';

const CONTRACT_ADDRESS = 'EQBb-YATQNAFUmT2zXanA6qBt0EfFG8HOaXqbHABRoZUEu-K'; // Replace with actual deploy address

export function useTonDelta() {
    const client = useTonClient();
    const { sender } = useTonConnect();
    const [tonDelta, setTonDelta] = useState<OpenedContract<TonDelta> | null>(null);

    useEffect(() => {
        if (!client) return;

        // In a real app, you might want to fetch the address dynamically or from config
        const address = Address.parse(CONTRACT_ADDRESS);
        const contract = TonDelta.fromAddress(address);
        const opened = client.open(contract) as OpenedContract<TonDelta>;

        setTonDelta(opened);
    }, [client]);

    return {
        tonDelta,
        sender,
        address: CONTRACT_ADDRESS
    };
}
