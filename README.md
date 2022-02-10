3Swap-SDK
===========================================

The 3Swap SDK is a convenience library for querying chain state relevant to 3Swap DEX. Leveraging the SDK, you can compute parameters with which to interact with the 3Swap smart contract.

**Examples:**

* Fetch token data:

You can query the chain for token info using the chain ID and the token address.

```js
import { Fetcher, ChainId } from '3swap-sdk';

Fetcher.fetchTokenData(
  ChainId.BINANCE_TESTNET,'0x57c84e7bcbab211761a0cb91484ae896aa897ae9'
)
.then(token => {
  console.log('Name: %s, Decimals: %d', token.name(), token.decimals()); // 3Swap 0x, SAPX
});

// or use custom provider

Fetcher.fetchTokenData(
  ChainId.BINANCE_TESTNET,'0x57c84e7bcbab211761a0cb91484ae896aa897ae9', 'PROVIDER_URL'
)
.then(token => {
  console.log('Name: %s, Decimals: %d', token.name(), token.decimals()); // 3Swap 0x, SAPX
});
```

You can also set a number as the chain id: 

```js
Fetcher.fetchTokenData(
  97,'0x57c84e7bcbab211761a0cb91484ae896aa897ae9' // '97' is the chain ID for Binance Testnet
)
.then(token => {
  console.log('Name: %s, Decimals: %d', token.name(), token.decimals()); // 3Swap 0x, SAPX
});
```