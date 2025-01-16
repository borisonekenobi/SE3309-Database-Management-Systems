const db = require('../database/statement_database');

exports.findAll = async (req, res) => {
  const client = JSON.parse(req.headers.authorization);

  const statements = [];
  for (let account of client.accounts) {
    const s = await db.getStatements(account.id);
    if (s instanceof Error) {
      console.error(s);
      return res.status(500).json(s);
    }
    statements.push(...s);
  }

  res.status(200).json(statements);
};
