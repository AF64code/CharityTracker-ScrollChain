import { ethers } from "hardhat";

async function main() {
  const CharityTracker = await ethers.getContractFactory("CharityTracker");
  const contract = await CharityTracker.deploy();
  await contract.deployed();

  console.log(`CharityTracker deployed at: ${contract.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});