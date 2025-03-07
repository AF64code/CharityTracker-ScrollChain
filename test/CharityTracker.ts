const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("CharityTracker", function () {
    let CharityTracker: any; // 或者您可以指定为具体的类型
    let charityTracker: any; // 或者您可以指定为具体的类型
    let owner: any; // 
    let donor: any; // 同上
    let recipient: any; // 同上

    beforeEach(async function () {
        CharityTracker = await ethers.getContractFactory("CharityTracker");
        [owner, donor, recipient] = await ethers.getSigners();
        charityTracker = await CharityTracker.deploy();
        await charityTracker.deployed();
    });

    it("应该部署并设置正确的所有者", async function () {
        expect(await charityTracker.owner()).to.equal(owner.address);
    });

    it("应该允许捐赠者捐赠ETH", async function () {
        const donationAmount = ethers.utils.parseEther("1");
        await charityTracker.connect(donor).donate({ value: donationAmount });
        const donations = await charityTracker.getDonations();
        expect(donations.length).to.equal(1);
        expect(donations[0].donor).to.equal(donor.address);
        expect(donations[0].amount).to.equal(donationAmount);
    });


    it("应该不允许提取超过合约余额的资金", async function () {
        const donationAmount = ethers.utils.parseEther("1");
        await charityTracker.connect(donor).donate({ value: donationAmount });

        const withdrawAmount = ethers.utils.parseEther("2");
        const description = "Monthly expense";

        await expect(charityTracker.connect(owner).withdrawFunds(recipient.address, withdrawAmount, description))
            .to.be.revertedWith("Insufficient funds");

        const expenses = await charityTracker.getExpenses();
        expect(expenses.length).to.equal(0);
    });
});

