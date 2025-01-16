import React from 'react';
import {Link} from 'react-router-dom';
import './Navbar.css'; // Ensure you have appropriate CSS for styling

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">Western One Bank</div>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/client-dashboard">Client Dashboard</Link></li>
        <li><Link to="/staff-dashboard">Staff Dashboard</Link></li>
        <li><Link to="/transfer">Transfer Funds</Link></li>
        <li><Link to="/apply-loan">Apply for Loan</Link></li>
        <li><Link to="/transactions">Transaction History</Link></li>
        <li><Link to="/statement">Statements</Link></li>
        <li><Link to="/login">Login</Link></li>
        {/* Added Login */}
        <li><Link to="/signup">Sign Up</Link></li>
        {/* Added Sign Up */}
      </ul>
    </nav>
  );
};

export default Navbar;
