-- SELECT STATEMENTS

-- Get user with all their accounts and all their cards
SELECT "user".name, "user".phone_number, "user".email, "user".date_of_birth,
       client.student_number, client.status AS client_status,
       account.balance, account.status AS account_status,
       account_type.name AS account_type,
       bank_card.expiry_date AS card_expiry_date, bank_card.card_number, bank_card.status AS card_status, bank_card.daily_limit,
       card_type.name AS card_type,
       interest.interest_rate, interest.interest_type
FROM wob."user"
JOIN wob.client ON wob.client.user_id = wob."user".user_id
JOIN wob.account ON wob.account.client_id = wob.client.client_id
JOIN wob.account_type ON wob.account_type.account_type_id = wob.account.account_type_id
LEFT JOIN wob.bank_card ON wob.bank_card.account_id = wob.account.account_id
LEFT JOIN wob.card_type ON wob.card_type.card_type_id = wob.bank_card.card_type_id
LEFT JOIN wob.interest ON wob.interest.interest_id = wob.card_type.interest_id
WHERE "user".name = 'Annamaria Hercule Fredenburg';

---Retrieve the total balance for each client who has at least one active account and has made at least one transaction with an amount greater than $500
SELECT 
    c.client_id,
    c.user_id,
    SUM(a.balance)::money AS total_balance, -- Total balance for active accounts
    COUNT(t.transaction_id) AS high_value_transactions -- Count of transactions > $500
FROM wob.client c
JOIN wob.account a ON c.client_id = a.client_id
LEFT JOIN wob.transaction t ON a.account_id = t.account_id
WHERE a.status = 'active'
  AND EXISTS (
      SELECT 1 
      FROM wob.transaction sub_t
      WHERE sub_t.account_id = a.account_id 
        AND sub_t.amount::numeric > 500.00 -- At least one transaction > $500
  )
GROUP BY c.client_id, c.user_id
ORDER BY total_balance DESC; -- Order by total balance

-- Get the average bank account balance for each account type
SELECT 
    AVG(a.balance::numeric)::money AS average_bank_account_balance,
    at.name AS account_type
FROM wob.account a
JOIN wob.account_type at ON a.account_type_id = at.account_type_id
JOIN wob.client c ON a.client_id = c.client_id
JOIN wob."user" u ON c.user_id = u.user_id
WHERE a.balance > 0::money -- Include only accounts with a positive balance
GROUP BY at.name
HAVING AVG(a.balance::numeric) > 100000 -- Include only account types with a high average balance
ORDER BY average_bank_account_balance DESC;

-- Get all users with their total balance, ordered by total balance from highest to lowest
SELECT 
    u.user_id, 
    u.name, 
    u.phone_number, 
    u.email,
    c.status AS client_status,
    SUM(a.balance::numeric)::money AS total_balance
FROM wob."user" u
JOIN wob.client c ON c.user_id = u.user_id
JOIN wob.account a ON a.client_id = c.client_id
WHERE a.balance > 0::money -- Include accounts with a positive balance
GROUP BY u.user_id, u.name, u.phone_number, u.email, c.status
ORDER BY total_balance DESC;

---Retrieve High-Transaction Accounts with Notifications
SELECT 
    t.transaction_id,
    t.amount,
    t.datetime AS transaction_date,
    t.status AS transaction_status,
    t.merchant_name,
    a.account_id,
    a.status AS account_status,
    (
        SELECT COUNT(*)
        FROM wob.transaction t_sub
        WHERE t_sub.account_id = a.account_id
          AND t_sub.status = 'completed'
    ) AS total_completed_transactions,
    (
        SELECT SUM(t_sub.amount)
        FROM wob.transaction t_sub
        WHERE t_sub.account_id = a.account_id
          AND t_sub.status = 'completed'
    ) AS total_completed_amount,
    CASE
        WHEN EXISTS (
            SELECT 1
            FROM wob.notification n_sub
            WHERE n_sub.client_id = a.client_id
              AND n_sub.message LIKE '%high transaction%'
        ) THEN 'Notified'
        ELSE 'Not Notified'
    END AS notification_status
FROM wob.transaction t
INNER JOIN wob.account a ON t.account_id = a.account_id
LEFT JOIN wob.notification n ON a.client_id = n.client_id
WHERE a.status = 'high_transactions'
  AND t.status = 'completed'
  AND t.datetime > CURRENT_TIMESTAMP - INTERVAL '30' DAY
GROUP BY t.transaction_id, t.amount, t.datetime, t.status, t.merchant_name, a.account_id, a.status, a.client_id
ORDER BY t.datetime DESC
FETCH FIRST 10 ROWS ONLY;

-- Get the total account balance for each forward sortation area
SELECT 
    SUBSTRING(a.postal_code FROM 1 FOR 3) AS forward_sortation_area, -- Extract first 3 characters of postal code
    SUM(ac.balance)::money AS total_account_balance -- Sum of account balances
FROM wob.address a
JOIN wob."user" u ON a.address_id = u.address_id
JOIN wob.client c ON u.user_id = c.user_id
JOIN wob.account ac ON c.client_id = ac.client_id
WHERE ac.status = 'active' -- Only include active accounts
GROUP BY forward_sortation_area
ORDER BY total_account_balance DESC;

-- Get the count of users with the same family name
SELECT 
    COUNT(*) AS family_name_count,
    RIGHT(u.name, CHAR_LENGTH(u.name) - POSITION(' ' IN u.name)) AS family_name
FROM wob."user" u
WHERE POSITION(' ' IN u.name) > 0 -- Ensure names contain at least one space
GROUP BY family_name
ORDER BY family_name_count DESC
FETCH FIRST 12 ROWS ONLY;