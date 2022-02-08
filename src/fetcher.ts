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

export class Fetcher {
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
        params: [{ to: address, data: decimalEncoded }]
      });

      decimals =
        typeof decimals === 'string'
          ? JSBI.toNumber(JSBI.BigInt(decimals.replace('0x', '')))
          : decimals;

      const name: any = await fetchRpc(providerUrl || URLS[chainId], {
        method: 'eth_call',
        jsonrpc: '2.0',
        id: 1,
        params: [{ to: address, data: nameEncoded }]
      });

      const symbol: any = await fetchRpc(providerUrl || URLS[chainId], {
        method: 'eth_call',
        jsonrpc: '2.0',
        id: 1,
        params: [{ to: address, data: symbolEncoded }]
      });

      return Promise.resolve(new Token(address, chainId, decimals, name, symbol));
    } catch (error: any) {
      invariant(false, error.message);
    }
  }

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
      let [reserve0, reserve1, reserve2] = await fetchRpc(
        providerUrl || URLS[tokenA._chainId],
        {
          method: 'eth_call',
          jsonrpc: '2.0',
          id: 1,
          params: [{ to: address, data: getReservesEncoded }]
        }
      );

      if (typeof reserve0 === 'string') {
        reserve0 = JSBI.BigInt(reserve0.replace('0x', ''));
      }

      if (typeof reserve1 === 'string') {
        reserve1 = JSBI.BigInt(reserve1.replace('0x', ''));
      }

      if (typeof reserve2 === 'string') {
        reserve2 = JSBI.BigInt(reserve2.replace('0x', ''));
      }
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
