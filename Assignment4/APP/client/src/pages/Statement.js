import React, {useEffect, useState} from 'react';
import './Statement.css';

const Statement = () => {
  const [statements, setStatements] = useState('');

  const fetchStatements = async (client) => {
    const res = await fetch('http://localhost:3000/api/statement', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': JSON.stringify(client),
      },
    });
    return await res.json();
  };

  useEffect(() => {
    const client = JSON.parse(sessionStorage.getItem('client'));
    if (!client)  window.location.href = '/login';
    fetchStatements(client).then((data) => setStatements(data));
  }, []);

  if (!(statements instanceof Array)) return <div>Loading...</div>;

  return (
    <div className="statement-container">
      <h1>Account Statements</h1>
      <table className="statement-table">
        <thead>
        <tr>
          <th>Date</th>
          <th>Amount</th>
          <th>Balance</th>
        </tr>
        </thead>
        <tbody>
        {statements.map((statement) => (<tr key={statement.statement_id}>
              <td>{statement.end_date}</td>
              <td>{statement.balance}</td>
              <td>{statement.closing_balance}</td>
            </tr>))}
        </tbody>
      </table>
    </div>
  );
};

export default Statement;
