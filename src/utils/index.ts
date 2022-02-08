import axios from 'axios';
import warning from 'tiny-warning';
import invariant from 'tiny-invariant';
import { getAddress } from '@ethersproject/address';

interface JsonRpcParams {
  id: number | string;
  method: string;
  jsonrpc: '2.0';
  params: Array<any>;
}

class HttpRequestError extends Error {
  public errorCode: number;
  constructor(code: number, message: string) {
    super(message);
    this.errorCode = code;
  }
}

export const fetchRpc = (url: string, params: JsonRpcParams): Promise<any> => {
  try {
    return new Promise((resolve, reject) => {
      axios
        .post(url, params)
        .then((res) => {
          if (res.status >= 400) {
            reject(
              new HttpRequestError(res.status, `${url} responded with ${res.status}`)
            );
          }
          resolve(res.data);
        })
        .catch(reject);
    });
  } catch (error: any) {
    invariant(false, error.message);
  }
};

export const numberToHex = (num: number) => `0x${num.toString(16)}`;
export const validateAndParseAddress = (address: string) => {
  try {
    const checkSummed = getAddress(address);
    warning(checkSummed === address, 'Address not checksummed');
    return checkSummed;
  } catch (error: any) {
    invariant(false, error.message);
  }
};

export const sqrt = (num: number) => {
  let x = num;
  let y = 1;

  while (x - y > 0) {
    x = (x + y) / 2;
    y = num / x;
  }
  return x;
};
