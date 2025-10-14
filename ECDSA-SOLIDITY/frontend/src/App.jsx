import Wallet from "./Wallet";
import Transfer from "./Transfer";
import BalanceChecker from "./bc";
import WalletList from "./wall";
import { useState } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [privateKey, setPrivateKey] = useState("");
  const [address, setAddress] = useState("");

  const appStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '40px 20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '30px'
  };

  const headerStyle = {
    maxWidth: '1200px',
    margin: '0 auto 30px',
    textAlign: 'center'
  };

  const connectButtonStyle = {
    padding: '15px 30px',
    background: 'rgba(255, 255, 255, 0.95)',
    color: '#667eea',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
    transition: 'transform 0.2s ease'
  };

  async function connectWallet() {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        alert("✅ MetaMask connected!");
      } catch (error) {
        console.error("Connection failed:", error);
        alert("❌ Failed to connect MetaMask");
      }
    } else {
      alert("⚠️ Please install MetaMask!");
    }
  }

  return (
    <div style={appStyle}>
      <div style={headerStyle}>
        <button 
          style={connectButtonStyle}
          onClick={connectWallet}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
          Connect MetaMask
        </button>
      </div>
      
      <div style={containerStyle}>
        {/* 1. Wallet List - Full width at top */}
        <WalletList />
        
        {/* 2. Create Wallet - Left side */}
        <Wallet
          balance={balance}
          setBalance={setBalance}
          setPrivateKey={setPrivateKey}
          setAddress={setAddress}
        />
        
        {/* 3. Transfer - Right side */}
        <Transfer 
          balance={balance}
          setBalance={setBalance} 
          privateKey={privateKey}
          address={address}
        />
        
        {/* 4. Check Balance - Full width at bottom */}
        <BalanceChecker />
      </div>
    </div>
  );
}

export default App;
