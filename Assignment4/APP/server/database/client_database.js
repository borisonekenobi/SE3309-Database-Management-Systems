const dbClient = require('./database_client');

async function getClientSalt(card_number) {
  try {
    const client = dbClient.createClient();
    await client.connect();
    const res = await client.query(
      `SELECT salt
       FROM wob."user"
       JOIN wob.client ON wob."user".user_id = wob.client.user_id
       JOIN wob.bank_card ON wob.client.client_id = wob.bank_card.client_id
       WHERE card_number = $1`,
      [card_number]
    );
    await client.end();

    return res.rows.length === 1 ? res.rows[0].salt : '';
  } catch (e) {
    console.error(e);
  }
}

async function login(card_number, password) {
  try {
    const client = dbClient.createClient();
    await client.connect();
    const res = await client.query(
      `SELECT "user".user_id  AS id, "user".name, "user".phone_number, "user".email,
              address.address_id, address.street_number, address.street_name, address.city, address.province, address.postal_code, address.country,
              client.client_id, client.student_number,
              bank_card.bank_card_id, bank_card.expiry_date, bank_card.card_number, bank_card.status AS card_status, bank_card.daily_limit,
              card_type.card_type_id, card_type.name AS card_type_name,
              account.account_id, account.balance, account.status AS account_status,
              account_type.account_type_id, account_type.name AS account_type_name
       FROM wob."user"
       JOIN wob.address ON wob."user".address_id = wob.address.address_id
       JOIN wob.client ON wob."user".user_id = wob.client.user_id
       JOIN wob.bank_card ON wob.client.client_id = wob.bank_card.client_id
       JOIN wob.card_type ON wob.bank_card.card_type_id = wob.card_type.card_type_id
       JOIN wob.account ON wob.bank_card.bank_card_id = wob.account.bank_card_id
       JOIN wob.account_type ON wob.account.account_type_id = wob.account_type.account_type_id
       WHERE card_number = $1
         AND password = $2
         AND client.status = 'active'`,
        [card_number, password]
    );
    await client.end();

    return res.rows;
  } catch (e) {
    console.error(e);
  }
}

async function createClient(new_client) {
  try {
    const address = new_client.address;
    const user = new_client.user;

    const client = dbClient.createClient();
    await client.connect();
    const res = await client.query(
      `WITH address AS (
          INSERT INTO wob.address(street_number, street_name, city, province, postal_code)
          VALUES($1, $2, $3, $4, $5)
          RETURNING address_id
       ), "user" AS (
          INSERT INTO wob."user"(name, phone_number, email, date_of_birth, password, salt, address_id)
          VALUES($6, $7, $8, $9, $10, $11, (SELECT address_id FROM address))
          RETURNING user_id
       ), client AS (
          INSERT INTO wob.client (student_number, status, user_id)
          VALUES ($12, 'active', (SELECT user_id FROM "user"))
          RETURNING client_id
       ), bank_card AS (
          INSERT INTO wob.bank_card (client_id, expiry_date, card_number, pin, pin_salt, verification_value, verification_value_salt, status, daily_limit, card_type_id)
          VALUES ((SELECT client_id FROM client), NOW() + INTERVAL '5 years', $13, $14, $15, $16, $17, 'active', 200, (SELECT card_type_id FROM wob.card_type WHERE name = 'Debit'))
          RETURNING bank_card_id
       )
       INSERT INTO wob.account (bank_card_id, account_type_id, balance, status, branch_id)
       VALUES ((SELECT bank_card_id FROM bank_card), (SELECT account_type_id FROM wob.account_type WHERE name = 'Chequing'), 0, 'active', (SELECT branch_id FROM wob.branch LIMIT 1))
       RETURNING (SELECT address_id FROM address), (SELECT user_id FROM "user"), (SELECT client_id FROM client), (SELECT bank_card_id FROM bank_card);`,
      [
        address.street_number, address.street_name, address.city, address.province, address.postal_code,
        user.name, user.phone_number, user.email, user.date_of_birth, user.password, user.salt,
        new_client.student_number,
        new_client.card_number, new_client.pin, new_client.pin_salt, new_client.verification_value, new_client.verification_value_salt
      ]
    );
    await client.end();

    return res.rows.length === 1 ? res.rows[0] : {};
  } catch (e) {
    console.error(e);
  }
}

async function getClientById(client_id) {
  try {
    const client = dbClient.createClient();
    await client.connect();
    const res = await client.query(
      `SELECT "user".user_id  AS id, "user".name, "user".phone_number, "user".email,
              address.address_id, address.street_number, address.street_name, address.city, address.province, address.postal_code, address.country,
              client.client_id, client.student_number,
              bank_card.bank_card_id, bank_card.expiry_date, bank_card.card_number, bank_card.status AS card_status, bank_card.daily_limit,
              card_type.card_type_id, card_type.name AS card_type_name,
              acc.account_id, acc.balance, acc.status AS account_status,
              account_type.account_type_id, account_type.name AS account_type_name,
              SUM(total.balance) AS total_account_balance
       FROM wob."user"
       JOIN wob.address ON wob."user".address_id = wob.address.address_id
       JOIN wob.client ON wob."user".user_id = wob.client.user_id
       JOIN wob.bank_card ON wob.client.client_id = wob.bank_card.client_id
       JOIN wob.card_type ON wob.bank_card.card_type_id = wob.card_type.card_type_id
       JOIN wob.account acc ON wob.bank_card.bank_card_id = acc.bank_card_id
       JOIN wob.account_type ON acc.account_type_id = wob.account_type.account_type_id
       JOIN wob.account total ON wob.bank_card.bank_card_id = total.bank_card_id
       WHERE client.client_id = $1
       GROUP BY "user".user_id, "user".name, "user".phone_number, "user".email, address.address_id, address.street_number, address.street_name, address.city, address.province, address.postal_code, address.country, client.client_id, client.student_number, bank_card.bank_card_id, bank_card.expiry_date, bank_card.card_number, bank_card.status, bank_card.daily_limit, card_type.card_type_id, card_type.name, acc.account_id, acc.balance, acc.status, account_type.account_type_id, account_type.name;`,
      [client_id]
    );
    await client.end();

    return res.rows;
  } catch (e) {
    console.error(e);
  }
}

async function getAllClients() {
  try {
    const client = dbClient.createClient();
    await client.connect();
    const res = await client.query(
      `SELECT "user".user_id  AS id, "user".name, "user".phone_number, "user".email,
              address.address_id, address.street_number, address.street_name, address.city, address.province, address.postal_code, address.country,
              client.client_id, client.student_number,
              bank_card.bank_card_id, bank_card.expiry_date, bank_card.card_number, bank_card.status AS card_status, bank_card.daily_limit,
              card_type.card_type_id, card_type.name AS card_type_name,
              account.account_id, account.balance, account.status AS account_status,
              account_type.account_type_id, account_type.name AS account_type_name
       FROM wob."user"
       JOIN wob.address ON wob."user".address_id = wob.address.address_id
       JOIN wob.client ON wob."user".user_id = wob.client.user_id
       JOIN wob.bank_card ON wob.client.client_id = wob.bank_card.client_id
       JOIN wob.card_type ON wob.bank_card.card_type_id = wob.card_type.card_type_id
       JOIN wob.account ON wob.bank_card.bank_card_id = wob.account.bank_card_id
       JOIN wob.account_type ON wob.account.account_type_id = wob.account_type.account_type_id`,
      []
    );
    await client.end();

    return res.rows;
  }
  catch (e) {
    console.error(e);
  }
}

async function updateClient(id, updated_client) {
  throw new Error('Not implemented');
}

async function deleteClient(id) {
  try {
    const client = dbClient.createClient();
    await client.connect();
    const res = await client.query(
      `UPDATE wob.client
       SET status = 'inactive'
       WHERE client_id = $1
       RETURNING client_id`,
      [id]
    );
    await client.end();

    return res.rows.length === 1 ? res.rows[0] : {};
  } catch (e) {
    console.error(e);
  }
}

module.exports = {
  getClientSalt,
  login,
  createClient,
  getClientById,
  getAllClients,
  updateClient,
  deleteClient
};
