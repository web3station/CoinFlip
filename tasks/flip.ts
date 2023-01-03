import { task } from "hardhat/config";
import { CoinFlip__factory } from "../typechain-types";

const sleep = async (ms: number) => {
  return new Promise((val) => setTimeout(val, ms));
};

task("flip", "Flip coin challenge")
  .addParam("coinflip", "CoinFlip contract address")
  .setAction(async (taskArgs: { coinflip: string }, hre) => {
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
      const blockValue = BigNumber.from(
        (await ethers.provider.getBlock("latest")).hash
      );
      const factor = BigNumber.from(
        "57896044618658097711785492504343953926634992332820282019728792003956564819968"
      );
      if (blockValue.eq(lastHash)) return;
      lastHash = blockValue;
      const coinFlip = blockValue.div(factor);
      const side = coinFlip.toNumber() === 1 ? true : false;
      return side;
    };

    const flip = async () => {
      let consecutive = BigNumber.from(0);
      let win = BigNumber.from(10);
      while (win.gt(consecutive)) {
        const guess = await getGuess();
        if (undefined !== guess) {
          console.log("guess", guess);
          const transaction = await coinFlip.flip(guess);
          await transaction.wait();
          console.log(transaction.hash);
          consecutive = await coinFlip.consecutiveWins();
          console.log("consecutive wins(current)", consecutive.toString());
        }
        await sleep(500);
      }
      console.log("you won!");
    };

    await flip();
  });
