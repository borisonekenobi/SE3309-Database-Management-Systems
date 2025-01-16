const {createClient} = require('./database_client');

async function transfer(accountId, destinationAccountId, amount) {
  const client = await createClient();
  try {
    await client.connect();
    await client.query('BEGIN');
    await client.query(`
        UPDATE wob.account
        SET balance = balance - $1
        WHERE account_id = $2`,
        [amount, accountId]
    );
    await client.query(`
        UPDATE wob.account
        SET balance = balance + $1
        WHERE account_id = $2`,
        [amount, destinationAccountId]
    );
    await client.query('COMMIT');
    return Promise.resolve();
  } catch (error) {
    await client.query('ROLLBACK');
    return Promise.reject(error);
  } finally {
    client.end();
  }
}

async function findAllTransactions(clientId) {
  const client = await createClient();
  try {
    await client.connect();
    const result = await client.query(`
        SELECT *
        FROM wob.transaction
        WHERE account_id IN (
          SELECT account_id
          FROM wob.account
          WHERE bank_card_id IN (
            SELECT bank_card_id
            FROM wob.bank_card
            WHERE client_id = $1
          )
        )
        ORDER BY datetime DESC`,
        [clientId]
    );
    return result.rows;
  } catch (error) {
    throw error;
  } finally {
    client.end();
  }
}

module.exports = {
  transfer,
  findAllTransactions
};
