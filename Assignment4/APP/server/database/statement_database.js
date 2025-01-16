const {createClient} = require('./database_client');

async function getStatements(account_id) {
  const client = await createClient();
  try {
    await client.connect();
    const res = await client.query(`
      SELECT *
      FROM wob.statement
      LEFT JOIN wob.account ON statement.account_id = account.account_id
      WHERE statement.account_id = $1`,
      [account_id]
    );
    return res.rows;
  } catch (e) {
    return e;
  } finally {
    await client.end();
  }
}

module.exports = {
  getStatements,
};
