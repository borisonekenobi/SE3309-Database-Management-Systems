import axios from 'axios';

export const loginClient = async (cardNumber, password) => {
  const response = await axios.post('/api/client-login', {
    card_number: cardNumber, password,
  });
  return response.data;
};

export const getClientDetails = async (clientId) => {
  const response = await axios.get(`/api/client/${clientId}`);
  return response.data;
};

// Add more client-related API calls
