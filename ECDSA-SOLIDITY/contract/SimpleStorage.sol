// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract SimpleStorage {
    struct Wallet {
        uint256 balance;
        bool isClaimed;
    }


    mapping(address => Wallet) public user;
    address[] public wallets;            // Track all initialized wallets
    mapping(address => bool) public isInWallets; // Prevent duplicates


    /* Initialize creator's wallet */
    constructor() {
        user[msg.sender] = Wallet(1000, true);
        wallets.push(msg.sender);
        isInWallets[msg.sender] = true;
    }


    /* Initialize wallet */
    function initWallet(address _add) public {
        require(!user[_add].isClaimed, "Already exists");
        user[_add] = Wallet(0, true);
        if (!isInWallets[_add]) {
            wallets.push(_add);
            isInWallets[_add] = true;
        }
    }


    function balance(address _add) public view returns(uint256) {
        require(user[_add].isClaimed, "wallet does not exist");
        return user[_add].balance;
    }


    function faucet(address _add) public {
        require(user[_add].isClaimed, "wallet does not exist");
        user[_add].balance += 100;
    }


    // The added function: Return all wallet info as array of structs
    function getWalletList() public view returns (Wallet[] memory allWallets, address[] memory addrs) {
        uint length = wallets.length;
        allWallets = new Wallet[](length);
        addrs = new address[](length);
        for (uint i = 0; i < length; i++) {
            addrs[i] = wallets[i];
            allWallets[i] = user[wallets[i]];
        }
        return (allWallets, addrs);
    }


    function deleteWallet(address _add) public {
        // Only the wallet owner (msg.sender) can delete their own wallet
        require(msg.sender == _add, "Can only delete your own wallet");
        require(isInWallets[_add], "Address not in wallets list");

        delete user[_add];
        isInWallets[_add] = false;

        uint length = wallets.length;
        for (uint i = 0; i < length; i++) {
            if (wallets[i] == _add) {
                wallets[i] = wallets[length - 1];
                wallets.pop();
                break;
            }
        }
    }


    function send(uint256 amount , address receiver) public {
        require(amount > 0 , "Invalid amount");
        require(isInWallets[msg.sender], "Sender Invalid");
        require(isInWallets[receiver], "Receiver Invalid");
        require(user[msg.sender].balance >= amount , "Insufficient amount");


        user[msg.sender].balance -= amount;
        user[receiver].balance += amount;
    }


}
