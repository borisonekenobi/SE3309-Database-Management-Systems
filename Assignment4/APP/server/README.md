# REST API Documentation

## Table of Contents

- [Client API](#client-api)
  - [Create Client](#create-client)
  - [Login](#client-login)
  - [Find Client](#find-client)
  - [Get All Clients](#get-all-clients)
  - [Update Client](#update-client)
  - [Delete Client](#delete-client)
- [Staff API](#staff-api)
  - [Create Staff](#create-staff)
  - [Login](#staff-login)
  - [Find Staff](#find-staff)
  - [Get All Staff](#get-all-staff)
  - [Update Staff](#update-staff)
  - [Delete Staff](#delete-staff)

## Client API

### Create Client

`POST /api/client`

Creates a new client with the given address, user, and student number. The response will include the client's ID,
student number, user ID, name, phone number, email, date of birth, address ID, street number, street name, city,
province, postal code, country, and bank card ID, number, pin, and verification value. The bank card will have a default
daily limit of $200.00.

#### Request

```json
{
  "address": {
    "street_number": "2392",
    "street_name": "Cornerbrooke Crescent",
    "city": "Oakville",
    "province": "Ontario",
    "postal_code": "L6M4B5",
    "country": "Canada"
  },
  "user": {
    "name": "Boris Vasilev",
    "phone_number": "+1 (647) 890-2718",
    "email": "borisonekenobi@gmail.com",
    "date_of_birth": "2004-06-05",
    "password": "test123"
  },
  "student_number": "251276924"
}
```

#### Response

```json
{
  "id": "367f9e6f-f0d2-45c1-9766-8ec7277157dd",
  "student_number": "251276924",
  "user": {
    "name": "Boris Vasilev",
    "phone_number": "+1 (647) 890-2718",
    "email": "borisonekenobi@gmail.com",
    "date_of_birth": "2004-06-05",
    "id": "fc5ce876-0194-447d-a793-e8069a49d2a4"
  },
  "address": {
    "street_number": "2392",
    "street_name": "Cornerbrooke Crescent",
    "city": "Oakville",
    "province": "Ontario",
    "postal_code": "L6M4B5",
    "country": "Canada",
    "id": "fbec2d7c-bc84-4d26-9062-e6038761ec61"
  },
  "bank_card": {
    "id": "77b64868-055f-4d37-a606-edfd2e1ade28",
    "number": "9953810146034784",
    "pin": "0000",
    "verification_value": "133"
  }
}
```

### Client Login

`POST /api/client-login`

Logs in the client with the given card number and password. The response will include the client's ID, student number,
user ID, name, phone number, email, address ID, street number, street name, city, province, postal code, country, bank
card ID, bank card type ID, bank card type, bank card expiry date, bank card number, bank card status, bank card daily
limit, and account ID, account type ID, account type, account balance, account status, and account bank card ID.

#### Request

```json
{
  "card_number": "3378776579328348",
  "password": "test123"
}
```

#### Response

```json
{
  "id": "367f9e6f-f0d2-45c1-9766-8ec7277157dd",
  "student_number": 251276924,
  "user": {
    "id": "fc5ce876-0194-447d-a793-e8069a49d2a4",
    "name": "Boris Vasilev",
    "phone_number": "+1 (647) 890-2718",
    "email": "borisonekenobi@gmail.com"
  },
  "address": {
    "id": "fbec2d7c-bc84-4d26-9062-e6038761ec61",
    "street_number": 2392,
    "street_name": "Cornerbrooke Crescent",
    "city": "Oakville",
    "province": "Ontario",
    "postal_code": "L6M4B5",
    "country": "Canada"
  },
  "bank_card": {
    "id": "77b64868-055f-4d37-a606-edfd2e1ade28",
    "type_id": "0d8dbd75-2ec9-400c-99ae-5e0ca9759701",
    "type": "Debit",
    "expiry_date": "2029-11-29T05:00:00.000Z",
    "number": "9953810146034784",
    "status": "active",
    "daily_limit": "$200.00"
  },
  "accounts": [
    {
      "id": "cc089bf3-f63d-4121-8f7f-cdfde67ecfe4",
      "type_id": "03acb47d-94ef-41bb-9533-7606b2b81bdb",
      "type": "Chequing",
      "balance": "$0.00",
      "status": "active",
      "bank_card_id": "77b64868-055f-4d37-a606-edfd2e1ade28"
    }
  ]
}
```

### Find Client

`GET /api/client/:id`

Gets the client with the given ID. The response will include the client's ID, name, phone number, email, client ID,
student number, bank cards, and accounts.

#### Response

```json
{
  "id": "367f9e6f-f0d2-45c1-9766-8ec7277157dd",
  "student_number": 251276924,
  "user": {
    "id": "fc5ce876-0194-447d-a793-e8069a49d2a4",
    "name": "Boris Vasilev",
    "phone_number": "+1 (647) 890-2718",
    "email": "borisonekenobi@gmail.com"
  },
  "address": {
    "id": "fbec2d7c-bc84-4d26-9062-e6038761ec61",
    "street_number": 2392,
    "street_name": "Cornerbrooke Crescent",
    "city": "Oakville",
    "province": "Ontario",
    "postal_code": "L6M4B5",
    "country": "Canada"
  },
  "bank_cards": [
    {
      "id": "77b64868-055f-4d37-a606-edfd2e1ade28",
      "expiry_date": "2029-11-29T05:00:00.000Z",
      "number": "9953810146034784",
      "status": "active",
      "daily_limit": "$200.00",
      "type_id": "0d8dbd75-2ec9-400c-99ae-5e0ca9759701",
      "type": "Debit"
    }
  ],
  "total_account_balance": "$0.00",
  "accounts": [
    {
      "id": "cc089bf3-f63d-4121-8f7f-cdfde67ecfe4",
      "type_id": "03acb47d-94ef-41bb-9533-7606b2b81bdb",
      "type": "Chequing",
      "balance": "$0.00",
      "status": "active",
      "bank_card_id": "77b64868-055f-4d37-a606-edfd2e1ade28"
    }
  ]
}
```

### Get All Clients

`GET /api/clients`

Gets all clients. The response will include the clients' ID, name, phone number, email, client ID, student number, bank
cards, and accounts.

#### Response

```json
[
  {
    "id": "367f9e6f-f0d2-45c1-9766-8ec7277157dd",
    "student_number": 251276924,
    "user": {
      "id": "fc5ce876-0194-447d-a793-e8069a49d2a4",
      "name": "Boris Vasilev",
      "phone_number": "+1 (647) 890-2718",
      "email": "borisonekenobi@gmail.com"
    },
    "address": {
      "id": "fbec2d7c-bc84-4d26-9062-e6038761ec61",
      "street_number": 2392,
      "street_name": "Cornerbrooke Crescent",
      "city": "Oakville",
      "province": "Ontario",
      "postal_code": "L6M4B5",
      "country": "Canada"
    },
    "bank_cards": [
      {
        "id": "77b64868-055f-4d37-a606-edfd2e1ade28",
        "expiry_date": "2029-11-29T05:00:00.000Z",
        "number": "9953810146034784",
        "status": "active",
        "daily_limit": "$200.00",
        "type_id": "0d8dbd75-2ec9-400c-99ae-5e0ca9759701",
        "type": "Debit"
      }
    ],
    "accounts": [
      {
        "id": "cc089bf3-f63d-4121-8f7f-cdfde67ecfe4",
        "type_id": "03acb47d-94ef-41bb-9533-7606b2b81bdb",
        "type": "Chequing",
        "balance": "$0.00",
        "status": "active",
        "bank_card_id": "77b64868-055f-4d37-a606-edfd2e1ade28"
      }
    ]
  }
]
```

### Update Client

`PUT /api/client/:id`

This hasn't been implemented yet. The response will be a 501 Not Implemented status code.

#### Response

<span style="color:red">501</span> Not Implemented

### Delete Client

`DELETE /api/client/:id`

Marks the client with the given ID as `inactive` preventing them from logging in. The response will be a 204 No Content
status code.

#### Response

<span style="color:green">204</span> No Content

## Staff API

### Create Staff

`POST /api/staff`

Creates a new staff member with the given staff role, branch, user, and address. The response will include the staff
member's ID, staff role ID, branch ID, user ID, name, phone number, email, date of birth, address ID, street number,
street name, city, province, and postal code.

#### Request

```json
{
  "staff_role_id": "cae1f4b3-42e7-44c8-bcc1-8c0ad1bb8a71",
  "branch_id": "7b443372-a30a-4ae1-a401-727c075b3d15",
  "user": {
    "name": "Rebecca Hellberg Nilsson",
    "phone_number": "+1 (416) 522-7436",
    "email": "rebeccahnilsson@gmail.com",
    "date_of_birth": "2005-08-03",
    "password": "2468"
  },
  "address": {
    "street_number": "1118",
    "street_name": "Beechnut Road",
    "city": "Oakville",
    "province": "Ontario",
    "postal_code": "L6M1W8"
  }
}
```

#### Response

```json
{
  "id": "6779751b-1c2e-47e8-ad94-615310195dd0",
  "staff_role_id": "cae1f4b3-42e7-44c8-bcc1-8c0ad1bb8a71",
  "branch_id": "7b443372-a30a-4ae1-a401-727c075b3d15",
  "user": {
    "id": "7b4d0275-55af-430e-b73e-cd723c3ef35e",
    "name": "Rebecca Hellberg Nilsson",
    "phone_number": "+1 (416) 522-7436",
    "email": "rebeccahnilsson@gmail.com",
    "date_of_birth": "2005-08-03"
  },
  "address": {
    "id": "1f02eb56-afb6-4f78-97c5-3c3ce4b676aa",
    "street_number": "1118",
    "street_name": "Beechnut Road",
    "city": "Oakville",
    "province": "Ontario",
    "postal_code": "L6M1W8"
  }
}
```

### Staff Login

`POST /api/staff-login`

Logs in the staff member with the given email and password. The response will include the staff member's ID, name, phone
number, email, employee ID, and address. The response will also include the staff member's role.

#### Request

```json
{
  "email": "rebeccahnilsson@gmail.com",
  "password": "2468"
}
```

#### Response

```json
{
  "id": "6779751b-1c2e-47e8-ad94-615310195dd0",
  "branch_id": "7b443372-a30a-4ae1-a401-727c075b3d15",
  "role": "Loan Officer",
  "user": {
    "id": "7b4d0275-55af-430e-b73e-cd723c3ef35e",
    "name": "Rebecca Hellberg Nilsson",
    "phone_number": "+1 (416) 522-7436",
    "email": "rebeccahnilsson@gmail.com"
  },
  "address": {
    "id": "1f02eb56-afb6-4f78-97c5-3c3ce4b676aa",
    "street_number": 1118,
    "street_name": "Beechnut Road",
    "city": "Oakville",
    "province": "Ontario",
    "postal_code": "L6M1W8",
    "country": "Canada"
  }
}
```

### Find Staff

`GET /api/staff/:id`

Gets the staff member with the given ID. The response will include the staff member's ID, staff role ID, branch ID, user
ID, name, phone number, email, date of birth, address ID, street number, street name, city, province, postal code and
country.

#### Response

```json
{
  "id": "6779751b-1c2e-47e8-ad94-615310195dd0",
  "branch_id": "7b443372-a30a-4ae1-a401-727c075b3d15",
  "staff_role_id": "cae1f4b3-42e7-44c8-bcc1-8c0ad1bb8a71",
  "user": {
    "name": "Rebecca Hellberg Nilsson",
    "phone_number": "+1 (416) 522-7436",
    "email": "rebeccahnilsson@gmail.com"
  },
  "address": {
    "id": "1f02eb56-afb6-4f78-97c5-3c3ce4b676aa",
    "street_number": 1118,
    "street_name": "Beechnut Road",
    "city": "Oakville",
    "province": "Ontario",
    "postal_code": "L6M1W8",
    "country": "Canada"
  }
}
```

### Get All Staff

`GET /api/staff`

Gets all staff members. The response will include the staff members' ID, staff role ID, branch ID, user ID, name, phone
number, email, date of birth, address ID, street number, street name, city, province, postal code, and country.

#### Response

```json
[
  {
    "id": "6779751b-1c2e-47e8-ad94-615310195dd0",
    "branch_id": "7b443372-a30a-4ae1-a401-727c075b3d15",
    "staff_role_id": "cae1f4b3-42e7-44c8-bcc1-8c0ad1bb8a71",
    "user": {
      "id": "7b4d0275-55af-430e-b73e-cd723c3ef35e",
      "name": "Rebecca Hellberg Nilsson",
      "phone_number": "+1 (416) 522-7436",
      "email": "rebeccahnilsson@gmail.com"
    },
    "address": {
      "id": "1f02eb56-afb6-4f78-97c5-3c3ce4b676aa",
      "street_number": 1118,
      "street_name": "Beechnut Road",
      "city": "Oakville",
      "province": "Ontario",
      "postal_code": "L6M1W8",
      "country": "Canada"
    }
  }
]
```

### Update Staff

`PUT /api/staff/:id`

This hasn't been implemented yet. The response will be a 501 Not Implemented status code.

#### Response

<span style="color:red">501</span> Not Implemented

### Delete Staff

`DELETE /api/staff/:id`

Marks the staff member with the given ID as `inactive` preventing them from logging in. The response will be a 204 No
Content status code.

#### Response

<span style="color:green">204</span> No Content

## Transactions API

### Transfer Funds

`POST /api/transfer`

Transfers funds from one account to another account.

#### Request

```json
{
  "source_account_id": "cc089bf3-f63d-4121-8f7f-cdfde67ecfe4",
  "destination_account_id": "cc089bf3-f63d-4121-8f7f-cdfde67ecfe4",
  "amount": 12.00
}
```

#### Response

<span style="color:green">200</span> Transfer Successful

## Loan API

### Create Loan Application

#### Request

```json
{
  "type": "personal",
  "amount": 1000.00,
  "term": 12,
  "reason": "I need to pay for my tuition."
}
```

#### Response

<span style="color:green">200</span> Loan application submitted successfully!

### Get Transactions

`GET /api/transactions`

Gets all transactions for the client with the given ID. The response will include the transaction ID, amount, date and
time, status, account ID, and merchant name. The transactions are sorted by date and time in descending order.

#### Response

```json
[
  {
    "transaction_id": "99bd58b1-9afd-474f-b628-46d19d70620c",
    "amount": "$16.00",
    "datetime": "2024-12-03T15:56:43.650Z",
    "status": "paid",
    "account_id": "c9a1d1d2-8e2b-46b5-8ed3-e9e2f1bbc9f2",
    "merchant_name": "yes"
  },
  {
    "transaction_id": "75488f79-c78f-42b6-9a17-46a86449b682",
    "amount": "$14.00",
    "datetime": "2024-12-03T15:56:43.650Z",
    "status": "paid",
    "account_id": "c9a1d1d2-8e2b-46b5-8ed3-e9e2f1bbc9f2",
    "merchant_name": "Amazon"
  },
  {
    "transaction_id": "62cad73b-e8ba-46bc-8104-8d87ac1b9fc5",
    "amount": "$14.00",
    "datetime": "2024-12-03T15:56:43.650Z",
    "status": "paid",
    "account_id": "c9a1d1d2-8e2b-46b5-8ed3-e9e2f1bbc9f2",
    "merchant_name": "Google"
  },
  {
    "transaction_id": "6f8c0bd5-a84c-4fb0-b631-2d0c7b9982ab",
    "amount": "$13.00",
    "datetime": "2024-12-03T15:56:43.650Z",
    "status": "paid",
    "account_id": "c9a1d1d2-8e2b-46b5-8ed3-e9e2f1bbc9f2",
    "merchant_name": "xyz"
  },
  {
    "transaction_id": "2e979fe5-0faf-46b2-b9f8-478828d65cd0",
    "amount": "$12.00",
    "datetime": "2024-12-03T15:56:43.650Z",
    "status": "paid",
    "account_id": "c9a1d1d2-8e2b-46b5-8ed3-e9e2f1bbc9f2",
    "merchant_name": "abc"
  }
]
```

## Statement API

### Get Statement

`GET /api/statement/`

Gets all statements for the client with the given ID. The response will include the statement ID, account ID, closing
balance, end date, account type ID, bank card ID, balance, branch ID, and status.

#### Response

```json
[
  {
    "statement_id": "29cfad63-d59f-49d1-adf8-e2906d8e96db",
    "account_id": "7463c19c-26e2-4daf-b865-23a891ed9f6e",
    "closing_balance": "$120,000.00",
    "end_date": "2024-11-30T05:00:00.000Z",
    "account_type_id": "f5ce233a-1f2e-411d-bd7c-908fee05c069",
    "bank_card_id": "ef444963-eb01-4812-ad82-c3a3b8347138",
    "balance": "$36.00",
    "branch_id": "588c4958-691f-4123-b98b-c130b9d72287",
    "status": "active"
  },
  {
    "statement_id": "7f2e777d-0d0d-4fb8-a370-d33dce997198",
    "account_id": "7463c19c-26e2-4daf-b865-23a891ed9f6e",
    "closing_balance": "$10,000.00",
    "end_date": "2024-12-31T05:00:00.000Z",
    "account_type_id": "f5ce233a-1f2e-411d-bd7c-908fee05c069",
    "bank_card_id": "ef444963-eb01-4812-ad82-c3a3b8347138",
    "balance": "$36.00",
    "branch_id": "588c4958-691f-4123-b98b-c130b9d72287",
    "status": "active"
  },
  {
    "statement_id": "4d388d6c-cab3-41d1-86df-7441fa909dbf",
    "account_id": "c9a1d1d2-8e2b-46b5-8ed3-e9e2f1bbc9f2",
    "closing_balance": "$1,234.00",
    "end_date": "2024-11-30T05:00:00.000Z",
    "account_type_id": "21dbdde7-71aa-49e3-9b7f-a37c603dd962",
    "bank_card_id": "ef444963-eb01-4812-ad82-c3a3b8347138",
    "balance": "$12.00",
    "branch_id": "588c4958-691f-4123-b98b-c130b9d72287",
    "status": "active"
  },
  {
    "statement_id": "7f6e0f01-fb04-48ba-af58-febf992748f2",
    "account_id": "c9a1d1d2-8e2b-46b5-8ed3-e9e2f1bbc9f2",
    "closing_balance": "$12,000.00",
    "end_date": "2024-12-31T05:00:00.000Z",
    "account_type_id": "21dbdde7-71aa-49e3-9b7f-a37c603dd962",
    "bank_card_id": "ef444963-eb01-4812-ad82-c3a3b8347138",
    "balance": "$12.00",
    "branch_id": "588c4958-691f-4123-b98b-c130b9d72287",
    "status": "active"
  }
]
```