const random = require('random-name');
const {createHash} = require('crypto');
const {createClient} = require("./database_client");

// Global variables
const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let addressIds = [];
let branchIds = [];
let users = [];
let clientIds = [];
let staffRoleIds = [];
let singleStaffRoleIds = [];
let staffIds = [];
let accountTypeIds = [];
let accounts = [];
let chequingAccounts = [];
let transactions = [];
let cardTypeIds = [];
let bankCards = [];
let loans = [];

// Helper functions
async function truncateAllTables() {
    const client = await createClient();
    await client.connect();
    await client.query(
        `SELECT wob.truncate_tables($1, $2);`,
        [process.env.DB_USER, process.env.DB_SCHEMA]
    );
    await client.end();
}

function getRandomName() {
    const hasMiddleName = Math.random() > 0.5;
    return random.first() + (hasMiddleName ? " " + random.middle() : "") + " " + random.last();
}

async function getRandomAddresses(count) {
    const res = await fetch(`https://randommer.io/random-address?number=${count}&culture=en_CA&X-Requested-With=XMLHttpRequest`, {
        method: 'POST'
    });
    return await res.json();
}

async function hash(string) {
    const salt = process.env.SALT;
    return createHash('sha256').update(salt + string).digest('hex');
}

function addressToObj(address) {
    const split = address.split(', ');
    return {
        street_number: split[0].split(' ')[0].trim(),
        street_name: split[0].split(' ').slice(1).join(' ').trim(),
        postal_code: split[2].split(' ').join('').trim(),
        city: split[3].trim(),
        province: split[4].trim(),
        country: split[5].trim()
    };
}

function compoundInterest(principal, rate, time, timesPerPeriod = 12) {
    return principal * Math.pow(1 + rate / timesPerPeriod, timesPerPeriod * time);
}

function generateMerchantName() {
    let name = "";
    for (let i = 0; i < 5; i++) {
        name += characters[Math.floor(Math.random() * characters.length)];
    }
    return name;
}

// Function to create dummy address data
async function createAddresses(countInThousands) {
    let addressObjs = []; // Initialize an empty array to store address objects
    for (let i = 0; i < countInThousands; i++) { // Loop to create addresses in batches of 1000
        const addresses = await getRandomAddresses(1000); // Fetch 1000 random addresses
        addresses.forEach(address => addressObjs.push(addressToObj(address))); // Convert each address to an object and add to the array
    }

    const client = await createClient(); // Create a new database client
    await client.connect(); // Connect to the database
    const res = await client.query( // Insert the address objects into the database
        `INSERT INTO wob.address(street_number, street_name, postal_code, city, province, country)
         SELECT street_number, street_name, postal_code, city, province, country
         FROM jsonb_to_recordset($1::jsonb)
                  AS t (
                        street_number integer
                 , street_name text
                 , postal_code character(6)
                 , city text, province text
                 , country text
                 )
         RETURNING address_id;`,
        [JSON.stringify(addressObjs)] // Convert the array of address objects to a JSON string
    );
    await client.end(); // Close the database connection

    addressIds = res.rows.map(row => row.address_id); // Store the returned address IDs in the global array
}

// Function to create dummy branch data
// Function to create dummy branch data
async function createBranches(count) {
    for (let i = 0; i < count; i++) {
        const address = (await getRandomAddresses(1))[0];
        const addressObj = addressToObj(address);
        const client = await createClient();
        await client.connect();
        let res = await client.query(
            `INSERT INTO wob.address(street_number, street_name, postal_code, city, province, country)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING address_id;`,
            [addressObj.street_number, addressObj.street_name, addressObj.postal_code, addressObj.city, addressObj.province, addressObj.country]
        );
        const addressId = res.rows[0].address_id;

        res = await client.query(
            `INSERT INTO wob.branch(address_id)
             VALUES ($1)
             RETURNING branch_id;`,
            [addressId]
        );
        await client.end();

        branchIds.push(res.rows[0].branch_id);
    }
}

// Function to create dummy staff role data
// Function to create dummy staff role data
async function createStaffRoles() {
    const roles = [
        {name: "Bank Teller", base_salary: 35_000},
        {name: "Customer Service Representative", base_salary: 40_000},
        {name: "Personal Banker", base_salary: 50_000},
        {name: "Loan Officer", base_salary: 60_000},
        {name: "Branch Manager", base_salary: 80_000},
        {name: "Financial Analyst", base_salary: 70_000},
        {name: "Investment Banker", base_salary: 100_000},
        {name: "Risk Analyst", base_salary: 75_000},
        {name: "Compliance Officer", base_salary: 70_000},
        {name: "IT Specialist", base_salary: 80_000}
    ]
    const singleStaffRoles = [
        {name: "Vice President (VP) of Operations", base_salary: 120_000},
        {name: "Chief Financial Officer (CFO)", base_salary: 200_000},
        {name: "Chief Technology Officer (CTO)", base_salary: 200_000},
        {name: "Chief Executive Officer (CEO)", base_salary: 300_000}
    ]
    const allRoles = roles.concat(singleStaffRoles);

    const client = await createClient();
    await client.connect();
    const res = await client.query(
        `INSERT INTO wob.staff_role(name, base_salary)
         SELECT name, base_salary
         FROM jsonb_to_recordset($1::jsonb)
             AS t (
                name text
                , base_salary integer
             )
         RETURNING staff_role_id;`,
        [JSON.stringify(allRoles)]
    );
    await client.end();

    const allStaffRoleIds = res.rows.map(row => row.staff_role_id);
    staffRoleIds = allStaffRoleIds.slice(0, -4);
    singleStaffRoleIds = allStaffRoleIds.slice(-4);
}

// Function to create dummy user data
// Function to create dummy user data
async function createUsers() {
    const hashedPassword = await hash("password");
    addressIds.forEach(addressId => {
        const name = getRandomName();
        const user = {
            name: name,
            phone_number: `+1 (${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
            email: (name.split(' ').join('.') + "@gmail.com").toLowerCase(),
            date_of_birth: new Date(1959 + Math.floor(Math.random() * 56), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
            password: hashedPassword,
            address_id: addressId,
            type: Math.random() >= 0.987654320 ? "staff" : "client"
        }
        users.push(user);
    });

    let client = await createClient();
    await client.connect();
    let res = await client.query(
        `INSERT INTO wob.user(name, phone_number, email, date_of_birth, password, address_id)
         SELECT name, phone_number, email, date_of_birth, password, address_id
         FROM jsonb_to_recordset($1::jsonb)
             AS t (
                name text
                , phone_number text
                , email text
                , date_of_birth date
                , password text
                , address_id uuid
             )
         RETURNING user_id;`,
        [JSON.stringify(users)]
    );
    await client.end();
    const userIds = res.rows.map(row => row.user_id);
    users.forEach(function (user, i) {
        user.user_id = userIds[i];
    });

    const clients = users.filter(user => user.type === "client");
    clients.forEach(client => {
        client.student_number = 251_000_000 + Math.floor(Math.random() * 1_000_000);
        client.status = Math.random() >= 0.25 ? "active" : "inactive";
        client.student_number = 251_000_000 + Math.floor(Math.random() * 1_000_000);
        client.status = Math.random() >= 0.25 ? "active" : "inactive";
    })

    client = await createClient();
    await client.connect();
    res = await client.query(
        `INSERT INTO wob.client(student_number, status, user_id)
         SELECT student_number, status, user_id
         FROM jsonb_to_recordset($1::jsonb)
             AS t (
                student_number integer
                , status text
                , user_id uuid
             )
         RETURNING client_id;`,
        [JSON.stringify(clients)]
    );
    await client.end();
    clientIds = res.rows.map(row => row.client_id);

    const staff = users.filter(user => user.type === "staff");
    staff.forEach(staffMember => {
        staffMember.staff_role_id = staffRoleIds[Math.floor(Math.random() * staffRoleIds.length)];
        staffMember.status = Math.random() >= 0.3 ? "active" : "inactive";
        staffMember.branch_id = branchIds[Math.floor(Math.random() * branchIds.length)];
    });
    staff[0].staff_role_id = singleStaffRoleIds[0];
    staff[1].staff_role_id = singleStaffRoleIds[1];
    staff[2].staff_role_id = singleStaffRoleIds[2];
    staff[3].staff_role_id = singleStaffRoleIds[3];

    client = await createClient();
    await client.connect();
    res = await client.query(
        `INSERT INTO wob.staff(staff_role_id, status, user_id, branch_id)
         SELECT staff_role_id, status, user_id, branch_id
         FROM jsonb_to_recordset($1::jsonb)
             AS t (
                staff_role_id uuid
                , status text
                , user_id uuid
                , branch_id uuid
             )
         RETURNING staff_id;`,
        [JSON.stringify(staff)]
    );
    await client.end();
    staffIds = res.rows.map(row => row.staff_id);
}

// Function to create dummy account type and account data
// Function to create dummy account type and account data
async function createAccountTypes() {
    const accountTypes = [
        {name: "Chequing", interest_rate: 0.0065, interest_type: "simple"},
        {name: "Savings", interest_rate: 0.0350, interest_type: "simple"},
        {name: "TFSA", interest_rate: 0.0275, interest_type: "compound"},
        {name: "RRSP", interest_rate: 0.0150, interest_type: "compound"},
        {name: "GIC", interest_rate: 0.0365, interest_type: "compound"}
    ];

    const client = await createClient();
    await client.connect();
    for (const accountType of accountTypes) {
        let res = await client.query(
            `INSERT INTO wob.interest(interest_rate, interest_type)
             VALUES ($1, $2)
             RETURNING interest_id;`,
            [accountType.interest_rate, accountType.interest_type]
        );
        const interestId = res.rows[0].interest_id;

        res = await client.query(
            `INSERT INTO wob.account_type(name, interest_id)
             VALUES ($1, $2)
             RETURNING account_type_id;`,
            [accountType.name, interestId]
        );
        accountTypeIds.push(res.rows[0].account_type_id);
    }
    await client.end();
}

// Function to create dummy account data
async function createAccounts() {
    users.filter(user => user.type === "client").forEach((client, i) => {
        const clientAccounts = {
            chequing: Math.floor(Math.random() * 2) + 1,
            savings: Math.floor(Math.random() * 4),
            tfsa: Math.random() >= 0.5 ? 1 : 0,
            rrsp: Math.random() >= 0.5 ? 1 : 0,
            gic: Math.random() >= 0.5 ? 1 : 0
        };

        const today = new Date();
        today.setFullYear(today.getFullYear() - 10);
        const diffTime = Math.abs(today - client.date_of_birth);
        const years = diffTime / (1000 * 60 * 60 * 24 * 30 * 12);
        for (const [accountType, count] of Object.entries(clientAccounts)) {
            for (let j = 0; j < count; j++) {
                let accountTypeId;
                let balance;
                if (accountType === "chequing") {accountTypeId = accountTypeIds[0]; balance = Math.random() * 10_000;}
                else if (accountType === "savings") {accountTypeId = accountTypeIds[1]; balance = Math.random() * 100_000;}
                else if (accountType === "tfsa") {accountTypeId = accountTypeIds[2]; balance = compoundInterest(Math.random() * 50_000, .0725, years);}
                else if (accountType === "rrsp") {accountTypeId = accountTypeIds[3]; balance = compoundInterest(Math.random() * 10_000, .0800, years);}
                else if (accountType === "gic") {accountTypeId = accountTypeIds[4]; balance = compoundInterest(Math.random() * 100_000, .0150, years);}

                const account = {
                    id: null,
                    type: accountType,
                    type_id: accountTypeId,
                    client_id: clientIds[i],
                    balance: balance,
                    status: "active",
                    branch_id: branchIds[Math.floor(Math.random() * branchIds.length)]
                }
                accounts.push(account);
                if (accountType === "chequing") chequingAccounts.push(account);
            }
        }
    });

    const client = await createClient();
    await client.connect();
    const res = await client.query(
        `INSERT INTO wob.account(account_type_id, client_id, balance, status, branch_id)
         SELECT type_id, client_id, balance, status, branch_id
         FROM jsonb_to_recordset($1::jsonb)
             AS t (
                type_id uuid
                , client_id uuid
                , balance money
                , status text
                , branch_id uuid
             )
         RETURNING account_id;`,
        [JSON.stringify(accounts)]
    );
    await client.end();

    const accountIds = res.rows.map(row => row.account_id);
    accounts.forEach(function (account, i) {
        account.id = accountIds[i];
    });
}

// Function to create dummy transaction data
async function createTransactions() {
    const statuses = [
        "pending",
        "cancelled",
        "declined",
        "submitted",
        "paid",
        "failed"
    ];
    chequingAccounts.forEach(account => {
        const numTransactions = Math.floor(Math.random() * 100) + 1;
        const tempArr = [];
        for (let i = 0; i < numTransactions; i++) {
            const transaction = {
                id: null,
                amount: Math.random() * 1_000 + 1,
                datetime: new Date(Math.floor(Math.random() * 50) + 1975, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28), Math.floor(Math.random() * 24), Math.floor(Math.random() * 60), Math.floor(Math.random() * 60)),
                status: statuses[Math.floor(Math.random() * statuses.length)],
                account_id: account.id,
                merchant_name: generateMerchantName()
            };
            tempArr.push(transaction);
        }

        transactions.push(...tempArr);
    });

    // Need to split the transactions into chunks of 1,000,000
    // due to database limitations for string length
    const transactionsSplit = [];
    for (let i = 0; i < transactions.length; i += 1_000_000) {
        transactionsSplit.push(transactions.slice(i, i + 1_000_000));
    }

    const client = await createClient();
    await client.connect();
    for (const transactions of transactionsSplit) {
        const res = await client.query(
            `INSERT INTO wob.transaction(amount, datetime, status, account_id, merchant_name)
             SELECT amount, datetime, status, account_id, merchant_name
             FROM jsonb_to_recordset($1::jsonb)
                 AS t (
                    amount money
                    , datetime timestamp
                    , status text
                    , account_id uuid
                    , merchant_name text
                 )
             RETURNING transaction_id;`,
            [JSON.stringify(transactions)]
        );

        const transactionIds = res.rows.map(row => row.transaction_id);
        transactions.forEach(function (transaction, i) {
            transaction.id = transactionIds[i];
        });
    }
    await client.end();
}

// Function to create dummy card type and card data
async function createCardTypes() {
    const cardTypes = [
        {name: "Debit", interest_rate: 0.0, interest_type: "simple"},
        {name: "Credit", interest_rate: 0.1999, interest_type: "simple"}
    ];

    const client = await createClient();
    await client.connect();
    for (const cardType of cardTypes) {
        let res = await client.query(
            `INSERT INTO wob.interest(interest_rate, interest_type)
             VALUES ($1, $2)
             RETURNING interest_id;`,
            [cardType.interest_rate, cardType.interest_type]
        );
        const interestId = res.rows[0].interest_id;

        res = await client.query(
            `INSERT INTO wob.card_type(name, interest_id)
             VALUES ($1, $2)
             RETURNING card_type_id;`,
            [cardType.name, interestId]
        );
        cardTypeIds.push(res.rows[0].card_type_id);
    }
    await client.end();
}

// Function to create dummy card data
// Function to create dummy card data
async function createCards() {
    const accountsMap = new Map();
    for (const account of chequingAccounts) {
        if (!accountsMap.has(account.client_id))
            accountsMap.set(account.client_id, []);
        accountsMap.get(account.client_id).push(account);
    }

    for (const clientId of clientIds) {
        const clientAccounts = accountsMap.get(clientId);
        if (!clientAccounts) continue;
        if (clientAccounts.length > 0) {
            const firstAccount = clientAccounts[0];

            const card = {
                type: "Debit",
                type_id: cardTypeIds[0],
                expiry_date: new Date(Math.floor(Math.random() * 10) + 2030, Math.floor(Math.random() * 12), 1),
                card_number: Math.floor(Math.random() * 9999999999999999).toString().padStart(16, '0'),
                pin: await hash(Math.floor(Math.random() * 9999).toString().padStart(4, '0')),
                verification_value: await hash(Math.floor(Math.random() * 999).toString().padStart(3, '0')),
                status: "active",
                account_id: firstAccount.id,
                daily_limit: Math.random() >= 0.5 ? null : (Math.floor(Math.random() * 98) + 2) * 100,
                client_id: clientId
            }

            bankCards.push(card);
        }

        if (clientAccounts.length > 1) {
            const firstAccount = clientAccounts[1];

            const card = {
                id: null,
                type: "Credit",
                type_id: cardTypeIds[1],
                expiry_date: new Date(Math.floor(Math.random() * 10) + 2030, Math.floor(Math.random() * 12), 1),
                card_number: Math.floor(Math.random() * 9999999999999999).toString().padStart(16, '0'),
                pin: await hash(Math.floor(Math.random() * 9999).toString().padStart(4, '0')),
                verification_value: await hash(Math.floor(Math.random() * 999).toString().padStart(3, '0')),
                status: "active",
                account_id: firstAccount.id,
                daily_limit: Math.random() >= 0.5 ? null : (Math.floor(Math.random() * 98) + 2) * 100,
                client_id: clientId
            }

            bankCards.push(card);
        }
    }

    const client = await createClient();
    await client.connect();
    const res = await client.query(
        `INSERT INTO wob.bank_card(card_type_id, expiry_date, card_number, pin, verification_value, status, account_id, daily_limit)
         SELECT type_id, expiry_date, card_number, pin, verification_value, status, account_id, daily_limit
         FROM jsonb_to_recordset($1::jsonb)
             AS t (
                type_id uuid
                , expiry_date date
                , card_number text
                , pin text
                , verification_value text
                , status text
                , account_id uuid
                , daily_limit money
             )
         RETURNING bank_card_id;`,
        [JSON.stringify(bankCards)]
    );
    await client.end();

    const cardIds = res.rows.map(row => row.bank_card_id);
    bankCards.forEach(function (card, i) {
        card.id = cardIds[i];
    });
}

// Function to create dummy loan data
async function createCardApplications() {
    const applications = [];
    bankCards.forEach(card => {
        const application = {
            id: null,
            submission_date: new Date(Math.floor(Math.random() * 10) + 2020, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
            status: "approved",
            client_id: card.client_id,
            card_type_id: card.type_id,
            staff_id: staffIds[Math.floor(Math.random() * staffIds.length)],
            notes: "Approved"
        }

        applications.push(application);

        if (Math.random() >= 0.95) {
            const application = {
                id: null,
                submission_date: new Date(Math.floor(Math.random() * 10) + 2020, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
                status: "rejected",
                client_id: card.client_id,
                card_type_id: card.type_id,
                staff_id: staffIds[Math.floor(Math.random() * staffIds.length)],
                notes: "I didn't feel like approving this one <3"
            }

            applications.push(application);
        }
    });

    const client = await createClient();
    await client.connect();
    const res = await client.query(
        `INSERT INTO wob.card_application(submission_date, status, client_id, card_type_id, staff_id, notes)
         SELECT submission_date, status, client_id, card_type_id, staff_id, notes
         FROM jsonb_to_recordset($1::jsonb)
             AS t (
                submission_date date
                , status text
                , client_id uuid
                , card_type_id uuid
                , staff_id uuid
                , notes text
             )
         RETURNING card_application_id;`,
        [JSON.stringify(applications)]
    );
    await client.end();

    const applicationIds = res.rows.map(row => row.card_application_id);
    applications.forEach(function (application, i) {
        application.id = applicationIds[i];
    });
}

// Function to create dummy loan data
async function createLoans() {
    const statues = [
        "performing",
        "late",
        "overdue",
        "default",
        "inactive"
    ];

    clientIds.forEach(clientId => {
        if (Math.random() <= 0.3) {
            const loan = {
                id: null,
                client_id: clientId,
                principal: 1_000 * (Math.floor(Math.random() * 15) + 1),
                interest_accumulated: 0,
                term_months: 12 * (Math.floor(Math.random() * 3) + 3),
                monthly_payment_amount: 0,
                status: statues[Math.floor(Math.random() * statues.length)]
            }
            loan.monthly_payment_amount = loan.principal / loan.term_months;

            loans.push(loan);
        }
    });

    let client = await createClient();
    await client.connect();
    let res = await client.query(
        `INSERT INTO wob.interest(interest_rate, interest_type)
         VALUES (0.05, 'simple')
         RETURNING interest_id;`,
        []
    );
    await client.end();

    const interestId = res.rows[0].interest_id;
    loans.forEach(loan => loan.interest_id = interestId);

    client = await createClient();
    await client.connect();
    res = await client.query(
        `INSERT INTO wob.loan(client_id, principal, interest_accumulated, term_months, monthly_payment_amount, status, interest_id)
         SELECT client_id, principal, interest_accumulated, term_months, monthly_payment_amount, status, interest_id
         FROM jsonb_to_recordset($1::jsonb)
             AS t (
                client_id uuid
                , principal money
                , interest_accumulated money
                , term_months integer
                , monthly_payment_amount money
                , status text
                , interest_id uuid
             )
         RETURNING loan_id;`,
        [JSON.stringify(loans)]
    );
    await client.end();

    const loanIds = res.rows.map(row => row.loan_id);
    loans.forEach(function (loan, i) {
        loan.id = loanIds[i];
    });
}

// Function to create dummy loan application data
async function createLoanApplications() {
    const applications = [];
    loans.forEach(loan => {
        const application = {
            id: null,
            amount: loan.principal,
            status: "approved",
            collateral: "None",
            notes: "Approved",
            client_id: loan.client_id,
            staff_id: staffIds[Math.floor(Math.random() * staffIds.length)],
            interest_id: loan.interest_id
        }

        applications.push(application);

        if (Math.random() >= 0.95) {
            const application = {
                id: null,
                amount: loan.principal,
                status: "rejected",
                collateral: "None",
                notes: "I didn't feel like approving this one either </3",
                client_id: loan.client_id,
                staff_id: staffIds[Math.floor(Math.random() * staffIds.length)],
                interest_id: loan.interest_id
            }

            applications.push(application);
        }
    });

    const client = await createClient();
    await client.connect();
    const res = await client.query(
        `INSERT INTO wob.loan_application(amount, status, collateral, notes, client_id, staff_id, interest_id)
         SELECT amount, status, collateral, notes, client_id, staff_id, interest_id
         FROM jsonb_to_recordset($1::jsonb)
             AS t (
                amount money
                , status text
                , collateral text
                , notes text
                , client_id uuid
                , staff_id uuid
                , interest_id uuid
             )
         RETURNING loan_application_id;`,
        [JSON.stringify(applications)]
    );
    await client.end();

    const applicationIds = res.rows.map(row => row.loan_application_id);
    applications.forEach(function (application, i) {
        application.id = applicationIds[i];
    });
}

// Function to create dummy audit data
async function createAudits() {
    const audits = [];
    accounts.forEach(account => {
        if (Math.random() >= 0.999) {
            const audit = {
                audit_date: new Date(Math.floor(Math.random() * 10) + 2020, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
                notes: "Account balance was too high",
                account_id: account.id,
                staff_id: staffIds[Math.floor(Math.random() * staffIds.length)]
            }

            audits.push(audit);
        }
    });

    const client = await createClient();
    await client.connect();
    await client.query(
        `INSERT INTO wob.audit(audit_date, notes, account_id, staff_id)
         SELECT audit_date, notes, account_id, staff_id
         FROM jsonb_to_recordset($1::jsonb)
             AS t (
                audit_date date
                , notes text
                , account_id uuid
                , staff_id uuid
             )
         RETURNING audit_id;`,
        [JSON.stringify(audits)]
    );
    await client.end();
}

// Function to create dummy statement data
async function createStatements() {
    const statements = [];
    accounts.forEach(account => {
        const statement = {
            account_id: account.id,
            closing_balance: account.balance,
            end_date: new Date()
        }

        statements.push(statement);
    });

    const client = await createClient();
    await client.connect();
    await client.query(
        `INSERT INTO wob.statement(account_id, closing_balance, end_date)
         SELECT account_id, closing_balance, end_date
         FROM jsonb_to_recordset($1::jsonb)
             AS t (
                account_id uuid
                , closing_balance money
                , end_date date
             )
         RETURNING statement_id;`,
        [JSON.stringify(statements)]
    );
    await client.end();
}

// Function to create dummy notification data
async function createNotifications() {
    const notifications = [];
    clientIds.forEach(clientId => {
        const numNotifications = Math.floor(Math.random() * 10) + 1;

        for (let i = 0; i < numNotifications; i++) {
            const notification = {
                message: "You have a new notification!",
                datetime: new Date(Math.floor(Math.random() * 10) + 2020, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
                client_id: clientId,
            }

            notifications.push(notification);
        }
    });

    const client = await createClient();
    await client.connect();
    await client.query(
        `INSERT INTO wob.notification(message, datetime, client_id)
         SELECT message, datetime, client_id
         FROM jsonb_to_recordset($1::jsonb)
             AS t (
                message text
                , datetime timestamp
                , client_id uuid
             )
         RETURNING notification_id;`,
        [JSON.stringify(notifications)]
    );
    await client.end();
}

// Main function to run all the functions
async function main() {
    await truncateAllTables().then(_ => console.log("done truncating tables"));

    await createAddresses(81).then(_ => console.log("done creating addresses"));
    await createBranches(1).then(_ => console.log("done creating branches"));
    await createStaffRoles().then(_ => console.log("done creating staff roles"));
    await createUsers().then(_ => console.log("done creating users, clients and staff"));

    await createAccountTypes().then(_ => console.log("done creating account types"));
    await createAccounts().then(_ => console.log("done creating accounts"));
    await createTransactions().then(_ => console.log("done creating transactions"));

    await createCardTypes().then(_ => console.log("done creating card types"));
    await createCards().then(_ => console.log("done creating cards"));
    await createCardApplications().then(_ => console.log("done creating card applications"));

    await createLoans().then(_ => console.log("done creating loans"));
    await createLoanApplications().then(_ => console.log("done creating loan applications"));

    await createAudits().then(_ => console.log("done creating audits"));
    await createStatements().then(_ => console.log("done creating statements"));
    await createNotifications().then(_ => console.log("done creating notifications"));
}

// Run the main function
main()
    .then(_ => console.log("done"))
    .catch(e => console.error(e));
