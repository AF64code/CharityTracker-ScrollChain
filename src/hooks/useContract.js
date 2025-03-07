
import { ethers } from "ethers";
import contractABI from "../CharityTracker.json"; // 替换成 ABI 路径

const CONTRACT_ADDRESS = "0x77451aeF3E4C4732BA24051aDaDb92577755240e"; // 替换为你的合约地址

export const useContract = (provider) => {
  return new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, provider);
};
