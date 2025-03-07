# CharityTracker Smart Contract

## Overview
The **CharityTracker** smart contract is a transparent and decentralized solution for tracking donations and expenses in a charity. It enables users to donate funds while allowing the contract owner to withdraw them for specific purposes.

## Verified Contract
- **Contract Address:** `0x77451aeF3E4C4732BA24051aDaDb92577755240e`
- **View on ScrollScan:** [ScrollScan Link](https://sepolia.scrollscan.com/address/0x77451aef3e4c4732ba24051adadb92577755240e)

## Features
- **Accept Donations:** Users can send ETH to the contract as donations.
- **Track Donations:** Stores donation history including donor address, amount, and timestamp.
- **Withdraw Funds:** The contract owner can withdraw funds for expenses, recording the transaction details.
- **Expense Tracking:** Maintains a log of all withdrawals, including the reason and timestamp.
- **View Contract Balance:** Anyone can check the current ETH balance of the contract.

## Smart Contract Details
- **Language:** Solidity `^0.8.16`
- **License:** MIT
- **Network Compatibility:** Ethereum and compatible EVM-based chains

## Deployment
To deploy this contract on an Ethereum network:
1. Install [Remix IDE](https://remix.ethereum.org/) or use Hardhat/Truffle.
2. Compile the contract using Solidity `0.8.16`.
3. Deploy using MetaMask or a deployed script.

Alternatively, using Hardhat:
```sh
npx hardhat compile
npx hardhat run scripts/deploy.js --network <network>
```

## Usage
### 1️⃣ Donating ETH
Users can donate ETH to the contract by calling:
```solidity
function donate() external payable;
```
- The donation amount is stored along with the donor's address and timestamp.
- The event `DonationReceived` is emitted upon successful donation.

### 2️⃣ Checking Contract Balance
To check the current balance of the contract:
```solidity
function getBalance() external view returns (uint256);
```

### 3️⃣ Withdrawing Funds (Owner Only)
The contract owner can withdraw funds for a specific purpose:
```solidity
function withdrawFunds(address payable recipient, uint256 amount, string calldata description) external onlyOwner;
```
- The function records expenses in the `expenses` array.
- The event `FundsWithdrawn` is emitted for tracking.

### 4️⃣ Fetching Donation & Expense Records
- **Get all donation records:**
  ```solidity
  function getDonations() external view returns (Donation[] memory);
  ```
- **Get all expense records:**
  ```solidity
  function getExpenses() external view returns (Expense[] memory);
  ```

## Events
```solidity
 event DonationReceived(address indexed donor, uint256 amount, uint256 timestamp);
 event FundsWithdrawn(address indexed recipient, uint256 amount, string description, uint256 timestamp);
```

## Security Considerations
- **Owner Restriction:** Only the contract owner can withdraw funds.
- **Reentrancy Safe:** The contract follows a pull-over-push pattern to prevent reentrancy attacks.
- **Immutable Storage:** All donations and expenses are permanently stored on the blockchain for full transparency.

## License
This project is licensed under the **MIT License**.

