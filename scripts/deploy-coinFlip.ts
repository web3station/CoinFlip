import { ethers } from "hardhat";

async function main() {
  const CoinFlip = await ethers.getContractFactory("CoinFlip");
  const coinFlip = await CoinFlip.deploy();

  await coinFlip.deployed();

  console.log(`CoinFlip address ${coinFlip.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
