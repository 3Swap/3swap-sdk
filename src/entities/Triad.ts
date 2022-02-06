import { pack, keccak256 } from '@ethersproject/solidity';
import { getCreate2Address } from '@ethersproject/address';
import { Token } from './Token';
import { BigIntishThingy, BYTECODE_HASH, ChainId, Factories } from '../constants';
import { TokenAmount } from './TokenAmount';

let triadAddressCache: {
  [token0Address: string]: {
    [token1Address: string]: { [token2Address: string]: string };
  };
} = {};

export class Triad {
  public readonly liquidityToken: Token;
  public readonly tokenAmounts: [TokenAmount, TokenAmount, TokenAmount];

  public constructor(
    tokenAmount0: TokenAmount,
    tokenAmount1: TokenAmount,
    tokenAmount2: TokenAmount
  ) {
    let tokenAmounts = tokenAmount0.token.sortsBefore(tokenAmount1.token)
      ? [tokenAmount0, tokenAmount1, tokenAmount2]
      : [tokenAmount1, tokenAmount0, tokenAmount2];
    tokenAmounts = tokenAmounts[1].token.sortsBefore(tokenAmounts[2].token)
      ? [tokenAmounts[0], tokenAmounts[1], tokenAmounts[2]]
      : [tokenAmounts[0], tokenAmounts[2], tokenAmounts[1]];
    this.liquidityToken = new Token(
      Triad.getAddress(
        tokenAmounts[0].token,
        tokenAmounts[1].token,
        tokenAmounts[2].token,
        tokenAmounts[0].token.chainId()
      ),
      tokenAmounts[0].token.chainId(),
      18,
      '3Swap LPs',
      'SAP-LP'
    );
    this.tokenAmounts = tokenAmounts as [TokenAmount, TokenAmount, TokenAmount];
  }

  public static getAddress(
    tokenA: Token,
    tokenB: Token,
    tokenC: Token,
    chainId: ChainId
  ): string {
    let tokens = tokenA.sortsBefore(tokenB)
      ? [tokenA, tokenB, tokenC]
      : [tokenB, tokenA, tokenC];
    tokens = tokens[1].sortsBefore(tokens[2])
      ? [tokens[0], tokens[1], tokens[2]]
      : [tokens[0], tokens[2], tokens[1]];

    if (
      triadAddressCache?.[tokens[0]._address]?.[tokens[1]._address]?.[
        tokens[2]._address
      ] === undefined
    ) {
      triadAddressCache = {
        ...triadAddressCache,
        [tokens[0]._address]: {
          ...triadAddressCache?.[tokens[0]._address],
          [tokens[1]._address]: {
            ...triadAddressCache?.[tokens[0]._address]?.[tokens[1]._address],
            [tokens[2]._address]: getCreate2Address(
              Factories[chainId],
              keccak256(
                ['bytes'],
                [
                  pack(
                    ['address', 'address', 'address'],
                    [tokens[0]._address, tokens[1]._address, tokens[2]._address]
                  )
                ]
              ),
              BYTECODE_HASH
            )
          }
        }
      };
    }
    return triadAddressCache[tokens[0]._address][tokens[1]._address][tokens[2]._address];
  }

  public includesToken(token: Token): boolean {
    return (
      token.equals(this.token0) || token.equals(this.token1) || token.equals(this.token2)
    );
  }

  public get token0(): Token {
    return this.tokenAmounts[0].token;
  }

  public get token1(): Token {
    return this.tokenAmounts[1].token;
  }

  public get token2(): Token {
    return this.tokenAmounts[2].token;
  }
}
