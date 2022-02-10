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

The `Fetcher.fetchTokenData` function returns a `Promise<Token>`.


Fields in the token class include:

| Name     | Type             |
|----------|------------------|
|_address  | string           |
|_chainId  |ChainId or number |
|_decimals |number or string  |
|_name     |string            |
|_symbol   |string            |



* Fetch triad data:

Triad information can be fetched on-chain using a static helper method that returns a `Promise<Triad>`.

```js
import { Fetcher, ChainId } from '3swap-sdk';

async function fetchTriad() {
  const tokenA = await Fetcher.fetchTokenData(
    ChainId.BINANCE_TESTNET, '0x57c84e7bcbab211761a0cb91484ae896aa897ae9'
  );
  
  //...2 other tokens

  const triad = await Fetcher.fetchTriadData(tokenA, tokenB, tokenC);
}
// or use custom provider url

const triad = await Fetcher.fetchTriadData(tokenA, tokenB, tokenC, 'PROVIDER_URL');
```

Fields in the triad class include:


|Name          | Type                                  |
|--------------|---------------------------------------|
|liquidityToken|Token                                  |
|tokenAmounts  |[TokenAmount, TokenAmount, TokenAmount]|



**Computing trades:**

The SDK also provides the effective computation of trades through the `Router` class.


```js
import { Router } from '3swap-sdk';

Router.swapCallParameter(trade, chainId, options);
```

The static `swapCallParameter` method of the `Router` class takes in a trade, a chain ID and a trade options object and then computes a `SwapParams` object which contains the method name, the arguments for the method and the hex encoded value of Ether to be sent in the transaction (this is 0 for transactions that do not involve Ether).


**Constructing a `Trade`**

A trade class is useful in the actual computation by the router class. The `Trade` constructor takes in three `TokenAmount` objects and a `TradeType` enum.

```js
new Trade(input1amount, input2amount, outputamount, tradetype);
```

The `TokenAmount` constructor takes in a big number (the amount) and a token.

```js
new TokenAmount(JSBI.BigInt(4000000000000000000), token);
```

The `TradeType` enum:


```ts
enum TradeType {
  EXACT_INPUT,
  EXACT_OUTPUT
}
```

The trade type is useful in determining how slippage is spread. `EXACT_INPUT` means no slippage tolerance is computed on the input amount while `EXACT_OUTPUT` means no slippage tolerance is applied on the output amount.


The `TradeOptions` interface:


```ts
/**
 * Trade options.
 */
export interface TradeOptions {
  /**
   * Price difference during latency in transaction submission and block confirmation
   */
  slippage: number;
  /**
   * How long the transaction should last before it becomes invalid (in seconds)
   */
  deadline: number;
  /**
   * The account that should receive the swap output
   */
  recipient: string;
}
```



`Router.swapCallParameters` returns an `SwapParams` object.


```ts
export interface SwapParams {
  /**
   * The method to send to the 3Swap router
   */
  methodName: string;
  /**
   * Arguments to pass to the method (all hex-encoded)
   */
  args: Array<string | string[]>;
  /**
   * Amount of wei to send in hex
   */
  value: string;
}
```