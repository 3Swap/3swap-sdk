import invariant from 'tiny-invariant';
import { validateAndParseAddress } from './utils';
import { Token, WETH } from './entities/Token';
import { TokenAmount } from './entities/TokenAmount';
import { BigIntishThingy, ChainId, TWO, _100 } from './constants';
import JSBI from 'jsbi';

export enum TradeType {
  EXACT_INPUT,
  EXACT_OUTPUT
}

export class Trade {
  public inputAmount1: TokenAmount;
  public inputAmount2: TokenAmount;
  public outputAmount: TokenAmount;
  public tradeType: TradeType;

  constructor(
    inputAmount1: TokenAmount,
    inputAmount2: TokenAmount,
    outputAmount: TokenAmount,
    tradeType: TradeType
  ) {
    this.inputAmount1 = inputAmount1;
    this.inputAmount2 = inputAmount2;
    this.outputAmount = outputAmount;
    this.tradeType = tradeType;
  }

  public minAmountOut(slippage: number): TokenAmount {}

  public maxAmountsIn(slippage: number): [TokenAmount, TokenAmount] {
    invariant(slippage >= 0, 'slippage_less_than_0');
    if (this.tradeType === TradeType.EXACT_INPUT)
      return [this.inputAmount1, this.inputAmount2];
    else {
      const slippageAdjustedAmountIn = JSBI.divide(
        JSBI.add(
          JSBI.multiply(
            JSBI.BigInt(slippage),
            JSBI.add(this.inputAmount1.raw, this.inputAmount2.raw)
          ),
          JSBI.multiply(_100, JSBI.add(this.inputAmount1.raw, this.inputAmount2.raw))
        ),
        _100
      );
      const slippageDivided = JSBI.divide(slippageAdjustedAmountIn, TWO);
      return [
        new TokenAmount(
          JSBI.add(this.inputAmount1.raw, slippageDivided),
          this.inputAmount1.token
        ),
        new TokenAmount(
          JSBI.add(this.inputAmount2.raw, slippageDivided),
          this.inputAmount2.token
        )
      ];
    }
  }
}

export interface TradeOptions {
  /**
   * Price difference during latency in transaction submission and block confirmation
   */
  slippage: number;
  /**
   * How long the transaction should last before it becomes invalid
   */
  deadline: number;
  /**
   * The account that should receive the swap output
   */
  recipient: string;
}

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

export class Router {
  public static swapCallParameters(
    trade: Trade,
    chainId: ChainId,
    options: TradeOptions
  ): SwapParams {
    invariant(
      trade.inputAmount1.token.chainId() === chainId &&
        trade.inputAmount2.token.chainId() === chainId &&
        trade.outputAmount.token.chainId() === chainId,
      'odd_chain_id'
    );
    invariant(
      trade.inputAmount1.token._address !== trade.inputAmount2.token._address &&
        trade.inputAmount2.token._address !== trade.outputAmount.token._address,
      'swap_to_identical_asset'
    );
    const etherIn =
      trade.inputAmount1.token === WETH[chainId] ||
      trade.inputAmount2.token === WETH[chainId];
    const etherOut = trade.outputAmount.token === WETH[chainId];
    invariant(options.deadline > 0, 'deadline_must_be_greater_than_0');

    const to: string = validateAndParseAddress(options.recipient);
    const amountsIn: [string, string] = trade
      .maxAmountsIn(options.slippage)
      .map((tAmount) => tAmount.hexifyFromBigIntishThingy()) as [string, string];
  }
}
