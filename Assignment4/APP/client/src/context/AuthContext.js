import React, {createContext, useState} from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [client, setClient] = useState(null);
  const [staff, setStaff] = useState(null);

  const clientLogin = async (cardNumber, password) => {
    try {
      const response = await axios.post('/api/client-login', {
        card_number: cardNumber, password: password,
      });
      setClient(response.data);
    } catch (error) {
      throw error.response.data;
    }
  };

  const staffLogin = async (email, password) => {
    try {
      const response = await axios.post('/api/staff-login', {
        email, password,
      });
      setStaff(response.data);
    } catch (error) {
      throw error.response.data;
    }
  };

  const logout = () => {
    setClient(null);
    setStaff(null);
  };

  return (
    <AuthContext.Provider
        value={{client, staff, clientLogin, staffLogin, logout}}
    >
      {children}
    </AuthContext.Provider>);
};
