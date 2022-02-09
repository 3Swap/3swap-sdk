import JSBI from 'jsbi';
import { Interface } from '@ethersproject/abi';
import ERC20 from '3swap-v1-core/build/contracts/ERC20.json';
import I3SwapTriad from '3swap-v1-core/build/contracts/I3SwapTriad.json';
import invariant from 'tiny-invariant';
import { ChainId, URLS } from './constants';
import { Token } from './entities/Token';
import { fetchRpc } from './utils';
import { Triad } from './entities/Triad';
import { TokenAmount } from './entities/TokenAmount';

/**
 * The fetcher class contains utility functions for retrieving on-chain data
 * @author Kingsley Victor
 */
export class Fetcher {
  /**
   * Fetch token information from chain using address and chain ID.
   * @param chainId ID of the chain.
   * @param address Token address.
   * @param providerUrl Optional provider url. If this is not provided, a custom url would be used depending on the provided chain ID.
   * @returns {Promise<Token>}
   */
  public static async fetchTokenData(
    chainId: ChainId,
    address: string,
    providerUrl?: string
  ): Promise<Token> {
    try {
      const abiInterface = new Interface(ERC20.abi);

      const decimalEncoded = abiInterface.getSighash('decimals');
      const nameEncoded = abiInterface.getSighash('name');
      const symbolEncoded = abiInterface.getSighash('symbol');

      let decimals: any = await fetchRpc(providerUrl || URLS[chainId], {
        method: 'eth_call',
        jsonrpc: '2.0',
        id: 1,
        params: [{ to: address, data: decimalEncoded }, 'latest']
      });

      decimals =
        typeof decimals === 'string' ? JSBI.toNumber(JSBI.BigInt(decimals)) : decimals;

      let name: any = await fetchRpc(providerUrl || URLS[chainId], {
        method: 'eth_call',
        jsonrpc: '2.0',
        id: 1,
        params: [{ to: address, data: nameEncoded }, 'latest']
      });

      name = name.replace('0x', '');

      let nameUpdated: string = '';

      for (let i = 0; i < name.length; i += 2) {
        nameUpdated += String.fromCharCode(parseInt(name.toString().substr(i, 2), 16));
      }

      name = nameUpdated;

      let symbol: any = await fetchRpc(providerUrl || URLS[chainId], {
        method: 'eth_call',
        jsonrpc: '2.0',
        id: 1,
        params: [{ to: address, data: symbolEncoded }, 'latest']
      });

      symbol = symbol.replace('0x', '');

      let symbolUpdated: string = '';

      for (let i = 0; i < symbol.length; i += 2) {
        symbolUpdated += String.fromCharCode(parseInt(symbol.substr(i, 2), 16));
      }

      symbol = symbolUpdated.trim();

      return Promise.resolve(new Token(address, chainId, decimals, name, symbol));
    } catch (error: any) {
      invariant(false, error.message);
    }
  }

  /**
   * Fetch a triad using three tokens
   * @param tokenA First token.
   * @param tokenB Second token.
   * @param tokenC Third token.
   * @param providerUrl Optional provider url.
   * @returns
   */
  static async fetchTriadData(
    tokenA: Token,
    tokenB: Token,
    tokenC: Token,
    providerUrl?: string
  ): Promise<Triad> {
    try {
      invariant(
        tokenA._chainId === tokenB._chainId && tokenB._chainId === tokenC._chainId,
        'must_be_on_same_chain'
      );
      const address = Triad.getAddress(tokenA, tokenB, tokenC, tokenA.chainId());
      const abiInterface = new Interface(I3SwapTriad.abi);
      const getReservesEncoded = abiInterface.getSighash('getReserves');
      let [reserve0, reserve1, reserve2] = abiInterface.decodeFunctionResult(
        'getReserves',
        await fetchRpc(providerUrl || URLS[tokenA._chainId], {
          method: 'eth_call',
          jsonrpc: '2.0',
          id: 1,
          params: [{ to: address, data: getReservesEncoded }, 'latest']
        })
      );

      reserve0 = JSBI.BigInt(reserve0);
      reserve1 = JSBI.BigInt(reserve1);
      reserve2 = JSBI.BigInt(reserve2);

      let balances = tokenA.sortsBefore(tokenB)
        ? [reserve0, reserve1, reserve2]
        : [reserve1, reserve0, reserve2];
      balances = tokenB.sortsBefore(tokenC)
        ? [balances[0], balances[1], balances[2]]
        : [balances[0], balances[2], balances[1]];
      return Promise.resolve(
        new Triad(
          new TokenAmount(balances[0], tokenA),
          new TokenAmount(balances[1], tokenB),
          new TokenAmount(balances[2], tokenC)
        )
      );
    } catch (error: any) {
      invariant(false, error.message);
    }
  }
}
