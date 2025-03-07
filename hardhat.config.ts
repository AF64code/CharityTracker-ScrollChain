import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.16",
  networks: {
    scrollTestnet: {
      url: process.env.SCROLL_TESTNET_URL,
      chainId: 534351,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    customChains: [
      {
        network: "scrollTestnet",
        chainId: 534351,
        urls: {
          apiURL: "https://api-sepolia.scrollscan.com/api",
          browserURL: "https://sepolia.scrollscan.com",
        },
      },
    ],
    apiKey: {
      scrollTestnet: process.env.ETHERSCAN_API_KEY || 'DDWSPA6VGTQCIER1Q1E43M6BCB3YW7F1KR',
    },
  },
};

export default config;
