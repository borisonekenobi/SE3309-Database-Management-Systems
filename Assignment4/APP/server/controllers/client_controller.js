const db = require('../database/client_database');
const {hash} = require('./conversion_functions');

exports.login = async (req, res) => {
  const card_number = req.body.card_number;
  const salt = await db.getClientSalt(req.body.card_number);
  const password = hash(req.body.password, salt)[0];

  if (!card_number || !password) {
    res.status(400).json({message: 'Invalid input'}).end();
    return;
  }

  const result = await db.login(card_number, password);

  if (!result) {
    res.status(500).json({message: 'Internal server error'}).end();
  } else if (result.length === 0) {
    res.status(401).json({message: 'Invalid card number or password'}).end();
  } else {
    res.status(200).json({
      id: result[0].client_id,
      student_number: result[0].student_number,
      user: {
        id: result[0].id,
        name: result[0].name,
        phone_number: result[0].phone_number,
        email: result[0].email,
      },
      address: {
        id: result[0].address_id,
        street_number: result[0].street_number,
        street_name: result[0].street_name,
        city: result[0].city,
        province: result[0].province,
        postal_code: result[0].postal_code,
        country: result[0].country,
      },
      bank_card: {
        id: result[0].bank_card_id,
        type_id: result[0].card_type_id,
        type: result[0].card_type_name,
        expiry_date: result[0].expiry_date,
        number: result[0].card_number,
        status: result[0].card_status,
        daily_limit: result[0].daily_limit,
      },
      accounts: result.map(row => {
        return {
          id: row.account_id,
          type_id: row.account_type_id,
          type: row.account_type_name,
          balance: row.balance,
          status: row.account_status,
          bank_card_id: row.bank_card_id,
        };
      })
    }).end();
  }
}

exports.create = async (req, res) => {
  const client = req.body;
  const card_number = Math.floor(Math.random() * 9000000000000000 + 1000000000000000).toString();
  client.card_number = card_number;

  const hashed = hash(client.user.password);
  client.user.password = hashed[0];
  client.user.salt = hashed[1];

  const pin = '0000';
  const hashed2 = hash(pin);
  client.pin = hashed2[0];
  client.pin_salt = hashed2[1];

  const verification_value = Math.floor(Math.random() * 900 + 100).toString();
  const hashed3 = hash(verification_value);
  client.verification_value = hashed3[0];
  client.verification_value_salt = hashed3[1];

  if (!client.address.street_number || !client.address.street_name || !client.address.city || !client.address.province || !client.address.postal_code ||
    !client.user.name || !client.user.phone_number || !client.user.email || !client.user.date_of_birth || !client.user.password || !client.user.salt ||
    !client.student_number || !client.card_number || !client.pin || !client.pin_salt || !client.verification_value || !client.verification_value_salt) {
    res.status(400).json({message: 'Invalid input'}).end();
    return;
  }

  const result = await db.createClient(client);

  if (!result) {
    res.status(500).json({message: 'Internal server error'}).end();
  } else if (!result.bank_card_id) {
    res.status(400).json({message: 'Invalid input'}).end();
  } else {
    delete client.card_number;
    delete client.user.password;
    delete client.user.salt;
    delete client.pin;
    delete client.pin_salt;
    delete client.verification_value;
    delete client.verification_value_salt;

    client.id = result.client_id;
    client.address.id = result.address_id;
    client.user.id = result.user_id;
    client.bank_card = {
      id: result.bank_card_id,
      number: card_number,
      pin: pin,
      verification_value: verification_value,
    };

    res.status(201).json(client).end();
  }
}

exports.findOne = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(400).json({message: 'Invalid input'}).end();
    return;
  }

  const result = await db.getClientById(id);

  if (!result) {
    res.status(500).json({message: 'Internal server error'}).end();
  } else if (!result[0].client_id) {
    res.status(404).json({message: 'Client not found'}).end();
  } else {
    res.status(200).json({
      id: result[0].client_id,
      student_number: result[0].student_number,
      user: {
        id: result[0].id,
        name: result[0].name,
        phone_number: result[0].phone_number,
        email: result[0].email,
      },
      address: {
        id: result[0].address_id,
        street_number: result[0].street_number,
        street_name: result[0].street_name,
        city: result[0].city,
        province: result[0].province,
        postal_code: result[0].postal_code,
        country: result[0].country,
      },
      bank_cards: result.map(row => {
        return {
          id: row.bank_card_id,
          expiry_date: row.expiry_date,
          number: row.card_number,
          status: row.card_status,
          daily_limit: row.daily_limit,
          type_id: row.card_type_id,
          type: row.card_type_name,
        };
      }),
      total_account_balance: result[0].total_account_balance,
      accounts: result.map(row => {
        return {
          id: row.account_id,
          type_id: row.account_type_id,
          type: row.account_type_name,
          balance: row.balance,
          status: row.account_status,
          bank_card_id: row.bank_card_id,
        };
      })
    }).end();
  }
}

exports.findAll = async (req, res) => {
  const result = await db.getAllClients();

  if (!result) {
    res.status(500).json({message: 'Internal server error'}).end();
  } else {
    const clients = new Map();

    const bank_card_ids = new Set();
    const account_ids = new Set();

    result.forEach(row => {
      if (!clients.has(row.client_id)) {
        clients.set(row.client_id, {
          id: row.client_id,
          student_number: row.student_number,
          user: {
            id: row.id,
            name: row.name,
            phone_number: row.phone_number,
            email: row.email,
          },
          address: {
            id: row.address_id,
            street_number: row.street_number,
            street_name: row.street_name,
            city: row.city,
            province: row.province,
            postal_code: row.postal_code,
            country: row.country,
          },
          bank_cards: [],
          accounts: [],
        });
      }

      const client = clients.get(row.client_id);

      if (!bank_card_ids.has(row.bank_card_id)) {
        client.bank_cards.push({
          id: row.bank_card_id,
          expiry_date: row.expiry_date,
          number: row.card_number,
          status: row.card_status,
          daily_limit: row.daily_limit,
          type_id: row.card_type_id,
          type: row.card_type_name,
        });
        bank_card_ids.add(row.bank_card_id);
      }

      if (!account_ids.has(row.account_id)) {
        client.accounts.push({
          id: row.account_id,
          type_id: row.account_type_id,
          type: row.account_type_name,
          balance: row.balance,
          status: row.account_status,
          bank_card_id: row.bank_card_id,
        });
        account_ids.add(row.account_id);
      }
    });

    res.status(200).json(Array.from(clients.values())).end();
  }
}

exports.update = async (req, res) => {
  // TODO: Implement
  res.status(501).json({message: 'Not implemented'}).end();
}

exports.delete = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(400).json({message: 'Invalid input'}).end();
    return;
  }

  const result = await db.deleteClient(id);

  if (!result) {
    res.status(500).json({message: 'Internal server error'}).end();
  } else if (!result.client_id) {
    res.status(404).json({message: 'Client not found'}).end();
  } else {
    res.status(204).end();
  }
}
