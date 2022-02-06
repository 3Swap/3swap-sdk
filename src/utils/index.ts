import warning from 'tiny-warning';
import invariant from 'tiny-invariant';
import { getAddress } from '@ethersproject/address';

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
