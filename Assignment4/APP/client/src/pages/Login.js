import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import './Auth.css';

const Login = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3000/api/client-login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({card_number: cardNumber, password: password})
    });
    if (res.ok) {
      const data = await res.json();
      sessionStorage.setItem('client', JSON.stringify(data));
      window.location.href = '/';
    }
  };

  return (
    <div className="auth-container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label>Card Number:</label>
          <input
              // type="email"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
          />
        </div>
        <button type="submit" className="btn">Login</button>
      </form>
      <p className="auth-toggle">
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
};

export default Login;
