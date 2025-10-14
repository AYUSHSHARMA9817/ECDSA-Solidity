import { ethers } from 'ethers';

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with actual address
const EXPECTED_CHAIN_ID = 31337;

const CONTRACT_ABI = [
  "function initWallet(address _add) public",
  "function balance(address _add) public view returns(uint256)",
  "function faucet(address _add) public",
  "function getWalletList() public view returns (tuple(uint256 balance, bool isClaimed)[] allWallets, address[] addrs)",
  "function deleteWallet(address _add) public",
  "function send(uint256 amount, address receiver) public"
];

export async function getContract() {
  if (!window.ethereum) {
    throw new Error("MetaMask not installed");
  }
  
  // Create provider without ENS support for local network
  const provider = new ethers.BrowserProvider(window.ethereum);
  const network = await provider.getNetwork();
  
  // Check if on correct network
  if (Number(network.chainId) !== EXPECTED_CHAIN_ID) {
    throw new Error(`Wrong network! Please switch to Hardhat Local (Chain ID: ${EXPECTED_CHAIN_ID}). Currently on Chain ID: ${network.chainId}`);
  }
  
  const signer = await provider.getSigner();
  
  // Use contract address directly (not ENS name)
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
}

export async function getProvider() {
  return new ethers.BrowserProvider(window.ethereum);
}
