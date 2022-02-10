import JSBI from 'jsbi';
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
  public get raw(): JSBI {
    return this.numerator as JSBI;
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
    const sum = JSBI.add(this.raw, other.raw);
    return new TokenAmount(sum, this.token);
  }

  subtract(other: TokenAmount): TokenAmount {
    invariant(
      this.token._chainId === other.token._chainId,
      'operation_on_different_chains'
    );
    invariant(this.token._address === other.token._address, 'must_be_same_token');
    const diff = JSBI.subtract(this.raw, other.raw);
    return new TokenAmount(diff, this.token);
  }

  divideByDecimal(): number {
    return JSBI.toNumber(
      JSBI.divide(this.raw, JSBI.BigInt(10 ** (this.token._decimals as number)))
    );
  }

  hexifyFromBigIntishThingy(): string {
    const asString = (this.numerator as JSBI).toString(16);
    return !asString.startsWith('0x') ? `0x${asString}` : asString;
  }

  hexifyFromDivided(): string {
    return numberToHex(this.divideByDecimal());
  }
}
