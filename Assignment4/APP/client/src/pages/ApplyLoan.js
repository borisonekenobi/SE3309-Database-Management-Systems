import React, {useEffect, useState} from 'react';
import './ApplyLoan.css';

const ApplyLoan = () => {
  const [formData, setFormData] = useState({
    type: '', amount: '', term: '', reason: '',
  });
  const [clientId, setClientId] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (sessionStorage.getItem('client')) {
      const client = JSON.parse(sessionStorage.getItem('client'));
      setClientId(client.id);
    } else {
      window.location.href = '/login';
    }
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.amount <= 0) {
      setMessage('Loan amount must be greater than zero.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/loan', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({loan: formData, client_id: clientId}),
      });

      if (response.ok) {
        setMessage('Loan application submitted successfully!');
      } else {
        setMessage('Failed to submit loan application. Please try again.');
      }
    } catch (error) {
      setMessage('An error occurred during loan submission.');
    }
  };

  // Handle form data change
  const handleChange = (e) => {
    console.log(e);
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  return (
    <div className="apply-loan-container">
      <h1>Apply for a Loan</h1>
      <form onSubmit={handleSubmit} className="apply-loan-form">
        <div className="form-group">
          <label>Loan Type:</label>
          <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
          >
            <option value="">Select Loan Type</option>
            <option value="personal">Personal Loan</option>
            <option value="home">Home Loan</option>
            <option value="auto">Auto Loan</option>
          </select>
        </div>
        <div className="form-group">
          <label>Loan Amount:</label>
          <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
          />
        </div>
        <div className="form-group">
          <label>Loan Term (in months):</label>
          <input
              type="number"
              name="term"
              value={formData.term}
              onChange={handleChange}
              required
          />
        </div>
        <div className="form-group">
          <label>Reason for Loan:</label>
          <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              required
          ></textarea>
        </div>
        <button type="submit" className="btn">
          Submit Application
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default ApplyLoan;
