import JSBI from 'jsbi';
import invariant from 'tiny-invariant';
import { BigIntishThingy } from '../constants';
import { numberToHex } from '../utils';
import { Token } from './Token';

export class TokenAmount {
  public numerator: BigIntishThingy;
  public token: Token;
  public get raw(): JSBI {
    return this.numerator as JSBI;
  }

  constructor(amount: BigIntishThingy, token: Token) {
    this.numerator = amount;
    this.token = token;
  }

  add(other: TokenAmount): TokenAmount {
    invariant(
      this.token._chainId === other.token._chainId,
      'operation_on_different_chains'
    );
    invariant(this.token._address === other.token._address, 'must_be_same_token');
    const sum = JSBI.add(this.raw, other.raw);
    return new TokenAmount(sum, this.token);
  }

  subtract(other: TokenAmount): TokenAmount {
    invariant(
      this.token._chainId === other.token._chainId,
      'operation_on_different_chains'
    );
    invariant(this.token._address === other.token._address, 'must_be_same_token');
    const diff = JSBI.add(this.raw, other.raw);
    return new TokenAmount(diff, this.token);
  }

  divideByDecimal(): number {
    return JSBI.toNumber(
      JSBI.divide(
        this.numerator as JSBI,
        JSBI.BigInt(10 ** (this.token._decimals as number))
      )
    );
  }

  hexifyFromBigIntishThingy(): string {
    return `0x${(this.numerator as JSBI).toString(16)}`;
  }

  hexifyFromDivided(): string {
    return numberToHex(this.divideByDecimal());
  }
}
