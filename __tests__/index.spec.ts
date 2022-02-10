import { Fetcher, ChainId, sqrt, WETH } from '../src';

describe('All', () => {
  test('should fetch token data', async () => {
    const sapx = await Fetcher.fetchTokenData(
      ChainId.BINANCE_TESTNET,
      '0x57c84e7bcbab211761a0cb91484ae896aa897ae9'
    );
    expect(sapx.decimals()).toEqual(18);
    expect(sapx.symbol()).toEqual('SAPX');
    expect(sapx.name()).toEqual('3Swap 0x');
  });

  test('square root function works', () => {
    expect(sqrt(4)).toEqual(2);
  });

  test('should fetch triad', async () => {
    const sapx = await Fetcher.fetchTokenData(
      ChainId.BINANCE_TESTNET,
      '0x57c84e7bcbab211761a0cb91484ae896aa897ae9'
    );

    const busd = await Fetcher.fetchTokenData(
      ChainId.BINANCE_TESTNET,
      '0xed24fc36d5ee211ea25a80239fb8c4cfd80f12ee'
    );

    const triad = await Fetcher.fetchTriadData(sapx, busd, WETH[ChainId.BINANCE_TESTNET]);
    expect(triad.liquidityToken.address().toLowerCase()).toEqual(
      '0x64b15069883901ca7dD28d1DBf400E531a50B744'.toLowerCase()
    );
  });
});
