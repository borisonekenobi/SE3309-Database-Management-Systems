const {createClient} = require('./database_client');

async function getStaffSalt(email) {
  try {
    const client = createClient();
    await client.connect();
    const res = await client.query(
      `SELECT salt
       FROM wob."user"
       WHERE email = $1`,
      [email]
    );
    await client.end();

    return res.rows.length === 1 ? res.rows[0].salt : '';
  } catch (e) {
    console.error(e);
  }
}

async function login(email, password) {
  try {
    const client = createClient();
    await client.connect();
    const res = await client.query(
      `SELECT "user".user_id  AS id, "user".name, "user".phone_number, "user".email,
              address.address_id, address.street_number, address.street_name, address.city, address.province, address.postal_code, address.country,
              staff.staff_id, staff.branch_id,
              staff_role.staff_role_id, staff_role.name AS role
       FROM wob."user"
       JOIN wob.address ON wob."user".address_id = wob.address.address_id
       JOIN wob.staff ON wob."user".user_id = wob.staff.user_id
       JOIN wob.staff_role ON wob.staff.staff_role_id = wob.staff_role.staff_role_id
       WHERE email = $1
         AND password = $2
         AND status = 'active'`,
        [email, password]
    );
    await client.end();

    return res.rows.length === 1 ? res.rows[0] : {};
  } catch (e) {
    console.error(e);
  }
}

async function createStaffMember(staff) {
  try {
    const address = staff.address;
    const user = staff.user;

    const client = createClient();
    await client.connect();
    const res = await client.query(
        `WITH address AS (
           INSERT INTO wob.address (street_number, street_name, city, province, postal_code)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING address_id
         ), "user" AS (
           INSERT INTO wob."user" (name, phone_number, email, date_of_birth, address_id, password, salt)
           VALUES ($6, $7, $8, $9, (SELECT address_id FROM address), $10, $11)
           RETURNING user_id
         )
         INSERT INTO wob.staff (staff_role_id, status, branch_id, user_id)
         VALUES ($12, 'active', $13, (SELECT user_id FROM "user"))
         RETURNING (SELECT address_id FROM address), (SELECT user_id FROM "user"), staff_id`,
        [
          address.street_number, address.street_name, address.city, address.province, address.postal_code,
          user.name, user.phone_number, user.email, user.date_of_birth, user.password, user.salt,
          staff.staff_role_id, staff.branch_id
        ]
    );
    await client.end();

    return res.rows.length === 1 ? res.rows[0] : {};
  } catch (e) {
    console.error(e);
  }
}

async function getStaffMemberById(id) {
  try {
    const client = createClient();
    await client.connect();
    const res = await client.query(
        `SELECT staff.staff_id, staff.branch_id, staff.staff_role_id,
                "user".user_id, "user".name, "user".phone_number, "user".email, "user".date_of_birth,
                address.address_id, address.street_number, address.street_name, address.city, address.province, address.postal_code, address.country
         FROM wob.staff
         JOIN wob."user" ON wob.staff.user_id = wob."user".user_id
         JOIN wob.address ON wob."user".address_id = wob.address.address_id
         WHERE staff_id = $1`,
        [id]
    );
    await client.end();

    return res.rows.length === 1 ? res.rows[0] : {};
  } catch (e) {
    console.error(e);
  }
}

async function getAllStaffMembers() {
  try {
    const client = createClient();
    await client.connect();
    const res = await client.query(
        `SELECT staff.staff_id, staff.branch_id, staff.staff_role_id,
                "user".user_id, "user".name, "user".phone_number, "user".email, "user".date_of_birth,
                address.address_id, address.street_number, address.street_name, address.city, address.province, address.postal_code, address.country
         FROM wob.staff
         JOIN wob."user" ON wob.staff.user_id = wob."user".user_id
         JOIN wob.address ON wob."user".address_id = wob.address.address_id`
    );
    await client.end();

    return res.rows;
  } catch (e) {
    console.error(e);
  }
}

async function updateStaffMember(id, staff) {
  throw new Error('Not implemented');
}

async function deleteStaffMember(id) {
  try {
    const client = createClient();
    await client.connect();
    const res = await client.query(
        `UPDATE wob.staff
         SET status = 'inactive'
         WHERE staff_id = $1
         RETURNING staff_id`,
        [id]
    );
    await client.end();

    return res.rows.length === 1 ? res.rows[0] : {};
  } catch (e) {
    console.error(e);
  }
}

module.exports = {
  getStaffSalt,
  login,
  createStaffMember,
  getStaffMemberById,
  getAllStaffMembers,
  updateStaffMember,
  deleteStaffMember
};
