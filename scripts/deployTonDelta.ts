import { toNano } from '@ton/core';
import { TonDelta } from '../build/TonDelta/TonDelta_TonDelta';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const tonDelta = provider.open(await TonDelta.fromInit());

    await tonDelta.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(tonDelta.address);

    // run methods on `tonDelta`
}
