import * as secp from "ethereum-cryptography/secp256k1";
import { toHex, utf8ToBytes, hexToBytes } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";
import { getRandomBytesSync } from "ethereum-cryptography/random";
import { useState } from "react";
import { getContract } from "./server";

function Wallet({ balance, setBalance, setPrivateKey, setAddress }) {
  const [localPrivateKey, setLocalPrivateKey] = useState("");
  const [localAddress, setLocalAddress] = useState("");
  const [message, setMessage] = useState("");

  const walletContainerStyle = {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    padding: '30px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    transition: 'transform 0.3s ease'
  };

  const titleStyle = {
    fontSize: '28px',
    color: '#2d3748',
    marginBottom: '20px',
    fontWeight: '700',
    textAlign: 'center'
  };

  const balanceBoxStyle = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '30px',
    borderRadius: '15px',
    marginBottom: '25px',
    boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
    textAlign: 'center'
  };

  const balanceTextStyle = {
    color: '#ffffff',
    fontSize: '32px',
    fontWeight: '800',
    margin: '0',
    letterSpacing: '1px',
    textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
  };

  const buttonStyle = {
    width: '100%',
    padding: '15px 25px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 5px 15px rgba(102, 126, 234, 0.4)',
    marginBottom: '20px'
  };

  const sectionStyle = {
    marginBottom: '20px',
    padding: '20px',
    background: '#f7fafc',
    borderRadius: '12px',
    borderLeft: '4px solid #667eea'
  };

  const labelStyle = {
    fontSize: '14px',
    color: '#4a5568',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '10px',
    display: 'block'
  };

  const valueBoxStyle = {
    wordBreak: 'break-all',
    padding: '12px',
    background: 'white',
    borderRadius: '8px',
    fontFamily: "'Courier New', monospace",
    fontSize: '13px',
    lineHeight: '1.6',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    marginTop: '8px'
  };

  const privateKeyStyle = {
    ...valueBoxStyle,
    color: '#e53e3e'
  };

  const warningStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    marginTop: '8px',
    color: '#e53e3e',
    fontWeight: '600',
    fontSize: '12px'
  };

  const messageBoxStyle = {
    padding: '20px',
    margin: '20px 0',
    background: 'linear-gradient(135deg, #e0e7ff 0%, #fce7f3 100%)',
    borderRadius: '12px',
    border: '2px solid #667eea'
  };

  const messageTextStyle = {
    margin: '0',
    color: '#4c1d95',
    fontWeight: '500',
    lineHeight: '1.5'
  };

  async function generateWallet() {
    try {
      const privKey = getRandomBytesSync(32);
      const pubKey = secp.getPublicKey(privKey, false);
      const address = "0x" + toHex(keccak256(pubKey.slice(1)).slice(-20));
      const privKeyHex = toHex(privKey);

      setLocalPrivateKey(privKeyHex);
      setLocalAddress(address);
      setPrivateKey(privKeyHex);
      setAddress(address);
      setMessage("Wallet generated! Initializing on blockchain...");

      // Call contract initWallet function
      const contract = await getContract();
      const tx = await contract.initWallet(address);
      await tx.wait();

      setMessage("✅ Wallet initialized on blockchain!");
      
      // Claim faucet
      await claimFaucet(address);
    } catch (error) {
      setMessage("Error: " + error.message);
      console.error(error);
    }
  }


  async function claimFaucet(address) {
    try {
      const contract = await getContract();
      const tx = await contract.faucet(address);
      await tx.wait();

      const newBalance = await contract.balance(address);
      setBalance(Number(newBalance));
      setMessage(`✅ Faucet claimed! Balance: ${newBalance} tokens`);
    } catch (error) {
      setMessage("❌ Faucet claim failed: " + error.message);
      console.error(error);
    }
  }

  return (
    <div style={walletContainerStyle}>
      <h2 style={titleStyle}>💼 Wallet</h2>
      
      <div style={balanceBoxStyle}>
        <h3 style={balanceTextStyle}>BALANCE: {balance}</h3>
      </div>
      
      <button onClick={generateWallet} style={buttonStyle}>
        🔑 Generate New Wallet
      </button>
      
      {localAddress && (
        <div>
          <div style={sectionStyle}>
            <label style={labelStyle}>Address</label>
            <div style={valueBoxStyle}>{localAddress}</div>
          </div>
          
          <div style={sectionStyle}>
            <label style={labelStyle}>Private Key</label>
            <div style={privateKeyStyle}>{localPrivateKey}</div>
            <small style={warningStyle}>⚠️ Never share your private key!</small>
          </div>
        </div>
      )}
      
      {message && (
        <div style={messageBoxStyle}>
          <p style={messageTextStyle}>{message}</p>
        </div>
      )}
    </div>
  );
}

export default Wallet;
