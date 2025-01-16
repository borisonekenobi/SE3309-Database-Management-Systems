import React, {useEffect, useState} from 'react';
import './TransactionHistory.css';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: '',
  });

  useEffect(() => {
    const client = JSON.parse(sessionStorage.getItem('client'));
    if (!client) {
      window.location.href = '/login';
    }

    const fetchTransactions = async () => {
      const response = await fetch('http://localhost:3000/api/transaction',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': JSON.stringify(client),
            }
          });
      return await response.json();
    };

    fetchTransactions().then(data => setTransactions(data));
  }, []);

  // Handle filter changes
  const handleFilterChange = (e) => {
    setFilters({...filters, [e.target.name]: e.target.value});
  };

  // Filter transactions
  const filteredTransactions = transactions.filter((transaction) => {
    const {startDate, endDate, minAmount, maxAmount} = filters;
    const date = new Date(transaction.datetime);

    const matchesDate = (!startDate || date >= new Date(`${startDate}T05:00:00Z`)) &&
        (!endDate || date <= new Date(`${endDate}T05:00:00Z`));

    const matchesAmount =
        (!minAmount || parseFloat(transaction.amount.substring(1)) >= parseFloat(minAmount)) &&
        (!maxAmount || parseFloat(transaction.amount.substring(1)) <= parseFloat(maxAmount));

    return matchesDate && matchesAmount;
  });

  return (
    <div className="transaction-history-container">
      <h1>Transaction History</h1>
      <div className="filters">
        <h3>Filter Transactions</h3>
        <div className="filter-group">
          <label>Start Date:</label>
          <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
          />
        </div>
        <div className="filter-group">
          <label>End Date:</label>
          <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
          />
        </div>
        <div className="filter-group">
          <label>Min Amount:</label>
          <input
              type="number"
              name="minAmount"
              value={filters.minAmount}
              onChange={handleFilterChange}
          />
        </div>
        <div className="filter-group">
          <label>Max Amount:</label>
          <input
              type="number"
              name="maxAmount"
              value={filters.maxAmount}
              onChange={handleFilterChange}
          />
        </div>
      </div>
      <table className="transaction-table">
        <thead>
        <tr>
          <th>Date</th>
          <th>Status</th>
          <th>Amount</th>
          <th>Merchant</th>
        </tr>
        </thead>
        <tbody>
        {filteredTransactions.map((transaction) => (<tr key={transaction.transaction_id}>
              <td>{new Date(transaction.datetime).toLocaleDateString()}</td>
              <td>{transaction.status}</td>
              <td>{transaction.amount}</td>
              <td>{transaction.merchant_name}</td>
            </tr>))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionHistory;
