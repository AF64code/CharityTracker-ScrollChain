// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

// 慈善跟踪合约
contract CharityTracker {
    address public owner;

    // 捐赠结构体包含捐赠者地址、捐赠金额和时间戳
    struct Donation {
        address donor;
        uint256 amount;
        uint256 timestamp;
    }

    // 费用结构体包含费用描述、费用金额和时间戳
    struct Expense {
        string description;
        uint256 amount;
        uint256 timestamp;
    }

    Donation[] public donations; // 存储捐赠记录
    Expense[] public expenses; // 存储费用记录

    event DonationReceived(address indexed donor, uint256 amount, uint256 timestamp); // 捐赠事件
    event FundsWithdrawn(address indexed recipient, uint256 amount, string description, uint256 timestamp); // 提现事件

    modifier onlyOwner() { // 仅允许合约所有者调用的方法修饰符
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor() { // 构造函数，设置合约的拥有者
        owner = msg.sender;
    }

    // 接受捐赠的函数
    function donate() external payable {
        require(msg.value > 0, "Must send ETH");
        donations.push(Donation(msg.sender, msg.value, block.timestamp));
        emit DonationReceived(msg.sender, msg.value, block.timestamp);
    }

    // 允许合约所有者提取资金的函数
    function withdrawFunds(address payable recipient, uint256 amount, string calldata description) external onlyOwner {
        require(amount <= address(this).balance, "Insufficient funds");
        expenses.push(Expense(description, amount, block.timestamp));
        emit FundsWithdrawn(recipient, amount, description, block.timestamp);
        recipient.transfer(amount);
    }

    // 获取捐赠记录的函数
    function getDonations() external view returns (Donation[] memory) {
        return donations;
    }

    // 获取费用记录的函数
    function getExpenses() external view returns (Expense[] memory) {
        return expenses;
    }

    // 获取合约余额的函数
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}