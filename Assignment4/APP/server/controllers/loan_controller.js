const db = require('../database/loan_database');

exports.create = (req, res) => {
  const loan = req.body.loan;
  const client_id = req.body.client_id;

  db.createLoan(loan, client_id)
  .then(() => res.status(200).send({message: 'Loan application submitted successfully!'}))
  .catch(() => res.status(500).send({message: 'Failed to submit loan application. Please try again.'}));
};
