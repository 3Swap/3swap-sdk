import JSBI from 'jsbi';
import { Interface } from '@ethersproject/abi';
import ERC20 from '3swap-v1-core/build/contracts/ERC20.json';
import I3SwapTriad from '3swap-v1-core/build/contracts/I3SwapTriad.json';
import invariant from 'tiny-invariant';
import { ChainId, URLS } from './constants';
import { Token } from './entities/Token';
import { fetchRpc } from './utils';

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
        params: [{ from: '0x', to: address, data: decimalEncoded }]
      });

      decimals =
        typeof decimals === 'string'
          ? JSBI.toNumber(JSBI.BigInt(decimals.replace('0x', '')))
          : decimals;

      let name: any = await fetchRpc(providerUrl || URLS[chainId], {
        method: 'eth_call',
        jsonrpc: '2.0',
        id: 1,
        params: [{ from: '0x', to: address, data: nameEncoded }]
      });

      let symbol: any = await fetchRpc(providerUrl || URLS[chainId], {
        method: 'eth_call',
        jsonrpc: '2.0',
        id: 1,
        params: [{ from: '0x', to: address, data: symbolEncoded }]
      });

      return Promise.resolve(new Token(address, chainId, decimals, name, symbol));
    } catch (error: any) {
      invariant(false, error.message);
    }
  }
}
