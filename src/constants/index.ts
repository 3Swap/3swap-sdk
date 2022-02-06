import JSBI from 'jsbi';

export enum ChainId {
  BINANCE_TESTNET = 97,
  ROPSTEN = 3,
  MATIC_TESTNET = 80001,
  FANTOM_TESTNET = 40002,
  AVALANCHE_TESTNET = 43113
}

export type BigIntishThingy = JSBI | bigint | string;

export const Factories: { [key: number]: string } = {
  [ChainId.BINANCE_TESTNET]: '0xFb0C3dbC457DC5C34145b8d202687b97E888DcDc',
  [ChainId.ROPSTEN]: '0xF6a7F229447FB986195c4dC8305553C8A8518d06',
  [ChainId.AVALANCHE_TESTNET]: '0x842CDC95B8BC3A19a8fFc91f200e51c8aF6faFC6',
  [ChainId.MATIC_TESTNET]: '0x842CDC95B8BC3A19a8fFc91f200e51c8aF6faFC6',
  [ChainId.FANTOM_TESTNET]: '0x842CDC95B8BC3A19a8fFc91f200e51c8aF6faFC6'
};

export const BYTECODE_HASH =
  '0x2612d4eb9dab6652d72a6ec7022aef62794c5601c0fff785c015336a39ee9bde';

export const ZER0 = JSBI.BigInt(0);
export const ONE = JSBI.BigInt(1);
export const TWO = JSBI.BigInt(2);
export const THREE = JSBI.BigInt(3);
export const FOUR = JSBI.BigInt(4);
export const FIVE = JSBI.BigInt(5);
export const SIX = JSBI.BigInt(6);
export const SEVEN = JSBI.BigInt(7);
export const EIGHT = JSBI.BigInt(8);
export const NINE = JSBI.BigInt(9);
export const TEN = JSBI.BigInt(10);
export const _100 = JSBI.BigInt(100);
export const FEES_NUMERATOR = JSBI.BigInt(997);
export const FEES_DENOMINATOR = JSBI.BigInt(1000);

export const URLS: { [key: number]: string } = {
  [ChainId.BINANCE_TESTNET]:
    'https://speedy-nodes-nyc.moralis.io/558120230227a848a2bb7043/bsc/testnet',
  [ChainId.ROPSTEN]:
    'https://speedy-nodes-nyc.moralis.io/558120230227a848a2bb7043/eth/ropsten',
  [ChainId.MATIC_TESTNET]:
    'https://speedy-nodes-nyc.moralis.io/558120230227a848a2bb7043/polygon/mumbai',
  [ChainId.AVALANCHE_TESTNET]:
    'https://speedy-nodes-nyc.moralis.io/558120230227a848a2bb7043/avalanche/testnet',
  [ChainId.FANTOM_TESTNET]: 'https://rpc.testnet.fantom.network'
};
