import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ClientDashboard from './pages/ClientDashboard';
import StaffDashboard from './pages/StaffDashboard';
import Transfer from './pages/Transfer';
import ApplyLoan from './pages/ApplyLoan';
import TransactionHistory from './pages/TransactionHistory';
import Statement from './pages/Statement';
import Login from './pages/Login';
import SignUp from './pages/SignUp'; // Import Sign Up

function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/client-dashboard" element={<ClientDashboard/>}/>
        <Route path="/staff-dashboard" element={<StaffDashboard/>}/>
        <Route path="/transfer" element={<Transfer/>}/>
        <Route path="/apply-loan" element={<ApplyLoan/>}/>
        <Route path="/transactions" element={<TransactionHistory/>}/>
        <Route path="/statement" element={<Statement/>}/>
        <Route path="/login" element={<Login/>}/> {/* Login Route */}
        <Route path="/signup" element={<SignUp/>}/> {/* Sign Up Route */}
      </Routes>
    </Router>
  );
}

export default App;
