import { task } from "hardhat/config";
import { CoinFlip__factory } from "../typechain-types";
import axios from "axios";
import { BigNumberish } from "ethers";

task("flip", "Flip coin challenge")
  .addParam("coinflip", "CoinFlip contract address")
  .setAction(async (taskArgs: { coinflip: string }, hre) => {
    const network = hre.network;
    const ethers = hre.ethers;
    const BigNumber = ethers.BigNumber;

    const CoinFlip: CoinFlip__factory = await ethers.getContractFactory(
      "CoinFlip"
    );
    const coinFlip = CoinFlip.attach(taskArgs.coinflip);

    console.log(
      "consecutive wins(start)",
      (await coinFlip.consecutiveWins()).toString()
    );

    let lastHash = BigNumber.from(0);
    const getGuess = async () => {
      const block = await ethers.provider.getBlock("latest");
      const blockValue = BigNumber.from(block.hash);
      const factor = BigNumber.from(
        "57896044618658097711785492504343953926634992332820282019728792003956564819968"
      );
      if (blockValue.eq(lastHash)) return;
      lastHash = blockValue;
      const coinFlip = blockValue.div(factor);
      const side = coinFlip.toNumber() === 1 ? true : false;
      return side;
    };

    const estimateGasPrice = async () => {
      const gasPrice = await ethers.provider.getGasPrice();
      console.log("Estimated Ethersjs gasPrice is ", gasPrice.toString());
      // Double the gas price to increase the chances to get the transaction included in the block
      return gasPrice.mul(2);
    };

    const flip = async () => {
      let consecutive = BigNumber.from(0);
      let win = BigNumber.from(10);
      while (win.gt(consecutive)) {
        const guess = await getGuess();
        if (undefined !== guess) {
          console.log("guess", guess);
          const gasPrice = await estimateGasPrice();
          const transaction = await coinFlip.flip(guess, {
            gasPrice,
          });

          if (network.name === "localhost" || network.name === "hardhat") {
            await transaction.wait();
          } else {
            await transaction.wait(3);
          }

          console.log(transaction.hash);
          consecutive = await coinFlip.consecutiveWins();
          console.log("consecutive wins(current)", consecutive.toString());
        }
      }
      console.log("you won!");
    };

    await flip();
  });
