// @ts-nocheck
import {
    Cell,
    Slice,
    Address,
    Builder,
    beginCell,
    ComputeError,
    TupleItem,
    TupleReader,
    Dictionary,
    contractAddress,
    address,
    ContractProvider,
    Sender,
    Contract,
    ContractABI,
    ABIType,
    ABIGetter,
    ABIReceiver,
    TupleBuilder,
    DictionaryValue
} from '@ton/core';

export type DataSize = {
    $$type: 'DataSize';
    cells: bigint;
    bits: bigint;
    refs: bigint;
}

export function storeDataSize(src: DataSize) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.cells, 257);
        b_0.storeInt(src.bits, 257);
        b_0.storeInt(src.refs, 257);
    };
}

export function loadDataSize(slice: Slice) {
    const sc_0 = slice;
    const _cells = sc_0.loadIntBig(257);
    const _bits = sc_0.loadIntBig(257);
    const _refs = sc_0.loadIntBig(257);
    return { $$type: 'DataSize' as const, cells: _cells, bits: _bits, refs: _refs };
}

export function loadTupleDataSize(source: TupleReader) {
    const _cells = source.readBigNumber();
    const _bits = source.readBigNumber();
    const _refs = source.readBigNumber();
    return { $$type: 'DataSize' as const, cells: _cells, bits: _bits, refs: _refs };
}

export function loadGetterTupleDataSize(source: TupleReader) {
    const _cells = source.readBigNumber();
    const _bits = source.readBigNumber();
    const _refs = source.readBigNumber();
    return { $$type: 'DataSize' as const, cells: _cells, bits: _bits, refs: _refs };
}

export function storeTupleDataSize(source: DataSize) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.cells);
    builder.writeNumber(source.bits);
    builder.writeNumber(source.refs);
    return builder.build();
}

export function dictValueParserDataSize(): DictionaryValue<DataSize> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDataSize(src)).endCell());
        },
        parse: (src) => {
            return loadDataSize(src.loadRef().beginParse());
        }
    }
}

export type SignedBundle = {
    $$type: 'SignedBundle';
    signature: Buffer;
    signedData: Slice;
}

export function storeSignedBundle(src: SignedBundle) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeBuffer(src.signature);
        b_0.storeBuilder(src.signedData.asBuilder());
    };
}

export function loadSignedBundle(slice: Slice) {
    const sc_0 = slice;
    const _signature = sc_0.loadBuffer(64);
    const _signedData = sc_0;
    return { $$type: 'SignedBundle' as const, signature: _signature, signedData: _signedData };
}

export function loadTupleSignedBundle(source: TupleReader) {
    const _signature = source.readBuffer();
    const _signedData = source.readCell().asSlice();
    return { $$type: 'SignedBundle' as const, signature: _signature, signedData: _signedData };
}

export function loadGetterTupleSignedBundle(source: TupleReader) {
    const _signature = source.readBuffer();
    const _signedData = source.readCell().asSlice();
    return { $$type: 'SignedBundle' as const, signature: _signature, signedData: _signedData };
}

export function storeTupleSignedBundle(source: SignedBundle) {
    const builder = new TupleBuilder();
    builder.writeBuffer(source.signature);
    builder.writeSlice(source.signedData.asCell());
    return builder.build();
}

export function dictValueParserSignedBundle(): DictionaryValue<SignedBundle> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSignedBundle(src)).endCell());
        },
        parse: (src) => {
            return loadSignedBundle(src.loadRef().beginParse());
        }
    }
}

export type StateInit = {
    $$type: 'StateInit';
    code: Cell;
    data: Cell;
}

export function storeStateInit(src: StateInit) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeRef(src.code);
        b_0.storeRef(src.data);
    };
}

export function loadStateInit(slice: Slice) {
    const sc_0 = slice;
    const _code = sc_0.loadRef();
    const _data = sc_0.loadRef();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

export function loadTupleStateInit(source: TupleReader) {
    const _code = source.readCell();
    const _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

export function loadGetterTupleStateInit(source: TupleReader) {
    const _code = source.readCell();
    const _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

export function storeTupleStateInit(source: StateInit) {
    const builder = new TupleBuilder();
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}

export function dictValueParserStateInit(): DictionaryValue<StateInit> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeStateInit(src)).endCell());
        },
        parse: (src) => {
            return loadStateInit(src.loadRef().beginParse());
        }
    }
}

export type Context = {
    $$type: 'Context';
    bounceable: boolean;
    sender: Address;
    value: bigint;
    raw: Slice;
}

export function storeContext(src: Context) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeBit(src.bounceable);
        b_0.storeAddress(src.sender);
        b_0.storeInt(src.value, 257);
        b_0.storeRef(src.raw.asCell());
    };
}

export function loadContext(slice: Slice) {
    const sc_0 = slice;
    const _bounceable = sc_0.loadBit();
    const _sender = sc_0.loadAddress();
    const _value = sc_0.loadIntBig(257);
    const _raw = sc_0.loadRef().asSlice();
    return { $$type: 'Context' as const, bounceable: _bounceable, sender: _sender, value: _value, raw: _raw };
}

export function loadTupleContext(source: TupleReader) {
    const _bounceable = source.readBoolean();
    const _sender = source.readAddress();
    const _value = source.readBigNumber();
    const _raw = source.readCell().asSlice();
    return { $$type: 'Context' as const, bounceable: _bounceable, sender: _sender, value: _value, raw: _raw };
}

export function loadGetterTupleContext(source: TupleReader) {
    const _bounceable = source.readBoolean();
    const _sender = source.readAddress();
    const _value = source.readBigNumber();
    const _raw = source.readCell().asSlice();
    return { $$type: 'Context' as const, bounceable: _bounceable, sender: _sender, value: _value, raw: _raw };
}

export function storeTupleContext(source: Context) {
    const builder = new TupleBuilder();
    builder.writeBoolean(source.bounceable);
    builder.writeAddress(source.sender);
    builder.writeNumber(source.value);
    builder.writeSlice(source.raw.asCell());
    return builder.build();
}

export function dictValueParserContext(): DictionaryValue<Context> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeContext(src)).endCell());
        },
        parse: (src) => {
            return loadContext(src.loadRef().beginParse());
        }
    }
}

export type SendParameters = {
    $$type: 'SendParameters';
    mode: bigint;
    body: Cell | null;
    code: Cell | null;
    data: Cell | null;
    value: bigint;
    to: Address;
    bounce: boolean;
}

export function storeSendParameters(src: SendParameters) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        if (src.code !== null && src.code !== undefined) { b_0.storeBit(true).storeRef(src.code); } else { b_0.storeBit(false); }
        if (src.data !== null && src.data !== undefined) { b_0.storeBit(true).storeRef(src.data); } else { b_0.storeBit(false); }
        b_0.storeInt(src.value, 257);
        b_0.storeAddress(src.to);
        b_0.storeBit(src.bounce);
    };
}

export function loadSendParameters(slice: Slice) {
    const sc_0 = slice;
    const _mode = sc_0.loadIntBig(257);
    const _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _code = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _data = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _value = sc_0.loadIntBig(257);
    const _to = sc_0.loadAddress();
    const _bounce = sc_0.loadBit();
    return { $$type: 'SendParameters' as const, mode: _mode, body: _body, code: _code, data: _data, value: _value, to: _to, bounce: _bounce };
}

export function loadTupleSendParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _code = source.readCellOpt();
    const _data = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'SendParameters' as const, mode: _mode, body: _body, code: _code, data: _data, value: _value, to: _to, bounce: _bounce };
}

export function loadGetterTupleSendParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _code = source.readCellOpt();
    const _data = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'SendParameters' as const, mode: _mode, body: _body, code: _code, data: _data, value: _value, to: _to, bounce: _bounce };
}

export function storeTupleSendParameters(source: SendParameters) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    builder.writeNumber(source.value);
    builder.writeAddress(source.to);
    builder.writeBoolean(source.bounce);
    return builder.build();
}

export function dictValueParserSendParameters(): DictionaryValue<SendParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSendParameters(src)).endCell());
        },
        parse: (src) => {
            return loadSendParameters(src.loadRef().beginParse());
        }
    }
}

export type MessageParameters = {
    $$type: 'MessageParameters';
    mode: bigint;
    body: Cell | null;
    value: bigint;
    to: Address;
    bounce: boolean;
}

export function storeMessageParameters(src: MessageParameters) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        b_0.storeInt(src.value, 257);
        b_0.storeAddress(src.to);
        b_0.storeBit(src.bounce);
    };
}

export function loadMessageParameters(slice: Slice) {
    const sc_0 = slice;
    const _mode = sc_0.loadIntBig(257);
    const _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _value = sc_0.loadIntBig(257);
    const _to = sc_0.loadAddress();
    const _bounce = sc_0.loadBit();
    return { $$type: 'MessageParameters' as const, mode: _mode, body: _body, value: _value, to: _to, bounce: _bounce };
}

export function loadTupleMessageParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'MessageParameters' as const, mode: _mode, body: _body, value: _value, to: _to, bounce: _bounce };
}

export function loadGetterTupleMessageParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'MessageParameters' as const, mode: _mode, body: _body, value: _value, to: _to, bounce: _bounce };
}

export function storeTupleMessageParameters(source: MessageParameters) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeNumber(source.value);
    builder.writeAddress(source.to);
    builder.writeBoolean(source.bounce);
    return builder.build();
}

export function dictValueParserMessageParameters(): DictionaryValue<MessageParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeMessageParameters(src)).endCell());
        },
        parse: (src) => {
            return loadMessageParameters(src.loadRef().beginParse());
        }
    }
}

export type DeployParameters = {
    $$type: 'DeployParameters';
    mode: bigint;
    body: Cell | null;
    value: bigint;
    bounce: boolean;
    init: StateInit;
}

export function storeDeployParameters(src: DeployParameters) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        b_0.storeInt(src.value, 257);
        b_0.storeBit(src.bounce);
        b_0.store(storeStateInit(src.init));
    };
}

export function loadDeployParameters(slice: Slice) {
    const sc_0 = slice;
    const _mode = sc_0.loadIntBig(257);
    const _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _value = sc_0.loadIntBig(257);
    const _bounce = sc_0.loadBit();
    const _init = loadStateInit(sc_0);
    return { $$type: 'DeployParameters' as const, mode: _mode, body: _body, value: _value, bounce: _bounce, init: _init };
}

export function loadTupleDeployParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _bounce = source.readBoolean();
    const _init = loadTupleStateInit(source);
    return { $$type: 'DeployParameters' as const, mode: _mode, body: _body, value: _value, bounce: _bounce, init: _init };
}

export function loadGetterTupleDeployParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _bounce = source.readBoolean();
    const _init = loadGetterTupleStateInit(source);
    return { $$type: 'DeployParameters' as const, mode: _mode, body: _body, value: _value, bounce: _bounce, init: _init };
}

export function storeTupleDeployParameters(source: DeployParameters) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeNumber(source.value);
    builder.writeBoolean(source.bounce);
    builder.writeTuple(storeTupleStateInit(source.init));
    return builder.build();
}

export function dictValueParserDeployParameters(): DictionaryValue<DeployParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeployParameters(src)).endCell());
        },
        parse: (src) => {
            return loadDeployParameters(src.loadRef().beginParse());
        }
    }
}

export type StdAddress = {
    $$type: 'StdAddress';
    workchain: bigint;
    address: bigint;
}

export function storeStdAddress(src: StdAddress) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.workchain, 8);
        b_0.storeUint(src.address, 256);
    };
}

export function loadStdAddress(slice: Slice) {
    const sc_0 = slice;
    const _workchain = sc_0.loadIntBig(8);
    const _address = sc_0.loadUintBig(256);
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

export function loadTupleStdAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readBigNumber();
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

export function loadGetterTupleStdAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readBigNumber();
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

export function storeTupleStdAddress(source: StdAddress) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.workchain);
    builder.writeNumber(source.address);
    return builder.build();
}

export function dictValueParserStdAddress(): DictionaryValue<StdAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeStdAddress(src)).endCell());
        },
        parse: (src) => {
            return loadStdAddress(src.loadRef().beginParse());
        }
    }
}

export type VarAddress = {
    $$type: 'VarAddress';
    workchain: bigint;
    address: Slice;
}

export function storeVarAddress(src: VarAddress) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.workchain, 32);
        b_0.storeRef(src.address.asCell());
    };
}

export function loadVarAddress(slice: Slice) {
    const sc_0 = slice;
    const _workchain = sc_0.loadIntBig(32);
    const _address = sc_0.loadRef().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

export function loadTupleVarAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readCell().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

export function loadGetterTupleVarAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readCell().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

export function storeTupleVarAddress(source: VarAddress) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.workchain);
    builder.writeSlice(source.address.asCell());
    return builder.build();
}

export function dictValueParserVarAddress(): DictionaryValue<VarAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeVarAddress(src)).endCell());
        },
        parse: (src) => {
            return loadVarAddress(src.loadRef().beginParse());
        }
    }
}

export type BasechainAddress = {
    $$type: 'BasechainAddress';
    hash: bigint | null;
}

export function storeBasechainAddress(src: BasechainAddress) {
    return (builder: Builder) => {
        const b_0 = builder;
        if (src.hash !== null && src.hash !== undefined) { b_0.storeBit(true).storeInt(src.hash, 257); } else { b_0.storeBit(false); }
    };
}

export function loadBasechainAddress(slice: Slice) {
    const sc_0 = slice;
    const _hash = sc_0.loadBit() ? sc_0.loadIntBig(257) : null;
    return { $$type: 'BasechainAddress' as const, hash: _hash };
}

export function loadTupleBasechainAddress(source: TupleReader) {
    const _hash = source.readBigNumberOpt();
    return { $$type: 'BasechainAddress' as const, hash: _hash };
}

export function loadGetterTupleBasechainAddress(source: TupleReader) {
    const _hash = source.readBigNumberOpt();
    return { $$type: 'BasechainAddress' as const, hash: _hash };
}

export function storeTupleBasechainAddress(source: BasechainAddress) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.hash);
    return builder.build();
}

export function dictValueParserBasechainAddress(): DictionaryValue<BasechainAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeBasechainAddress(src)).endCell());
        },
        parse: (src) => {
            return loadBasechainAddress(src.loadRef().beginParse());
        }
    }
}

export type Deploy = {
    $$type: 'Deploy';
    queryId: bigint;
}

export function storeDeploy(src: Deploy) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2490013878, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadDeploy(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2490013878) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

export function loadTupleDeploy(source: TupleReader) {
    const _queryId = source.readBigNumber();
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

export function loadGetterTupleDeploy(source: TupleReader) {
    const _queryId = source.readBigNumber();
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

export function storeTupleDeploy(source: Deploy) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

export function dictValueParserDeploy(): DictionaryValue<Deploy> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadDeploy(src.loadRef().beginParse());
        }
    }
}

export type DeployOk = {
    $$type: 'DeployOk';
    queryId: bigint;
}

export function storeDeployOk(src: DeployOk) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2952335191, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadDeployOk(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2952335191) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

export function loadTupleDeployOk(source: TupleReader) {
    const _queryId = source.readBigNumber();
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

export function loadGetterTupleDeployOk(source: TupleReader) {
    const _queryId = source.readBigNumber();
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

export function storeTupleDeployOk(source: DeployOk) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

export function dictValueParserDeployOk(): DictionaryValue<DeployOk> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeployOk(src)).endCell());
        },
        parse: (src) => {
            return loadDeployOk(src.loadRef().beginParse());
        }
    }
}

export type FactoryDeploy = {
    $$type: 'FactoryDeploy';
    queryId: bigint;
    cashback: Address;
}

export function storeFactoryDeploy(src: FactoryDeploy) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(1829761339, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.cashback);
    };
}

export function loadFactoryDeploy(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1829761339) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    const _cashback = sc_0.loadAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

export function loadTupleFactoryDeploy(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _cashback = source.readAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

export function loadGetterTupleFactoryDeploy(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _cashback = source.readAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

export function storeTupleFactoryDeploy(source: FactoryDeploy) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.cashback);
    return builder.build();
}

export function dictValueParserFactoryDeploy(): DictionaryValue<FactoryDeploy> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeFactoryDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadFactoryDeploy(src.loadRef().beginParse());
        }
    }
}

export type JettonTransferNotification = {
    $$type: 'JettonTransferNotification';
    query_id: bigint;
    amount: bigint;
    sender: Address;
    forward_payload: Slice;
}

export function storeJettonTransferNotification(src: JettonTransferNotification) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(1935855772, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.sender);
        b_0.storeBuilder(src.forward_payload.asBuilder());
    };
}

export function loadJettonTransferNotification(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1935855772) { throw Error('Invalid prefix'); }
    const _query_id = sc_0.loadUintBig(64);
    const _amount = sc_0.loadCoins();
    const _sender = sc_0.loadAddress();
    const _forward_payload = sc_0;
    return { $$type: 'JettonTransferNotification' as const, query_id: _query_id, amount: _amount, sender: _sender, forward_payload: _forward_payload };
}

export function loadTupleJettonTransferNotification(source: TupleReader) {
    const _query_id = source.readBigNumber();
    const _amount = source.readBigNumber();
    const _sender = source.readAddress();
    const _forward_payload = source.readCell().asSlice();
    return { $$type: 'JettonTransferNotification' as const, query_id: _query_id, amount: _amount, sender: _sender, forward_payload: _forward_payload };
}

export function loadGetterTupleJettonTransferNotification(source: TupleReader) {
    const _query_id = source.readBigNumber();
    const _amount = source.readBigNumber();
    const _sender = source.readAddress();
    const _forward_payload = source.readCell().asSlice();
    return { $$type: 'JettonTransferNotification' as const, query_id: _query_id, amount: _amount, sender: _sender, forward_payload: _forward_payload };
}

export function storeTupleJettonTransferNotification(source: JettonTransferNotification) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeNumber(source.amount);
    builder.writeAddress(source.sender);
    builder.writeSlice(source.forward_payload.asCell());
    return builder.build();
}

export function dictValueParserJettonTransferNotification(): DictionaryValue<JettonTransferNotification> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeJettonTransferNotification(src)).endCell());
        },
        parse: (src) => {
            return loadJettonTransferNotification(src.loadRef().beginParse());
        }
    }
}

export type TokenTransfer = {
    $$type: 'TokenTransfer';
    query_id: bigint;
    amount: bigint;
    destination: Address;
    response_destination: Address;
    custom_payload: Cell | null;
    forward_ton_amount: bigint;
    forward_payload: Slice;
}

export function storeTokenTransfer(src: TokenTransfer) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(260734629, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.destination);
        b_0.storeAddress(src.response_destination);
        if (src.custom_payload !== null && src.custom_payload !== undefined) { b_0.storeBit(true).storeRef(src.custom_payload); } else { b_0.storeBit(false); }
        b_0.storeCoins(src.forward_ton_amount);
        b_0.storeBuilder(src.forward_payload.asBuilder());
    };
}

export function loadTokenTransfer(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 260734629) { throw Error('Invalid prefix'); }
    const _query_id = sc_0.loadUintBig(64);
    const _amount = sc_0.loadCoins();
    const _destination = sc_0.loadAddress();
    const _response_destination = sc_0.loadAddress();
    const _custom_payload = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _forward_ton_amount = sc_0.loadCoins();
    const _forward_payload = sc_0;
    return { $$type: 'TokenTransfer' as const, query_id: _query_id, amount: _amount, destination: _destination, response_destination: _response_destination, custom_payload: _custom_payload, forward_ton_amount: _forward_ton_amount, forward_payload: _forward_payload };
}

export function loadTupleTokenTransfer(source: TupleReader) {
    const _query_id = source.readBigNumber();
    const _amount = source.readBigNumber();
    const _destination = source.readAddress();
    const _response_destination = source.readAddress();
    const _custom_payload = source.readCellOpt();
    const _forward_ton_amount = source.readBigNumber();
    const _forward_payload = source.readCell().asSlice();
    return { $$type: 'TokenTransfer' as const, query_id: _query_id, amount: _amount, destination: _destination, response_destination: _response_destination, custom_payload: _custom_payload, forward_ton_amount: _forward_ton_amount, forward_payload: _forward_payload };
}

export function loadGetterTupleTokenTransfer(source: TupleReader) {
    const _query_id = source.readBigNumber();
    const _amount = source.readBigNumber();
    const _destination = source.readAddress();
    const _response_destination = source.readAddress();
    const _custom_payload = source.readCellOpt();
    const _forward_ton_amount = source.readBigNumber();
    const _forward_payload = source.readCell().asSlice();
    return { $$type: 'TokenTransfer' as const, query_id: _query_id, amount: _amount, destination: _destination, response_destination: _response_destination, custom_payload: _custom_payload, forward_ton_amount: _forward_ton_amount, forward_payload: _forward_payload };
}

export function storeTupleTokenTransfer(source: TokenTransfer) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeNumber(source.amount);
    builder.writeAddress(source.destination);
    builder.writeAddress(source.response_destination);
    builder.writeCell(source.custom_payload);
    builder.writeNumber(source.forward_ton_amount);
    builder.writeSlice(source.forward_payload.asCell());
    return builder.build();
}

export function dictValueParserTokenTransfer(): DictionaryValue<TokenTransfer> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeTokenTransfer(src)).endCell());
        },
        parse: (src) => {
            return loadTokenTransfer(src.loadRef().beginParse());
        }
    }
}

export type Withdraw = {
    $$type: 'Withdraw';
    token: Address | null;
    amount: bigint;
}

export function storeWithdraw(src: Withdraw) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(1520742196, 32);
        b_0.storeAddress(src.token);
        b_0.storeCoins(src.amount);
    };
}

export function loadWithdraw(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1520742196) { throw Error('Invalid prefix'); }
    const _token = sc_0.loadMaybeAddress();
    const _amount = sc_0.loadCoins();
    return { $$type: 'Withdraw' as const, token: _token, amount: _amount };
}

export function loadTupleWithdraw(source: TupleReader) {
    const _token = source.readAddressOpt();
    const _amount = source.readBigNumber();
    return { $$type: 'Withdraw' as const, token: _token, amount: _amount };
}

export function loadGetterTupleWithdraw(source: TupleReader) {
    const _token = source.readAddressOpt();
    const _amount = source.readBigNumber();
    return { $$type: 'Withdraw' as const, token: _token, amount: _amount };
}

export function storeTupleWithdraw(source: Withdraw) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.token);
    builder.writeNumber(source.amount);
    return builder.build();
}

export function dictValueParserWithdraw(): DictionaryValue<Withdraw> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeWithdraw(src)).endCell());
        },
        parse: (src) => {
            return loadWithdraw(src.loadRef().beginParse());
        }
    }
}

export type Trade = {
    $$type: 'Trade';
    tokenGet: Address | null;
    amountGet: bigint;
    tokenGive: Address | null;
    amountGive: bigint;
    expires: bigint;
    nonce: bigint;
    maker: Address;
    amount: bigint;
    signature: Slice;
}

export function storeTrade(src: Trade) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2206569544, 32);
        b_0.storeAddress(src.tokenGet);
        b_0.storeCoins(src.amountGet);
        b_0.storeAddress(src.tokenGive);
        b_0.storeCoins(src.amountGive);
        b_0.storeUint(src.expires, 32);
        b_0.storeUint(src.nonce, 64);
        const b_1 = new Builder();
        b_1.storeAddress(src.maker);
        b_1.storeCoins(src.amount);
        b_1.storeRef(src.signature.asCell());
        b_0.storeRef(b_1.endCell());
    };
}

export function loadTrade(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2206569544) { throw Error('Invalid prefix'); }
    const _tokenGet = sc_0.loadMaybeAddress();
    const _amountGet = sc_0.loadCoins();
    const _tokenGive = sc_0.loadMaybeAddress();
    const _amountGive = sc_0.loadCoins();
    const _expires = sc_0.loadUintBig(32);
    const _nonce = sc_0.loadUintBig(64);
    const sc_1 = sc_0.loadRef().beginParse();
    const _maker = sc_1.loadAddress();
    const _amount = sc_1.loadCoins();
    const _signature = sc_1.loadRef().asSlice();
    return { $$type: 'Trade' as const, tokenGet: _tokenGet, amountGet: _amountGet, tokenGive: _tokenGive, amountGive: _amountGive, expires: _expires, nonce: _nonce, maker: _maker, amount: _amount, signature: _signature };
}

export function loadTupleTrade(source: TupleReader) {
    const _tokenGet = source.readAddressOpt();
    const _amountGet = source.readBigNumber();
    const _tokenGive = source.readAddressOpt();
    const _amountGive = source.readBigNumber();
    const _expires = source.readBigNumber();
    const _nonce = source.readBigNumber();
    const _maker = source.readAddress();
    const _amount = source.readBigNumber();
    const _signature = source.readCell().asSlice();
    return { $$type: 'Trade' as const, tokenGet: _tokenGet, amountGet: _amountGet, tokenGive: _tokenGive, amountGive: _amountGive, expires: _expires, nonce: _nonce, maker: _maker, amount: _amount, signature: _signature };
}

export function loadGetterTupleTrade(source: TupleReader) {
    const _tokenGet = source.readAddressOpt();
    const _amountGet = source.readBigNumber();
    const _tokenGive = source.readAddressOpt();
    const _amountGive = source.readBigNumber();
    const _expires = source.readBigNumber();
    const _nonce = source.readBigNumber();
    const _maker = source.readAddress();
    const _amount = source.readBigNumber();
    const _signature = source.readCell().asSlice();
    return { $$type: 'Trade' as const, tokenGet: _tokenGet, amountGet: _amountGet, tokenGive: _tokenGive, amountGive: _amountGive, expires: _expires, nonce: _nonce, maker: _maker, amount: _amount, signature: _signature };
}

export function storeTupleTrade(source: Trade) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.tokenGet);
    builder.writeNumber(source.amountGet);
    builder.writeAddress(source.tokenGive);
    builder.writeNumber(source.amountGive);
    builder.writeNumber(source.expires);
    builder.writeNumber(source.nonce);
    builder.writeAddress(source.maker);
    builder.writeNumber(source.amount);
    builder.writeSlice(source.signature.asCell());
    return builder.build();
}

export function dictValueParserTrade(): DictionaryValue<Trade> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeTrade(src)).endCell());
        },
        parse: (src) => {
            return loadTrade(src.loadRef().beginParse());
        }
    }
}

export type Order = {
    $$type: 'Order';
    tokenGet: Address | null;
    amountGet: bigint;
    tokenGive: Address | null;
    amountGive: bigint;
    expires: bigint;
    nonce: bigint;
    maker: Address;
}

export function storeOrder(src: Order) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(634641944, 32);
        b_0.storeAddress(src.tokenGet);
        b_0.storeCoins(src.amountGet);
        b_0.storeAddress(src.tokenGive);
        b_0.storeCoins(src.amountGive);
        b_0.storeUint(src.expires, 32);
        b_0.storeUint(src.nonce, 64);
        const b_1 = new Builder();
        b_1.storeAddress(src.maker);
        b_0.storeRef(b_1.endCell());
    };
}

export function loadOrder(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 634641944) { throw Error('Invalid prefix'); }
    const _tokenGet = sc_0.loadMaybeAddress();
    const _amountGet = sc_0.loadCoins();
    const _tokenGive = sc_0.loadMaybeAddress();
    const _amountGive = sc_0.loadCoins();
    const _expires = sc_0.loadUintBig(32);
    const _nonce = sc_0.loadUintBig(64);
    const sc_1 = sc_0.loadRef().beginParse();
    const _maker = sc_1.loadAddress();
    return { $$type: 'Order' as const, tokenGet: _tokenGet, amountGet: _amountGet, tokenGive: _tokenGive, amountGive: _amountGive, expires: _expires, nonce: _nonce, maker: _maker };
}

export function loadTupleOrder(source: TupleReader) {
    const _tokenGet = source.readAddressOpt();
    const _amountGet = source.readBigNumber();
    const _tokenGive = source.readAddressOpt();
    const _amountGive = source.readBigNumber();
    const _expires = source.readBigNumber();
    const _nonce = source.readBigNumber();
    const _maker = source.readAddress();
    return { $$type: 'Order' as const, tokenGet: _tokenGet, amountGet: _amountGet, tokenGive: _tokenGive, amountGive: _amountGive, expires: _expires, nonce: _nonce, maker: _maker };
}

export function loadGetterTupleOrder(source: TupleReader) {
    const _tokenGet = source.readAddressOpt();
    const _amountGet = source.readBigNumber();
    const _tokenGive = source.readAddressOpt();
    const _amountGive = source.readBigNumber();
    const _expires = source.readBigNumber();
    const _nonce = source.readBigNumber();
    const _maker = source.readAddress();
    return { $$type: 'Order' as const, tokenGet: _tokenGet, amountGet: _amountGet, tokenGive: _tokenGive, amountGive: _amountGive, expires: _expires, nonce: _nonce, maker: _maker };
}

export function storeTupleOrder(source: Order) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.tokenGet);
    builder.writeNumber(source.amountGet);
    builder.writeAddress(source.tokenGive);
    builder.writeNumber(source.amountGive);
    builder.writeNumber(source.expires);
    builder.writeNumber(source.nonce);
    builder.writeAddress(source.maker);
    return builder.build();
}

export function dictValueParserOrder(): DictionaryValue<Order> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeOrder(src)).endCell());
        },
        parse: (src) => {
            return loadOrder(src.loadRef().beginParse());
        }
    }
}

export type CancelOrder = {
    $$type: 'CancelOrder';
    tokenGet: Address | null;
    amountGet: bigint;
    tokenGive: Address | null;
    amountGive: bigint;
    expires: bigint;
    nonce: bigint;
}

export function storeCancelOrder(src: CancelOrder) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(3846700023, 32);
        b_0.storeAddress(src.tokenGet);
        b_0.storeCoins(src.amountGet);
        b_0.storeAddress(src.tokenGive);
        b_0.storeCoins(src.amountGive);
        b_0.storeUint(src.expires, 32);
        b_0.storeUint(src.nonce, 64);
    };
}

export function loadCancelOrder(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 3846700023) { throw Error('Invalid prefix'); }
    const _tokenGet = sc_0.loadMaybeAddress();
    const _amountGet = sc_0.loadCoins();
    const _tokenGive = sc_0.loadMaybeAddress();
    const _amountGive = sc_0.loadCoins();
    const _expires = sc_0.loadUintBig(32);
    const _nonce = sc_0.loadUintBig(64);
    return { $$type: 'CancelOrder' as const, tokenGet: _tokenGet, amountGet: _amountGet, tokenGive: _tokenGive, amountGive: _amountGive, expires: _expires, nonce: _nonce };
}

export function loadTupleCancelOrder(source: TupleReader) {
    const _tokenGet = source.readAddressOpt();
    const _amountGet = source.readBigNumber();
    const _tokenGive = source.readAddressOpt();
    const _amountGive = source.readBigNumber();
    const _expires = source.readBigNumber();
    const _nonce = source.readBigNumber();
    return { $$type: 'CancelOrder' as const, tokenGet: _tokenGet, amountGet: _amountGet, tokenGive: _tokenGive, amountGive: _amountGive, expires: _expires, nonce: _nonce };
}

export function loadGetterTupleCancelOrder(source: TupleReader) {
    const _tokenGet = source.readAddressOpt();
    const _amountGet = source.readBigNumber();
    const _tokenGive = source.readAddressOpt();
    const _amountGive = source.readBigNumber();
    const _expires = source.readBigNumber();
    const _nonce = source.readBigNumber();
    return { $$type: 'CancelOrder' as const, tokenGet: _tokenGet, amountGet: _amountGet, tokenGive: _tokenGive, amountGive: _amountGive, expires: _expires, nonce: _nonce };
}

export function storeTupleCancelOrder(source: CancelOrder) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.tokenGet);
    builder.writeNumber(source.amountGet);
    builder.writeAddress(source.tokenGive);
    builder.writeNumber(source.amountGive);
    builder.writeNumber(source.expires);
    builder.writeNumber(source.nonce);
    return builder.build();
}

export function dictValueParserCancelOrder(): DictionaryValue<CancelOrder> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeCancelOrder(src)).endCell());
        },
        parse: (src) => {
            return loadCancelOrder(src.loadRef().beginParse());
        }
    }
}

export type TonDelta$Data = {
    $$type: 'TonDelta$Data';
    owner: Address;
    balances: Dictionary<Address, bigint>;
    orderFills: Dictionary<Address, bigint>;
    orders: Dictionary<Address, boolean>;
}

export function storeTonDelta$Data(src: TonDelta$Data) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.owner);
        b_0.storeDict(src.balances, Dictionary.Keys.Address(), Dictionary.Values.BigInt(257));
        b_0.storeDict(src.orderFills, Dictionary.Keys.Address(), Dictionary.Values.BigInt(257));
        b_0.storeDict(src.orders, Dictionary.Keys.Address(), Dictionary.Values.Bool());
    };
}

export function loadTonDelta$Data(slice: Slice) {
    const sc_0 = slice;
    const _owner = sc_0.loadAddress();
    const _balances = Dictionary.load(Dictionary.Keys.Address(), Dictionary.Values.BigInt(257), sc_0);
    const _orderFills = Dictionary.load(Dictionary.Keys.Address(), Dictionary.Values.BigInt(257), sc_0);
    const _orders = Dictionary.load(Dictionary.Keys.Address(), Dictionary.Values.Bool(), sc_0);
    return { $$type: 'TonDelta$Data' as const, owner: _owner, balances: _balances, orderFills: _orderFills, orders: _orders };
}

export function loadTupleTonDelta$Data(source: TupleReader) {
    const _owner = source.readAddress();
    const _balances = Dictionary.loadDirect(Dictionary.Keys.Address(), Dictionary.Values.BigInt(257), source.readCellOpt());
    const _orderFills = Dictionary.loadDirect(Dictionary.Keys.Address(), Dictionary.Values.BigInt(257), source.readCellOpt());
    const _orders = Dictionary.loadDirect(Dictionary.Keys.Address(), Dictionary.Values.Bool(), source.readCellOpt());
    return { $$type: 'TonDelta$Data' as const, owner: _owner, balances: _balances, orderFills: _orderFills, orders: _orders };
}

export function loadGetterTupleTonDelta$Data(source: TupleReader) {
    const _owner = source.readAddress();
    const _balances = Dictionary.loadDirect(Dictionary.Keys.Address(), Dictionary.Values.BigInt(257), source.readCellOpt());
    const _orderFills = Dictionary.loadDirect(Dictionary.Keys.Address(), Dictionary.Values.BigInt(257), source.readCellOpt());
    const _orders = Dictionary.loadDirect(Dictionary.Keys.Address(), Dictionary.Values.Bool(), source.readCellOpt());
    return { $$type: 'TonDelta$Data' as const, owner: _owner, balances: _balances, orderFills: _orderFills, orders: _orders };
}

export function storeTupleTonDelta$Data(source: TonDelta$Data) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.owner);
    builder.writeCell(source.balances.size > 0 ? beginCell().storeDictDirect(source.balances, Dictionary.Keys.Address(), Dictionary.Values.BigInt(257)).endCell() : null);
    builder.writeCell(source.orderFills.size > 0 ? beginCell().storeDictDirect(source.orderFills, Dictionary.Keys.Address(), Dictionary.Values.BigInt(257)).endCell() : null);
    builder.writeCell(source.orders.size > 0 ? beginCell().storeDictDirect(source.orders, Dictionary.Keys.Address(), Dictionary.Values.Bool()).endCell() : null);
    return builder.build();
}

export function dictValueParserTonDelta$Data(): DictionaryValue<TonDelta$Data> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeTonDelta$Data(src)).endCell());
        },
        parse: (src) => {
            return loadTonDelta$Data(src.loadRef().beginParse());
        }
    }
}

type TonDelta_init_args = {
    $$type: 'TonDelta_init_args';
}

function initTonDelta_init_args(src: TonDelta_init_args) {
    return (builder: Builder) => {
        const b_0 = builder;
    };
}

async function TonDelta_init() {
    const __code = Cell.fromHex('b5ee9c72410219010008ab00022cff008e88f4a413f4bcf2c80bed53208e8130e1ed43d90106020378e002040159b96c0ed44d0d200018e12fa40f404d401d0f404f40430102410236c1498306d6d6df8425520e25513db3c6c418030174db3c2381010b228101014133f40a6fa19401d70030925b6de26e923070e081010b24028101014133f40a6fa19401d70030925b6de2206ef2d080180159b8789ed44d0d200018e12fa40f404d401d0f404f40430102410236c1498306d6d6df8425520e25563db3c6c418050174db3c2281010b228101014133f40a6fa19401d70030925b6de26e923070e081010b23028101014133f40a6fa19401d70030925b6de2206ef2d0801504d001d072d721d200d200fa4021103450666f04f86102f862ed44d0d200018e12fa40f404d401d0f404f40430102410236c1498306d6d6df8425520e205e3027024d74920c21f953104d31f05de2182107362d09cbae3022182105aa4af34bae30221821083859448ba0708090d01fe33f8416f243032103443506ddb3c702481010b238101014133f40a6fa19401d70030925b6de26eb38e1d302381010b228101014133f40a6fa19401d70030925b6de2206ef2d080de81010b07a010341026810101216e955b59f4593098c801cf004133f441e24013c87f01ca0055305034cef40001c8f40012f400cdc9ed541802e85b03d33f31fa00fa4030f8416f2410235f03104510341026db3c702481010b238101014133f40a6fa19401d70030925b6de26eb38e1d302381010b228101014133f40a6fa19401d70030925b6de2206ef2d080de81010b07a010341026810101216e955b59f4593098c801cf004133f441e24013181202de5b03d72c01916d93fa4001e201fa0030f8416f2410235f0310345e505364db3c702481010b238101014133f40a6fa19401d70030925b6de26eb38e1d302381010b228101014133f40a6fa19401d70030925b6de2206ef2d080de8200d5575318bef2f481010b5118a1103512810101180a02e2216e955b59f4593098c801cf004133f441e2246e8ec03480407f881048103710246d50436d03c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00e30e5023c87f01ca0055305034cef40001c8f40012f400cdc9ed540b0c001c000000005769746864726177616c00e204206ef2d0807080407f226d718b082d1046105d040e5520c8556082100f8a7ea55008cb1f16cb3f5004fa0212cecef40001fa02cec94430487010246d50436d03c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb0003f68f775b03d72c01916d93fa4001e201fa00d72c01916d93fa4001e201fa00d31fd33fd430d0fa40fa0030f8416f2410235f0328106b105a104c103d54483028544d3f1d5610db3c8148562281010b23714133f40a6fa19401d70030925b6de27f216e925b7091bae2f2f45198a826a904702381010b2c810101e021150e1302fc4133f40a6fa19401d70030925b6de26eb38e1d302281010b2b8101014133f40a6fa19401d70030925b6de2206ef2d080de8200caee531aa05009bb18f2f4553053a7db3c702481010b238101014133f40a6fa19401d70030925b6de26eb38e1d302381010b228101014133f40a6fa19401d70030925b6de2206ef2d080de180f02e6812e1a531bbef2f481010b511ba1103512810101216e955b59f4593098c801cf004133f441e2035422b508db3c702481010b238101014133f40a6fa19401d70030925b6de26eb38e1d302381010b228101014133f40a6fa19401d70030925b6de2206ef2d080de81010b511aa0103512810101181002fe216e955b59f4593098c801cf004133f441e203045412aadb3c702481010b238101014133f40a6fa19401d70030925b6de26eb38e1d302381010b228101014133f40a6fa19401d70030925b6de2206ef2d080de8200ba195318bef2f481010b5118a1103512810101216e955b59f4593098c801cf004133f441e21035045039181102f618db3c702481010b238101014133f40a6fa19401d70030925b6de26eb38e1d302381010b228101014133f40a6fa19401d70030925b6de2206ef2d080de81010b09a010341028810101216e955b59f4593098c801cf004133f441e20681010b04a0433014810101216e955b59f4593098c801cf004133f441e243031812002ec87f01ca0055305034cef40001c8f40012f400cdc9ed5403fe821025d3de18ba8eeb5b03d72c01916d93fa4001e201fa00d72c01916d93fa4001e201fa00d31fd33fd430d0fa4030f8416f245b81709b3222c705f2f4108a10791078db3c81010b017f71216e955b59f4593098c801cf004133f441e2c87f01ca0055305034cef40001c8f40012f400cdc9ed54e0218210e547fbf7bae30215141601c05b03d72c01916d93fa4001e201fa00d72c01916d93fa4001e201fa00d31fd33f30f8416f2410235f03108a10791078db3c81010b017071216e955b59f4593098c801cf004133f441e2c87f01ca0055305034cef40001c8f40012f400cdc9ed54150094c8276eb39907206ef2d08017cf169637705007cb01e25005fa02236eb39903206ef2d08013cf169633705003cb01e201fa02cb1fcb3f01cf16c9f9007001c87401cb0212ca07cbffc9d001d4218210946a98b6ba8e505b03d33f30c8018210aff90f5758cb1fcb3fc9443012f84270705003804201503304c8cf8580ca00cf8440ce01fa02806acf40f400c901fb00c87f01ca0055305034cef40001c8f40012f400cdc9ed54e035c00004c12114b0e3025f04f2c0821701fcf8416f243032103443506ddb3c702481010b238101014133f40a6fa19401d70030925b6de26eb38e1d302381010b228101014133f40a6fa19401d70030925b6de2206ef2d080de81010b07a010341026810101216e955b59f4593098c801cf004133f441e24013c87f01ca0055305034cef40001c8f40012f400cdc9ed5418004ec858cf16216eb39801206ef2d080cf16947032cb07e2c9f9007001c87401cb0212ca07cbffc9d029cb0682');
    const builder = beginCell();
    builder.storeUint(0, 1);
    initTonDelta_init_args({ $$type: 'TonDelta_init_args' })(builder);
    const __data = builder.endCell();
    return { code: __code, data: __data };
}

export const TonDelta_errors = {
    2: { message: "Stack underflow" },
    3: { message: "Stack overflow" },
    4: { message: "Integer overflow" },
    5: { message: "Integer out of expected range" },
    6: { message: "Invalid opcode" },
    7: { message: "Type check error" },
    8: { message: "Cell overflow" },
    9: { message: "Cell underflow" },
    10: { message: "Dictionary error" },
    11: { message: "'Unknown' error" },
    12: { message: "Fatal error" },
    13: { message: "Out of gas error" },
    14: { message: "Virtualization error" },
    32: { message: "Action list is invalid" },
    33: { message: "Action list is too long" },
    34: { message: "Action is invalid or not supported" },
    35: { message: "Invalid source address in outbound message" },
    36: { message: "Invalid destination address in outbound message" },
    37: { message: "Not enough Toncoin" },
    38: { message: "Not enough extra currencies" },
    39: { message: "Outbound message does not fit into a cell after rewriting" },
    40: { message: "Cannot process a message" },
    41: { message: "Library reference is null" },
    42: { message: "Library change action error" },
    43: { message: "Exceeded maximum number of cells in the library or the maximum depth of the Merkle tree" },
    50: { message: "Account state size exceeded limits" },
    128: { message: "Null reference exception" },
    129: { message: "Invalid serialization prefix" },
    130: { message: "Invalid incoming message" },
    131: { message: "Constraints error" },
    132: { message: "Access denied" },
    133: { message: "Contract stopped" },
    134: { message: "Invalid argument" },
    135: { message: "Code of a contract was not found" },
    136: { message: "Invalid standard address" },
    138: { message: "Not a basechain address" },
    11802: { message: "Taker balance too low" },
    18518: { message: "Order not found" },
    28827: { message: "Invalid maker" },
    47641: { message: "Maker balance too low" },
    51950: { message: "Order already filled" },
    54615: { message: "Insufficient balance" },
} as const

export const TonDelta_errors_backward = {
    "Stack underflow": 2,
    "Stack overflow": 3,
    "Integer overflow": 4,
    "Integer out of expected range": 5,
    "Invalid opcode": 6,
    "Type check error": 7,
    "Cell overflow": 8,
    "Cell underflow": 9,
    "Dictionary error": 10,
    "'Unknown' error": 11,
    "Fatal error": 12,
    "Out of gas error": 13,
    "Virtualization error": 14,
    "Action list is invalid": 32,
    "Action list is too long": 33,
    "Action is invalid or not supported": 34,
    "Invalid source address in outbound message": 35,
    "Invalid destination address in outbound message": 36,
    "Not enough Toncoin": 37,
    "Not enough extra currencies": 38,
    "Outbound message does not fit into a cell after rewriting": 39,
    "Cannot process a message": 40,
    "Library reference is null": 41,
    "Library change action error": 42,
    "Exceeded maximum number of cells in the library or the maximum depth of the Merkle tree": 43,
    "Account state size exceeded limits": 50,
    "Null reference exception": 128,
    "Invalid serialization prefix": 129,
    "Invalid incoming message": 130,
    "Constraints error": 131,
    "Access denied": 132,
    "Contract stopped": 133,
    "Invalid argument": 134,
    "Code of a contract was not found": 135,
    "Invalid standard address": 136,
    "Not a basechain address": 138,
    "Taker balance too low": 11802,
    "Order not found": 18518,
    "Invalid maker": 28827,
    "Maker balance too low": 47641,
    "Order already filled": 51950,
    "Insufficient balance": 54615,
} as const

const TonDelta_types: ABIType[] = [
    { "name": "DataSize", "header": null, "fields": [{ "name": "cells", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "bits", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "refs", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }] },
    { "name": "SignedBundle", "header": null, "fields": [{ "name": "signature", "type": { "kind": "simple", "type": "fixed-bytes", "optional": false, "format": 64 } }, { "name": "signedData", "type": { "kind": "simple", "type": "slice", "optional": false, "format": "remainder" } }] },
    { "name": "StateInit", "header": null, "fields": [{ "name": "code", "type": { "kind": "simple", "type": "cell", "optional": false } }, { "name": "data", "type": { "kind": "simple", "type": "cell", "optional": false } }] },
    { "name": "Context", "header": null, "fields": [{ "name": "bounceable", "type": { "kind": "simple", "type": "bool", "optional": false } }, { "name": "sender", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "value", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "raw", "type": { "kind": "simple", "type": "slice", "optional": false } }] },
    { "name": "SendParameters", "header": null, "fields": [{ "name": "mode", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "body", "type": { "kind": "simple", "type": "cell", "optional": true } }, { "name": "code", "type": { "kind": "simple", "type": "cell", "optional": true } }, { "name": "data", "type": { "kind": "simple", "type": "cell", "optional": true } }, { "name": "value", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "to", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "bounce", "type": { "kind": "simple", "type": "bool", "optional": false } }] },
    { "name": "MessageParameters", "header": null, "fields": [{ "name": "mode", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "body", "type": { "kind": "simple", "type": "cell", "optional": true } }, { "name": "value", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "to", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "bounce", "type": { "kind": "simple", "type": "bool", "optional": false } }] },
    { "name": "DeployParameters", "header": null, "fields": [{ "name": "mode", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "body", "type": { "kind": "simple", "type": "cell", "optional": true } }, { "name": "value", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "bounce", "type": { "kind": "simple", "type": "bool", "optional": false } }, { "name": "init", "type": { "kind": "simple", "type": "StateInit", "optional": false } }] },
    { "name": "StdAddress", "header": null, "fields": [{ "name": "workchain", "type": { "kind": "simple", "type": "int", "optional": false, "format": 8 } }, { "name": "address", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }] },
    { "name": "VarAddress", "header": null, "fields": [{ "name": "workchain", "type": { "kind": "simple", "type": "int", "optional": false, "format": 32 } }, { "name": "address", "type": { "kind": "simple", "type": "slice", "optional": false } }] },
    { "name": "BasechainAddress", "header": null, "fields": [{ "name": "hash", "type": { "kind": "simple", "type": "int", "optional": true, "format": 257 } }] },
    { "name": "Deploy", "header": 2490013878, "fields": [{ "name": "queryId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }] },
    { "name": "DeployOk", "header": 2952335191, "fields": [{ "name": "queryId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }] },
    { "name": "FactoryDeploy", "header": 1829761339, "fields": [{ "name": "queryId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "cashback", "type": { "kind": "simple", "type": "address", "optional": false } }] },
    { "name": "JettonTransferNotification", "header": 1935855772, "fields": [{ "name": "query_id", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "amount", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "sender", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "forward_payload", "type": { "kind": "simple", "type": "slice", "optional": false, "format": "remainder" } }] },
    { "name": "TokenTransfer", "header": 260734629, "fields": [{ "name": "query_id", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "amount", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "destination", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "response_destination", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "custom_payload", "type": { "kind": "simple", "type": "cell", "optional": true } }, { "name": "forward_ton_amount", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "forward_payload", "type": { "kind": "simple", "type": "slice", "optional": false, "format": "remainder" } }] },
    { "name": "Withdraw", "header": 1520742196, "fields": [{ "name": "token", "type": { "kind": "simple", "type": "address", "optional": true } }, { "name": "amount", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }] },
    { "name": "Trade", "header": 2206569544, "fields": [{ "name": "tokenGet", "type": { "kind": "simple", "type": "address", "optional": true } }, { "name": "amountGet", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "tokenGive", "type": { "kind": "simple", "type": "address", "optional": true } }, { "name": "amountGive", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "expires", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 32 } }, { "name": "nonce", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "maker", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "amount", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "signature", "type": { "kind": "simple", "type": "slice", "optional": false } }] },
    { "name": "Order", "header": 634641944, "fields": [{ "name": "tokenGet", "type": { "kind": "simple", "type": "address", "optional": true } }, { "name": "amountGet", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "tokenGive", "type": { "kind": "simple", "type": "address", "optional": true } }, { "name": "amountGive", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "expires", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 32 } }, { "name": "nonce", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "maker", "type": { "kind": "simple", "type": "address", "optional": false } }] },
    { "name": "CancelOrder", "header": 3846700023, "fields": [{ "name": "tokenGet", "type": { "kind": "simple", "type": "address", "optional": true } }, { "name": "amountGet", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "tokenGive", "type": { "kind": "simple", "type": "address", "optional": true } }, { "name": "amountGive", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "expires", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 32 } }, { "name": "nonce", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }] },
    { "name": "TonDelta$Data", "header": null, "fields": [{ "name": "owner", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "balances", "type": { "kind": "dict", "key": "address", "value": "int" } }, { "name": "orderFills", "type": { "kind": "dict", "key": "address", "value": "int" } }, { "name": "orders", "type": { "kind": "dict", "key": "address", "value": "bool" } }] },
]

const TonDelta_opcodes = {
    "Deploy": 2490013878,
    "DeployOk": 2952335191,
    "FactoryDeploy": 1829761339,
    "JettonTransferNotification": 1935855772,
    "TokenTransfer": 260734629,
    "Withdraw": 1520742196,
    "Trade": 2206569544,
    "Order": 634641944,
    "CancelOrder": 3846700023,
}

const TonDelta_getters: ABIGetter[] = [
    { "name": "balance", "methodId": 104128, "arguments": [{ "name": "user", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "token", "type": { "kind": "simple", "type": "address", "optional": true } }], "returnType": { "kind": "simple", "type": "int", "optional": false, "format": 257 } },
    { "name": "orderFill", "methodId": 116617, "arguments": [{ "name": "tokenGet", "type": { "kind": "simple", "type": "address", "optional": true } }, { "name": "amountGet", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "tokenGive", "type": { "kind": "simple", "type": "address", "optional": true } }, { "name": "amountGive", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "expires", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "nonce", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "maker", "type": { "kind": "simple", "type": "address", "optional": false } }], "returnType": { "kind": "simple", "type": "int", "optional": false, "format": 257 } },
]

export const TonDelta_getterMapping: { [key: string]: string } = {
    'balance': 'getBalance',
    'orderFill': 'getOrderFill',
}

const TonDelta_receivers: ABIReceiver[] = [
    { "receiver": "internal", "message": { "kind": "empty" } },
    { "receiver": "internal", "message": { "kind": "typed", "type": "JettonTransferNotification" } },
    { "receiver": "internal", "message": { "kind": "typed", "type": "Withdraw" } },
    { "receiver": "internal", "message": { "kind": "typed", "type": "Trade" } },
    { "receiver": "internal", "message": { "kind": "typed", "type": "Order" } },
    { "receiver": "internal", "message": { "kind": "typed", "type": "CancelOrder" } },
    { "receiver": "internal", "message": { "kind": "typed", "type": "Deploy" } },
]


export class TonDelta implements Contract {

    public static readonly storageReserve = 0n;
    public static readonly errors = TonDelta_errors_backward;
    public static readonly opcodes = TonDelta_opcodes;

    static async init() {
        return await TonDelta_init();
    }

    static async fromInit() {
        const __gen_init = await TonDelta_init();
        const address = contractAddress(0, __gen_init);
        return new TonDelta(address, __gen_init);
    }

    static fromAddress(address: Address) {
        return new TonDelta(address);
    }

    readonly address: Address;
    readonly init?: { code: Cell, data: Cell };
    readonly abi: ContractABI = {
        types: TonDelta_types,
        getters: TonDelta_getters,
        receivers: TonDelta_receivers,
        errors: TonDelta_errors,
    };

    constructor(address: Address, init?: { code: Cell, data: Cell }) {
        this.address = address;
        this.init = init;
    }

    async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean | null | undefined }, message: null | JettonTransferNotification | Withdraw | Trade | Order | CancelOrder | Deploy) {

        let body: Cell | null = null;
        if (message === null) {
            body = new Cell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'JettonTransferNotification') {
            body = beginCell().store(storeJettonTransferNotification(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Withdraw') {
            body = beginCell().store(storeWithdraw(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Trade') {
            body = beginCell().store(storeTrade(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Order') {
            body = beginCell().store(storeOrder(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'CancelOrder') {
            body = beginCell().store(storeCancelOrder(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Deploy') {
            body = beginCell().store(storeDeploy(message)).endCell();
        }
        if (body === null) { throw new Error('Invalid message type'); }

        await provider.internal(via, { ...args, body: body });

    }

    async getBalance(provider: ContractProvider, user: Address, token: Address | null) {
        const builder = new TupleBuilder();
        builder.writeAddress(user);
        builder.writeAddress(token);
        const source = (await provider.get('balance', builder.build())).stack;
        const result = source.readBigNumber();
        return result;
    }

    async getOrderFill(provider: ContractProvider, tokenGet: Address | null, amountGet: bigint, tokenGive: Address | null, amountGive: bigint, expires: bigint, nonce: bigint, maker: Address) {
        const builder = new TupleBuilder();
        builder.writeAddress(tokenGet);
        builder.writeNumber(amountGet);
        builder.writeAddress(tokenGive);
        builder.writeNumber(amountGive);
        builder.writeNumber(expires);
        builder.writeNumber(nonce);
        builder.writeAddress(maker);
        const source = (await provider.get('orderFill', builder.build())).stack;
        const result = source.readBigNumber();
        return result;
    }

}