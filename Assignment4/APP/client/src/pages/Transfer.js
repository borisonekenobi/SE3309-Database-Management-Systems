import React, {useEffect, useState} from 'react';
import './Transfer.css';

const Transfer = () => {
  const [accounts, setAccounts] = useState([]);
  const [formData, setFormData] = useState({
    sourceAccount: '', destinationAccount: '', amount: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const client = JSON.parse(sessionStorage.getItem('client'));
    if (!client) {
      window.location.href = '/login';
    }
    client.accounts.forEach((account) => {
      account.balance = account.balance.substring(1);
    });
    setAccounts(client.accounts);
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.sourceAccount === formData.destinationAccount) {
      setMessage('Source and destination accounts cannot be the same.');
      return;
    }
    if (formData.amount <= 0) {
      setMessage('Transfer amount must be greater than zero.');
      return;
    }

    try {
      // Simulate API call for fund transfer
      const response = await fetch('http://localhost:3000/api/transfer', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({source_account_id: formData.sourceAccount, destination_account_id: formData.destinationAccount, amount: formData.amount}),
      });

      if (response.ok) {
        setMessage('Transfer successful!');
        const client = JSON.parse(sessionStorage.getItem('client'));
        const response = await fetch(`http://localhost:3000/api/client/${client.id}`);
        const data = await response.json();

        sessionStorage.setItem('client', JSON.stringify(data));
      } else {
        setMessage('Failed to complete the transfer. Please try again.');
      }
    } catch (error) {
      setMessage('An error occurred during the transfer.');
    }
  };

  // Handle form data change
  const handleChange = (e) => {
    if (e.target.name === 'amount' && parseFloat(e.target.value) <= 0) e.target.value = "0.01";
    if (e.target.name === 'amount' && parseFloat(e.target.value) > 10_000) e.target.value = "10000.00";

    setFormData({...formData, [e.target.name]: e.target.value});
  };

  return (
    <div className="transfer-container">
      <h1>Transfer Funds</h1>
      <form onSubmit={handleSubmit} className="transfer-form">
        <div className="form-group">
          <label>Source Account:</label>
          <select
              name="sourceAccount"
              value={formData.sourceAccount}
              onChange={handleChange}
              required
          >
            <option value="">Select an account</option>
            {accounts.map(
                (account) => (<option key={account.id} value={account.id}>
                      {account.type} - ${account.balance}
                    </option>))}
          </select>
        </div>
        <div className="form-group">
          <label>Destination Account:</label>
          <select
              name="destinationAccount"
              value={formData.destinationAccount}
              onChange={handleChange}
              required
          >
            <option value="">Select an account</option>
            {accounts.map(
                (account) => (<option key={account.id} value={account.id}>
                      {account.type} - ${account.balance}
                    </option>))}
          </select>
        </div>
        <div className="form-group">
          <label>Amount:</label>
          <input
              type="number"
              name="amount"
              value={formData.amount}
              min={0.01}
              max={10_000}
              onChange={handleChange}
              required
          />
        </div>
        <button type="submit" className="btn">
          Transfer
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default Transfer;
