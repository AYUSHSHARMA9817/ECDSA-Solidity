import { useState } from "react";
import { getContract } from "./server";

function Transfer({ privateKey, address, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const transferContainerStyle = {
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
    marginBottom: '25px',
    fontWeight: '700',
    textAlign: 'center'
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  };

  const labelStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    color: '#4a5568',
    fontWeight: '600',
    fontSize: '14px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  const inputStyle = {
    padding: '15px 20px',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    background: '#f7fafc',
    outline: 'none'
  };

  const buttonStyle = {
    padding: '15px 25px',
    background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 5px 15px rgba(72, 187, 120, 0.4)',
    marginTop: '10px'
  };

  async function transfer(evt) {
    evt.preventDefault();

    if (!address) {
      alert("Please generate a wallet first!");
      return;
    }

    try {
      const contract = await getContract();
      const tx = await contract.send(parseInt(sendAmount), recipient);
      await tx.wait();

      const newBalance = await contract.balance(address);
      setBalance(Number(newBalance));

      setSendAmount("");
      setRecipient("");
      alert("✅ Transfer successful!");
    } catch (error) {
      console.error("Transfer error:", error);
      alert("❌ " + error.message);
    }
  }

  return (
    <div style={transferContainerStyle}>
      <h2 style={titleStyle}>💸 Transfer</h2>
      
      <form onSubmit={transfer} style={formStyle}>
        <label style={labelStyle}>
          Send Amount
          <input
            placeholder="1, 2, 3..."
            value={sendAmount}
            onChange={(e) => setSendAmount(e.target.value)}
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
          />
        </label>

        <label style={labelStyle}>
          Recipient
          <input
            placeholder="0x2..."
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
          />
        </label>

        <button type="submit" style={buttonStyle}>
          Transfer
        </button>
      </form>
    </div>
  );
}

export default Transfer;
