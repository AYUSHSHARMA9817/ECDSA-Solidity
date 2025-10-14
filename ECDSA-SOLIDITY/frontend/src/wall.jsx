import { useState, useEffect } from "react";
import * as secp from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";  // ADD THIS
import { toHex, utf8ToBytes, hexToBytes } from "ethereum-cryptography/utils";
import { getContract } from "./server";
import { ethers } from 'ethers';

function WalletList() { 
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const containerStyle = {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    padding: '30px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    gridColumn: 'span 2'
  };

  const titleStyle = {
    fontSize: '28px',
    color: '#2d3748',
    marginBottom: '25px',
    fontWeight: '700',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const buttonStyle = {
    padding: '12px 25px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 5px 15px rgba(102, 126, 234, 0.4)'
  };

  const deleteButtonStyle = {  // FIXED: Separate delete button style
    padding: '8px 15px',
    background: 'linear-gradient(135deg, #fc8181 0%, #e53e3e 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 3px 10px rgba(229, 62, 62, 0.3)'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0 10px',
    marginTop: '20px'
  };

  const thStyle = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '15px',
    textAlign: 'left',
    fontWeight: '600',
    fontSize: '14px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  const thFirstStyle = {
    ...thStyle,
    borderTopLeftRadius: '10px',
    borderBottomLeftRadius: '10px'
  };

  const thLastStyle = {
    ...thStyle,
    borderTopRightRadius: '10px',
    borderBottomRightRadius: '10px',
    textAlign: 'center'
  };

  const tdStyle = {
    background: '#f7fafc',
    padding: '15px',
    fontSize: '14px',
    color: '#2d3748',
    borderTop: '1px solid #e2e8f0',
    borderBottom: '1px solid #e2e8f0'
  };

  const tdFirstStyle = {
    ...tdStyle,
    borderLeft: '1px solid #e2e8f0',
    borderTopLeftRadius: '8px',
    borderBottomLeftRadius: '8px',
    fontWeight: '600'
  };

  const tdLastStyle = {
    ...tdStyle,
    borderRight: '1px solid #e2e8f0',
    borderTopRightRadius: '8px',
    borderBottomRightRadius: '8px',
    textAlign: 'center'
  };

  const addressStyle = {
    fontFamily: "'Courier New', monospace",
    fontSize: '13px',
    wordBreak: 'break-all',
    color: '#4a5568'
  };

  const balanceStyle = {
    fontWeight: '700',
    fontSize: '16px',
    color: '#667eea'
  };

  const badgeStyle = {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '600',
    background: '#c6f6d5',
    color: '#22543d'
  };

  const emptyStyle = {
    textAlign: 'center',
    padding: '40px',
    color: '#718096',
    fontSize: '16px'
  };

  const errorStyle = {
    padding: '15px',
    background: '#fed7d7',
    color: '#c53030',
    borderRadius: '12px',
    border: '2px solid #fc8181',
    marginTop: '15px',
    fontWeight: '500'
  };

  async function fetchWallets() {
    setLoading(true);
    setError("");
    try {
      const contract = await getContract();
      const [walletStructs, addresses] = await contract.getWalletList();

      const walletList = addresses.map((addr, i) => ({
        address: addr,
        balance: Number(walletStructs[i].balance),
        hasClaimed: walletStructs[i].isClaimed
      }));

      setWallets(walletList);
    } catch (err) {
      setError("Failed to fetch wallets: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function deleteWallet(address) {
    try {
      // Get current MetaMask account directly
      if (!window.ethereum) {
        alert("MetaMask not installed!");
        return;
      }
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const currentAddress = await signer.getAddress();
      
      if (currentAddress.toLowerCase() !== address.toLowerCase()) {
        alert("⚠️ Switch MetaMask to " + address + " to delete this wallet");
        return;
      }
      
      const confirmed = confirm("Are you sure you want to delete wallet " + address + "?");
      if (!confirmed) return;

      const contract = await getContract();
      const tx = await contract.deleteWallet(address);
      await tx.wait();

      alert("✅ Wallet deleted successfully!");
      fetchWallets();
    } catch (error) {
      console.error("Delete error:", error);
      alert("❌ Failed: " + error.message);
    }
  }


  useEffect(() => {
    fetchWallets();
  }, []);

  return (
    <div style={containerStyle}>
      <div style={titleStyle}>
        <span>📋 All Wallets ({wallets.length})</span>
        <button onClick={fetchWallets} style={buttonStyle} disabled={loading}>
          {loading ? "Loading..." : "🔄 Refresh"}
        </button>
      </div>

      {error && (
        <div style={errorStyle}>
          ❌ {error}
        </div>
      )}

      {!loading && wallets.length === 0 && (
        <div style={emptyStyle}>
          No wallets found. Generate a wallet to get started!
        </div>
      )}

      {wallets.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thFirstStyle}>#</th>
                <th style={thStyle}>Address</th>
                <th style={thStyle}>Balance</th>
                <th style={thStyle}>Status</th>
                <th style={thLastStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {wallets.map((wallet, index) => (
                <tr key={wallet.address}>
                  <td style={tdFirstStyle}>{index + 1}</td>
                  <td style={tdStyle}>
                    <div style={addressStyle}>{wallet.address}</div>
                  </td>
                  <td style={tdStyle}>
                    <span style={balanceStyle}>{wallet.balance} tokens</span>
                  </td>
                  <td style={tdStyle}>
                    {wallet.hasClaimed && (
                      <span style={badgeStyle}>✓ Claimed</span>
                    )}
                  </td>
                  <td style={tdLastStyle}>
                    <button 
                      onClick={() => deleteWallet(wallet.address)}  // FIXED: Pass address
                      style={deleteButtonStyle}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default WalletList;
