import React, {useEffect, useState} from 'react';
import './StaffDashboard.css';

const StaffDashboard = () => {
  const [clients, setClients] = useState([]);

  const fetchClients = async () => {
    const res = await fetch('http://localhost:3000/api/clients');
    return await res.json();
  };

  useEffect(() => {
    fetchClients().then(data => setClients(data));
  }, []);

  if (clients.length === 0) return <div>Loading...</div>;

  return (
    <div className="staff-dashboard-container">
      <h1>Staff Dashboard</h1>
      <h2>Clients</h2>
      <table className="clients-table">
        <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        {clients.map((client) => (<tr key={client.id}>
              <td>{client.user.name}</td>
              <td>{client.user.email}</td>
              <td>{client.user.phone_number}</td>
              <td>
                <button className="btn"
                        onClick={() => alert(`Viewing ${client.user.name}`)}>
                  View
                </button>
                <button className="btn"
                        onClick={() => alert(`Editing ${client.user.name}`)}>
                  Edit
                </button>
                <button className="btn danger"
                        onClick={() => alert(`Deleting ${client.user.name}`)}>
                  Delete
                </button>
              </td>
            </tr>))}
        </tbody>
      </table>
    </div>
  );
};

export default StaffDashboard;
