import React from 'react';
import {Link} from 'react-router-dom';
import './Home.css'; // Optional styling

const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome to Western One Bank</h1>
      <p>Select an option below to proceed:</p>
      <div className="home-options">
        <Link to="/client-dashboard" className="home-option">Client
          Dashboard</Link>
        <Link to="/staff-dashboard" className="home-option">Staff
          Dashboard</Link>
        <Link to="/transfer" className="home-option">Transfer Funds</Link>
        <Link to="/apply-loan" className="home-option">Apply for Loan</Link>
        <Link to="/transactions" className="home-option">Transaction
          History</Link>
        <Link to="/statement" className="home-option">View Statements</Link>
      </div>
    </div>
  );
};

export default Home;
