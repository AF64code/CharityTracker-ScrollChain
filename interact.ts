import { ethers } from "ethers";

// 📌 替换成你的合约地址
const CONTRACT_ADDRESS = "0x77451aeF3E4C4732BA24051aDaDb92577755240e";

// 📌 替换成你的合约 ABI
const CONTRACT_ABI = [
  {"inputs":[],"stateMutability":"nonpayable","type":"constructor"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"donor","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"DonationReceived","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"recipient","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"string","name":"description","type":"string"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"FundsWithdrawn","type":"event"},
  {"inputs":[],"name":"donate","outputs":[],"stateMutability":"payable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"donations","outputs":[{"internalType":"address","name":"donor","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"timestamp","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"expenses","outputs":[{"internalType":"string","name":"description","type":"string"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"timestamp","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"getBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"getDonations","outputs":[{"components":[{"internalType":"address","name":"donor","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"timestamp","type":"uint256"}],"internalType":"struct CharityTracker.Donation[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"getExpenses","outputs":[{"components":[{"internalType":"string","name":"description","type":"string"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"timestamp","type":"uint256"}],"internalType":"struct CharityTracker.Expense[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address payable","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"string","name":"description","type":"string"}],"name":"withdrawFunds","outputs":[],"stateMutability":"nonpayable","type":"function"}
];

// 📌 获取提供者（用于查询数据）
export const getProvider = (): ethers.providers.JsonRpcProvider => {
  return new ethers.providers.JsonRpcProvider("https://sepolia-rpc.scroll.io");
};

// 📌 获取合约实例（只读）
export const getContractReadOnly = (): ethers.Contract => {
  const provider = getProvider();
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
};

// 📌 获取带有签名的钱包（用于写入）
export const getContractWithSigner = async (): Promise<ethers.Contract> => {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);

    // 请求连接 MetaMask
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  } else {
    throw new Error("MetaMask 未安装");
  }
};


// 📌 读取合约数据示例
export const readContractData = async (methodName: string): Promise<any> => {
  try {
    const contract = getContractReadOnly();
    // 其他代码...
  } catch (error) {
    console.error("读取合约数据失败", error);
  }
};


// 📌 发送交易（写入合约）
export const writeContractData = async (methodName: string, params: any[]): Promise<void> => {
  try {
    const contract = await getContractWithSigner();
    const tx = await contract[methodName](...params); // 使用动态方法名和参数
    console.log("交易发送中:", tx.hash);
    await tx.wait(); // 等待交易上链
    console.log("交易成功:", tx.hash);
  } catch (error) {
    console.error(`交易失败（方法名: ${methodName}，参数: ${params}）:`, error);
    throw error; // 抛出错误以便调用者处理
  }
};
