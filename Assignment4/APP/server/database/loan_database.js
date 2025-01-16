const {createClient} = require('./database_client');

async function createLoan(loan, client_id) {
  const client = await createClient(client_id);
  try {
    await client.connect();
    await client.query(`
        WITH interest AS (
            INSERT INTO wob.interest (interest_rate, interest_type)
            VALUES(0.05, 'simple')
            RETURNING interest_id
        )
        INSERT INTO wob.loan_application (amount, status, collateral, client_id, interest_id)
        VALUES ($1, 'pending', $2, $3, (SELECT interest_id FROM interest))
        RETURNING loan_application_id;`,
        [loan.amount, loan.type, client_id]
    );
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  } finally {
    client.end();
  }
}

module.exports = {
  createLoan
};
