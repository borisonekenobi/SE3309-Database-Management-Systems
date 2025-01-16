import React, {useEffect, useState} from 'react';
import './ClientDashboard.css';

const ClientDashboard = () => {
  const [clientData, setClientData] = useState(null);

  const fetchClientData = async (id) => {
    const res = await fetch(`http://localhost:3000/api/client/${id}`);
    return await res.json();
  }

  useEffect(() => {
    if (sessionStorage.getItem('client')) {
      const client = JSON.parse(sessionStorage.getItem('client'));
      fetchClientData(client.id).then(data => {
        sessionStorage.setItem('client', JSON.stringify(data));
        setClientData(data);
      });
    } else {
      window.location.href = '/login';
    }
  }, []);

  if (!clientData) return <div>Loading...</div>;

  return (
    <div className="dashboard-container">
      <h1>Welcome, {clientData.user.name}</h1>
      <div className="account-info">
        <h2>Account Information</h2>
        <p><strong>Email:</strong> {clientData.user.email}</p>
        <p><strong>Phone:</strong> {clientData.user.phone_number}</p>
        <h3>Accounts:</h3>
        {clientData.accounts.map(
            (account) => (<div key={account.id} className="account-card">
                  <p><strong>Account Type:</strong> {account.type}</p>
                  <p><strong>Balance:</strong> {account.balance}</p>
                </div>))}
        <h3>Total Balance: {clientData.total_account_balance}</h3>
      </div>
      <div className="dashboard-actions">
        {clientData.accounts.length > 1 &&
          <button className="btn"
                  onClick={() => window.location.href = '/transfer'}>
            Transfer Funds
          </button>
        }
        <button className="btn"
                onClick={() => window.location.href = '/apply-loan'}>
          Apply for Loan
        </button>
      </div>
    </div>
  );
};

export default ClientDashboard;
