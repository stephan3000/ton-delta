import { toNano } from '@ton/core';
import { TonEtherDelta } from '../build/TonEtherDelta/TonEtherDelta_TonEtherDelta';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const tonEtherDelta = provider.open(await TonEtherDelta.fromInit());

    await tonEtherDelta.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        null,
    );

    await provider.waitForDeploy(tonEtherDelta.address);

    // run methods on `tonEtherDelta`
}
