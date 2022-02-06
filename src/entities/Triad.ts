import { pack, keccak256 } from '@ethersproject/solidity';
import { getCreate2Address } from '@ethersproject/address';
import { Token } from './Token';
import { BigIntishThingy } from '../constants';
import { TokenAmount } from './TokenAmount';

let triadAddressCache: {
  [token0Address: string]: {
    [token1Address: string]: { [token2Address: string]: string };
  };
} = {};

export class Triad {
  public readonly liquidityTokens: [Token, Token];
  public readonly tokenAmounts: [TokenAmount, TokenAmount, TokenAmount];
}
