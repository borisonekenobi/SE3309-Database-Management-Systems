import axios from 'axios';

export const applyForLoan = async (clientId, amount, termMonths) => {
  const response = await axios.post('/api/loan/apply', {
    clientId, amount, termMonths,
  });
  return response.data;
};

// Add more loan-related API calls
