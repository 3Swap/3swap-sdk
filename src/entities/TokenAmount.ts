import BigNumber from 'bignumber.js';
import invariant from 'tiny-invariant';
import { BigIntishThingy } from '../constants';
import { numberToHex } from '../utils';
import { Token } from './Token';

/**
 * Holds information about token quantity
 */
export class TokenAmount {
  public numerator: BigIntishThingy;
  public token: Token;
  public get raw(): BigNumber {
    return this.numerator as BigNumber;
  }

  /**
   *
   * @param amount Actual amount (BigNumber or JSBI).
   * @param token The token (see {@link Token}).
   */
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
    const sum = new BigNumber(this.raw).plus(other.raw);
    return new TokenAmount(sum, this.token);
  }

  subtract(other: TokenAmount): TokenAmount {
    invariant(
      this.token._chainId === other.token._chainId,
      'operation_on_different_chains'
    );
    invariant(this.token._address === other.token._address, 'must_be_same_token');
    const diff = new BigNumber(this.raw).minus(other.raw);
    return new TokenAmount(diff, this.token);
  }

  divideByDecimal(): number {
    return parseInt(this.raw.toString(16), 16) / 10 ** (this.token._decimals as number);
  }

  hexifyFromBigIntishThingy(): string {
    const asString = (this.numerator as BigNumber).toString(16);
    return !asString.startsWith('0x') ? `0x${asString}` : asString;
  }

  hexifyFromDivided(): string {
    return numberToHex(this.divideByDecimal());
  }
}
