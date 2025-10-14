import { useState } from "react";
import { getContract } from "./server";

function BalanceChecker() {
  const [checkAddress, setCheckAddress] = useState("");
  const [queriedBalance, setQueriedBalance] = useState(null);
  const [queriedAddress, setQueriedAddress] = useState("");
  const [error, setError] = useState("");

  const containerStyle = {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    padding: '30px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    transition: 'transform 0.3s ease',
    gridColumn: 'span 2'
  };

  const titleStyle = {
    fontSize: '28px',
    color: '#2d3748',
    marginBottom: '25px',
    fontWeight: '700',
    textAlign: 'center'
  };

  const formStyle = {
    display: 'flex',
    gap: '15px',
    marginBottom: '25px',
    flexWrap: 'wrap'
  };

  const inputStyle = {
    flex: '1',
    minWidth: '300px',
    padding: '15px 20px',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    background: '#f7fafc',
    outline: 'none',
    fontFamily: "'Courier New', monospace"
  };

  const buttonStyle = {
    padding: '15px 35px',
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 5px 15px rgba(240, 147, 251, 0.4)',
    whiteSpace: 'nowrap'
  };

  const resultBoxStyle = {
    padding: '25px',
    background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    borderRadius: '15px',
    border: '2px solid #f093fb',
    marginTop: '20px'
  };

  const balanceDisplayStyle = {
    fontSize: '32px',
    fontWeight: '800',
    color: '#2d3748',
    margin: '10px 0',
    textAlign: 'center'
  };

  const addressDisplayStyle = {
    fontSize: '14px',
    color: '#4a5568',
    wordBreak: 'break-all',
    fontFamily: "'Courier New', monospace",
    textAlign: 'center',
    marginTop: '10px'
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

  const labelStyle = {
    fontSize: '14px',
    color: '#4a5568',
    fontWeight: '600',
    marginBottom: '8px',
    display: 'block',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  async function handleCheckBalance(e) {
    e.preventDefault();
    setError("");

    const addressRegex = /^0x[0-9a-fA-F]{40}$/;
    if (!addressRegex.test(checkAddress)) {
      setError("Invalid Ethereum address format");
      return;
    }

    try {
      const contract = await getContract();
      const balance = await contract.balance(checkAddress);
      setQueriedBalance(Number(balance));
    } catch (err) {
      setError(err.message || "Failed to fetch balance");
    }
  }

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>🔍 Check Balance by Address</h2>
      
      <form onSubmit={handleCheckBalance} style={formStyle}>
        <div style={{ flex: '1', minWidth: '300px' }}>
          <label style={labelStyle}>Ethereum Address</label>
          <input
            type="text"
            placeholder="0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
            value={checkAddress}
            onChange={(e) => setCheckAddress(e.target.value)}
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = '#f093fb'}
            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
          />
        </div>
        <button type="submit" style={buttonStyle}>
          Check Balance
        </button>
      </form>

      {queriedBalance !== null && (
        <div style={resultBoxStyle}>
          <div style={balanceDisplayStyle}>
            💰 Balance: {queriedBalance} tokens
          </div>
          <div style={addressDisplayStyle}>
            {queriedAddress}
          </div>
        </div>
      )}

      {error && (
        <div style={errorStyle}>
          ❌ {error}
        </div>
      )}
    </div>
  );
}

export default BalanceChecker;
