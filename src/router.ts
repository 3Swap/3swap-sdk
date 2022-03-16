import invariant from 'tiny-invariant';
import { numberToHex, validateAndParseAddress } from './utils';
import { Token, WETH } from './entities/Token';
import { TokenAmount } from './entities/TokenAmount';
import { ChainId, ONE, TWO, _100 } from './constants';
import BigNumber from 'bignumber.js';

export enum TradeType {
  EXACT_INPUT,
  EXACT_OUTPUT
}

/**
 * Holds the necessary objects to construct a trade
 */
export class Trade {
  public inputAmount1: TokenAmount;
  public inputAmount2: TokenAmount;
  public outputAmount: TokenAmount;
  public tradeType: TradeType;

  public get path(): [Token, Token, Token] {
    return [this.inputAmount1.token, this.inputAmount2.token, this.outputAmount.token];
  }

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

  public minAmountOut(slippage: number): TokenAmount {
    invariant(slippage >= 0, 'slippage_less_than_0');
    if (this.tradeType === TradeType.EXACT_OUTPUT) return this.outputAmount;
    else {
      const slippageCalc = new BigNumber(
        this.outputAmount.raw.dividedBy(10 ** this.outputAmount.token.decimals())
      )
        .plus(ONE)
        .multipliedBy(new BigNumber(slippage).dividedBy(_100))
        .dividedBy(_100);
      const slippageAdjustedAmountOut = new BigNumber(
        this.outputAmount.raw.dividedBy(10 ** this.outputAmount.token.decimals())
      ).plus(slippageCalc);
      return new TokenAmount(
        slippageAdjustedAmountOut.multipliedBy(10 ** this.outputAmount.token.decimals()),
        this.outputAmount.token
      );
    }
  }

  public maxAmountsIn(slippage: number): [TokenAmount, TokenAmount] {
    invariant(slippage >= 0, 'slippage_less_than_0');
    if (this.tradeType === TradeType.EXACT_INPUT)
      return [this.inputAmount1, this.inputAmount2];
    else {
      const slippageAdjustedAmountIn = new BigNumber(
        new BigNumber(
          new BigNumber(this.inputAmount1.raw)
            .plus(this.inputAmount2.raw)
            .multipliedBy(slippage)
        ).plus(
          new BigNumber(this.inputAmount1.raw)
            .plus(this.inputAmount2.raw)
            .multipliedBy(_100)
        )
      ).dividedBy(_100);
      const slippageDivided = new BigNumber(slippageAdjustedAmountIn).dividedBy(TWO);
      return [
        new TokenAmount(
          new BigNumber(this.inputAmount1.raw).plus(slippageDivided),
          this.inputAmount1.token
        ),
        new TokenAmount(
          new BigNumber(this.inputAmount2.raw).plus(slippageDivided),
          this.inputAmount2.token
        )
      ];
    }
  }
}

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
    const etherIn = trade.inputAmount1.token === WETH[chainId];
    const etherOut = trade.outputAmount.token === WETH[chainId];
    invariant(options.deadline > 0, 'deadline_must_be_greater_than_0');

    const to: string = validateAndParseAddress(options.recipient);
    const amountsIn: [string, string] = trade
      .maxAmountsIn(options.slippage)
      .map((tAmount) => tAmount.hexifyFromBigIntishThingy()) as [string, string];

    const amountOut: string = trade
      .minAmountOut(options.slippage)
      .hexifyFromBigIntishThingy();
    const path: [string, string, string] = trade.path.map((t) => t.address()) as [
      string,
      string,
      string
    ];
    const deadline: string = numberToHex(
      Math.floor(new Date().getTime() / 1000) + options.deadline
    );

    let methodName: string;
    let args: Array<string | string[]>;
    let value: string;

    if (etherIn) {
      methodName = 'swapExactETHForTokens';
      invariant(path[0] === WETH[chainId].address(), 'path_0_must_be_ether');
      args = [amountsIn[1], amountOut, path, to, deadline];
      value = amountsIn[0];
    } else if (etherOut) {
      methodName = 'swapExactTokensForETH';
      invariant(path[2] === WETH[chainId].address(), 'path_2_must_be_ether');
      args = [amountsIn[0], amountsIn[1], amountOut, path, to, deadline];
      value = '0x0';
    } else {
      methodName = 'swapExactTokensForTokens';
      args = [amountsIn[0], amountsIn[1], amountOut, path, to, deadline];
      value = '0x0';
    }

    return { methodName, args, value };
  }
}
