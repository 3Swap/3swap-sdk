import invariant from 'tiny-invariant';
import { ChainId } from '../constants';

/**
 * Token representation
 * @author Kingsley Victor
 */
export class Token {
  public _address: string;
  public _chainId: ChainId;
  public _decimals: number | string;
  public _name: string;
  public _symbol: string;

  /**
   *
   * @param address Token address.
   * @param chainId Chain ID.
   * @param decimals Token's decimals.
   * @param name Token's name.
   * @param symbol Token's symbol.
   */
  constructor(
    address: string,
    chainId: ChainId,
    decimals: number | string,
    name: string,
    symbol: string
  ) {
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

/**
 * Wrapped Ether.
 */
export const WETH: { [key: number]: Token } = {
  [ChainId.BINANCE_TESTNET]: new Token(
    '0xfD350f2DE21a733ab1e924eF699e6664A7ffc203',
    ChainId.BINANCE_TESTNET,
    18,
    'Wrapped Binance Coin',
    'WBNB'
  ),
  [ChainId.ROPSTEN]: new Token(
    '0xF7415eBdF6E97Af8Be0E24b7A743A9D51627Bc34',
    ChainId.ROPSTEN,
    18,
    'Wrapped Ether',
    'WETH'
  ),
  [ChainId.FANTOM_TESTNET]: new Token(
    '0xa83E55bd93C2Ca31290ac3dfC496040e1d064497',
    ChainId.FANTOM_TESTNET,
    18,
    'Wrapped Fantom',
    'WFTM'
  ),
  [ChainId.AVALANCHE_TESTNET]: new Token(
    '0x85A2f5De3D161Ad23A00098298afD4d54449cec9',
    ChainId.AVALANCHE_TESTNET,
    18,
    'Wrapped Avalanche Coin',
    'WAVAX'
  ),
  [ChainId.MATIC_TESTNET]: new Token(
    '0x54e07e58bB2d7eECAB1EEd44809fEB63ab2C991c',
    ChainId.MATIC_TESTNET,
    18,
    'Wrapped Matic',
    'WMATIC'
  )
};
