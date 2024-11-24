-- INSERT STATEMENTS

---Insert Transactions Based on Account Status
INSERT INTO wob.transaction (amount, datetime, status, account_id, merchant_name)
SELECT 
    (RANDOM() * 1000 + 50)::NUMERIC::MONEY, -- Random transaction amounts
    NOW() - (RANDOM() * INTERVAL '90 days'), -- Random past dates
    CASE WHEN RANDOM() > 0.5 THEN 'completed' ELSE 'pending' END, -- Random status
    account_id,
    CASE 
        WHEN RANDOM() < 0.25 THEN 'Amazon'
        WHEN RANDOM() < 0.50 THEN 'Walmart'
        WHEN RANDOM() < 0.75 THEN 'Target'
        ELSE 'BestBuy'
    END -- Random merchant names
FROM wob.account
WHERE status = 'active'; -- Insert only for active accounts

-- Insert bank cards for accounts without cards
INSERT INTO wob.bank_card (expiry_date, card_number, pin, verification_value, status, account_id, daily_limit, card_type_id)
SELECT 
    CURRENT_DATE + INTERVAL '5 years', -- Expiry date 5 years from now
    LPAD(FLOOR(RANDOM() * 1e16)::TEXT, 16, '0'), -- Random 16-digit card numbers
    LPAD(FLOOR(RANDOM() * 1e4)::TEXT, 64, '0'), -- Random 4-digit PINs
    LPAD(FLOOR(RANDOM() * 1e3)::TEXT, 64, '0'), -- Random 3-digit CVVs
    'active',
    a.account_id,
    ((2000 + FLOOR(RANDOM() * 3000))::numeric)::money, -- Daily limits between $2000 and $5000
    (SELECT card_type_id FROM wob.card_type ORDER BY RANDOM() LIMIT 1) -- Random card type
FROM wob.account a
WHERE NOT EXISTS (
    SELECT 1
    FROM wob.bank_card bc
    WHERE bc.account_id = a.account_id
);

-- Create a new address, and use the `address_id` to create a new user
WITH new_address AS (
    INSERT INTO wob.address(street_number, street_name, city, province, country, postal_code)
    VALUES (1151, 'Richmond Street', 'London', 'Ontario', 'Canada', 'N6A3K7')
    RETURNING address_id
)
INSERT INTO wob."user"(name, phone_number, email, date_of_birth, password, address_id)
VALUES (
    'John Doe',
    '+1 (647) 373-0304',
    'john.doe.1234@gmail.com',
    '2001-09-28',
    '66f23a50a26a03ee8dd01cf5449d408b4137ef3037d55d819ab28d1c9d902983',
    (SELECT address_id FROM new_address)
)
RETURNING user_id;