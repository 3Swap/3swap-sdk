import BigNumber from 'bignumber.js';

export enum ChainId {
  BINANCE_TESTNET = 97,
  ROPSTEN = 3,
  MATIC_TESTNET = 80001,
  FANTOM_TESTNET = 4002,
  AVALANCHE_TESTNET = 43113,
  TELOS_TESTNET = 41
}

export type BigIntishThingy = BigNumber | bigint | string;

export const Factories: { [key: number]: string } = {
  [ChainId.BINANCE_TESTNET]: '0xFb0C3dbC457DC5C34145b8d202687b97E888DcDc',
  [ChainId.ROPSTEN]: '0xF6a7F229447FB986195c4dC8305553C8A8518d06',
  [ChainId.AVALANCHE_TESTNET]: '0x842CDC95B8BC3A19a8fFc91f200e51c8aF6faFC6',
  [ChainId.MATIC_TESTNET]: '0x842CDC95B8BC3A19a8fFc91f200e51c8aF6faFC6',
  [ChainId.FANTOM_TESTNET]: '0x842CDC95B8BC3A19a8fFc91f200e51c8aF6faFC6',
  [ChainId.TELOS_TESTNET]: '0xE41d241720FEE7cD6BDfA9aB3204d23687703CD5'
};

export const BYTECODE_HASH =
  '0x2612d4eb9dab6652d72a6ec7022aef62794c5601c0fff785c015336a39ee9bde';

export const ZER0 = new BigNumber(0);
export const ONE = new BigNumber(1);
export const TWO = new BigNumber(2);
export const THREE = new BigNumber(3);
export const FOUR = new BigNumber(4);
export const FIVE = new BigNumber(5);
export const SIX = new BigNumber(6);
export const SEVEN = new BigNumber(7);
export const EIGHT = new BigNumber(8);
export const NINE = new BigNumber(9);
export const TEN = new BigNumber(10);
export const _100 = new BigNumber(100);
export const FEES_NUMERATOR = new BigNumber(997);
export const FEES_DENOMINATOR = new BigNumber(1000);

export const URLS: { [key: number]: string } = {
  [ChainId.BINANCE_TESTNET]:
    'https://speedy-nodes-nyc.moralis.io/558120230227a848a2bb7043/bsc/testnet',
  [ChainId.ROPSTEN]:
    'https://speedy-nodes-nyc.moralis.io/558120230227a848a2bb7043/eth/ropsten',
  [ChainId.MATIC_TESTNET]:
    'https://speedy-nodes-nyc.moralis.io/558120230227a848a2bb7043/polygon/mumbai',
  [ChainId.AVALANCHE_TESTNET]:
    'https://speedy-nodes-nyc.moralis.io/558120230227a848a2bb7043/avalanche/testnet',
  [ChainId.FANTOM_TESTNET]: 'https://rpc.testnet.fantom.network',
  [ChainId.TELOS_TESTNET]: 'https://testnet.telos.net/evm'
};
