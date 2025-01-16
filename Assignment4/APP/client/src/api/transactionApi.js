import axios from 'axios';

export const transferFunds = async (fromAccountId, toAccountId, amount) => {
  const response = await axios.post('/api/transfer', {
    fromAccountId, toAccountId, amount,
  });
  return response.data;
};

export const getTransactionHistory = async (accountId, filters) => {
  const response = await axios.get(`/api/transactions/${accountId}`, {
    params: filters,
  });
  return response.data;
};

// Add more transaction-related API calls
