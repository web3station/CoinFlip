import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";
import "./tasks";
import dotenv from "dotenv";
dotenv.config();

const MUMBAI_RPC_URL = process.env.MUMBAI_RPC_URL as string;
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL as string;
const PRIVATE_KEY = process.env.PRIVATE_KEY as string;
const REPORT_GAS = (process.env.REPORT_GAS as unknown as boolean) || false;
// Your API key for Etherscan, obtain one at https://etherscan.io/
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY as string;
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY as string;

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  defaultNetwork: "localhost",
  networks: {
    localhost: {
      chainId: 31337,
      url: "http://127.0.0.1:8545/",
    },
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      chainId: 11155111,
    },
    mumbai: {
      url: MUMBAI_RPC_URL,
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      chainId: 80001,
    },
  },
  gasReporter: {
    enabled: REPORT_GAS,
    currency: "USD",
    outputFile: "gas-report.txt",
  },
  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_API_KEY,
      polygonMumbai: POLYGONSCAN_API_KEY,
    },
  },
};

export default config;
