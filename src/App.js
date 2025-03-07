import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Button, Input, Card } from "antd";

const CONTRACT_ADDRESS = "0x77451aeF3E4C4732BA24051aDaDb92577755240e"; // 你的合约地址
const ABI =  [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "donor",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "DonationReceived",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "FundsWithdrawn",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "donate",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "donations",
    "outputs": [
      {
        "internalType": "address",
        "name": "donor",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "expenses",
    "outputs": [
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getBalance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getDonations",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "donor",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          }
        ],
        "internalType": "struct CharityTracker.Donation[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getExpenses",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "description",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          }
        ],
        "internalType": "struct CharityTracker.Expense[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address payable",
        "name": "recipient",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      }
    ],
    "name": "withdrawFunds",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

function CharityTrackerUI() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [contract, setContract] = useState(null);
  const [balance, setBalance] = useState("0");
  const [donations, setDonations] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [donationAmount, setDonationAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawDescription, setWithdrawDescription] = useState("");
  const [recipient, setRecipient] = useState("");

  // 连接 MetaMask
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum); // ✅ v5 方式
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setProvider(provider);
        setSigner(signer);
        setWalletAddress(address);

        const newContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
        setContract(newContract);

        fetchBalance(newContract);
        fetchDonations(newContract);
        fetchExpenses(newContract);
      } catch (error) {
        console.error("Wallet connection failed:", error);
      }
    } else {
      alert("请安装 MetaMask 扩展！");
    }
  };

  const fetchBalance = async (contract) => {
    if (contract) {
      const bal = await contract.getBalance();
      setBalance(ethers.utils.formatEther(bal)); // ✅ v5 方式
    }
  };

  const fetchDonations = async (contract) => {
    if (contract) {
      const data = await contract.getDonations();
      setDonations(data);
    }
  };

  const fetchExpenses = async (contract) => {
    if (contract) {
      const data = await contract.getExpenses();
      setExpenses(data);
    }
  };

  const donate = async () => {
    if (contract && donationAmount) {
      const tx = await contract.donate({ value: ethers.utils.parseEther(donationAmount) }); // ✅ v5 方式
      await tx.wait();
      fetchBalance(contract);
      fetchDonations(contract);
      setDonationAmount("");
    }
  };

  const withdrawFunds = async () => {
    if (contract && withdrawAmount && recipient && withdrawDescription) {
      const tx = await contract.withdrawFunds(
        recipient,
        ethers.utils.parseEther(withdrawAmount), // ✅ v5 方式
        withdrawDescription
      );
      await tx.wait();
      fetchBalance(contract);
      fetchExpenses(contract);
      setWithdrawAmount("");
      setRecipient("");
      setWithdrawDescription("");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Charity Tracker</h1>

      {/* 连接钱包按钮 */}
      {!walletAddress ? (
        <Button type="primary" onClick={connectWallet}>
          Connect Wallet
        </Button>
      ) : (
        <p>Connected: {walletAddress}</p>
      )}

      <Card title="Contract Balance">
        <h2>{balance} ETH</h2>
      </Card>

      <Card title="Donate ETH">
        <Input
          placeholder="Amount in ETH"
          value={donationAmount}
          onChange={(e) => setDonationAmount(e.target.value)}
        />
        <Button type="primary" onClick={donate} style={{ marginTop: 10 }}>
          Donate
        </Button>
      </Card>

      <Card title="Withdraw Funds (Owner Only)">
        <Input
          placeholder="Recipient Address"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
        <Input
          placeholder="Amount in ETH"
          value={withdrawAmount}
          onChange={(e) => setWithdrawAmount(e.target.value)}
        />
        <Input
          placeholder="Description"
          value={withdrawDescription}
          onChange={(e) => setWithdrawDescription(e.target.value)}
        />
        <Button type="primary" onClick={withdrawFunds} style={{ marginTop: 10 }}>
          Withdraw
        </Button>
      </Card>

      <Card title="Donation Records">
        {donations.map((donation, index) => (
          <p key={index}>
            {donation.donor} donated {ethers.utils.formatEther(donation.amount)} ETH at{" "}
            {new Date(donation.timestamp * 1000).toLocaleString()}
          </p>
        ))}
      </Card>

      <Card title="Expense Records">
        {expenses.map((expense, index) => (
          <p key={index}>
            {expense.description}: {ethers.utils.formatEther(expense.amount)} ETH at{" "}
            {new Date(expense.timestamp * 1000).toLocaleString()}
          </p>
        ))}
      </Card>
    </div>
  );
}

export default CharityTrackerUI;
