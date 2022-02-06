import invariant from 'tiny-invariant';
import { ChainId } from '../constants';

export class Token {
  public _address: string;
  public _chainId: ChainId;
  public _decimals: number | string;
  public _name: string;
  public _symbol: string;

  constructor(address: string, chainId: ChainId, decimals: number | string, name: string, symbol: string) {
    this._address = address;
    this._chainId = chainId;
    this._decimals = decimals;
    this._name = name;
    this._symbol = symbol;
  }

  public address(): string {
    return this._address;
  }

  public decimals(): number {
    return typeof this._decimals === 'number' ? this._decimals : parseInt(this._decimals);
  }

  public symbol(): string {
    return this._symbol;
  }

  public name(): string {
    return this._name;
  }

  public chainId(): ChainId {
    return this._chainId;
  }

  public equals(other: Token): boolean {
    if (this === other) return true;
    return this._chainId === other._chainId && this._address === other._address;
  }

  public sortsBefore(other: Token): boolean {
    invariant(this._chainId === other._chainId, 'different_chain_ids');
    invariant(this._address !== other._address, 'comparison_on_same_token');
    return this._address.toLowerCase() < other._address.toLowerCase();
  }
}

export const WETH: { [key: number]: Token } = {
  [ChainId.BINANCE_TESTNET]: new Token(
    '0xEB23ab7CFf701BB4180C519BCD5FB85d6C30cD94',
    ChainId.BINANCE_TESTNET,
    18,
    'Wrapped Binance Coin',
    'WBNB'
  ),
  [ChainId.ROPSTEN]: new Token(
    '0xec5A20480c49B9286388F72f1AA95aF0D2525c94',
    ChainId.ROPSTEN,
    18,
    'Wrapped Ether',
    'WETH'
  )
};
