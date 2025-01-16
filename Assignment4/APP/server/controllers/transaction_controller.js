const db = require('../database/transaction_database');

exports.transfer = async (req, res) => {
  const sourceAccountId = req.body.source_account_id;
  const destinationAccountId = req.body.destination_account_id;
  let amount = req.body.amount;

  if (sourceAccountId === destinationAccountId) {
    return res.status(400).json({message: 'Source and destination accounts cannot be the same.'});
  }

  try {
    amount = parseFloat(amount);
  } catch (error) {
    return res.status(400).json({message: 'Invalid transfer amount.'});
  }

  if (amount <= 0) {
    return res.status(400).json({message: 'Transfer amount must be greater than zero.'});
  }

  db.transfer(sourceAccountId, destinationAccountId, amount)
  .then(() => res.status(200).json({message: 'Transfer successful.'}))
  .catch(() => res.status(500).json({message: 'An error occurred during the transfer.'}));
}

exports.findAll = (req, res) => {

  const client = JSON.parse(req.headers.authorization);
  db.findAllTransactions(client.id)
  .then(transactions => res.status(200).json(transactions))
  .catch(() => res.status(500).json({message: 'An error occurred while fetching transactions.'}));
}
