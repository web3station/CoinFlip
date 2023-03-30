import { ethers } from "hardhat";

async function main() {
  // Access the Hardhat Runtime Environment (hre)
  const hre = require("hardhat");
  console.log("Compiling Contracts");
  await hre.run("compile");

  const CoinFlip = await ethers.getContractFactory("CoinFlip");
  const coinFlip = await CoinFlip.deploy();

  if (hre.network.name === "localhost" || hre.network.name === "hardhat") {
    await coinFlip.deployed();
  } else {
    await coinFlip.deployTransaction.wait(3);
  }

  console.log(`CoinFlip address ${coinFlip.address}`);
  if (hre.network.name !== "localhost" && hre.network.name !== "hardhat") {
    console.log("verify...");
    try {
      await hre.run("verify:verify", {
        address: coinFlip.address,
        constructorArguments: [],
      });
      console.log("Contract verified");
    } catch (error) {
      console.error((error as any).message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
