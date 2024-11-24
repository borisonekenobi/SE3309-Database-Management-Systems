-- VIEW STATEMENTS

-- Create a view that shows the client_id, client_name, student_number, account_type_id, balance, and branch_location for all active accounts.
CREATE VIEW wob.active_clients_accounts AS
SELECT 
    c.client_id,                
    u.name AS client_name,      
    c.student_number,           
    a.account_type_id,          
    a.balance,                  
    b.address_id AS branch_location 
FROM 
    wob.client AS c
JOIN 
    wob."user" AS u ON c.user_id = u.user_id -- Join client and user on user_id
JOIN 
    wob.account AS a ON c.client_id = a.client_id -- Join client and accounts on client_id
JOIN 
    wob.branch AS b ON a.branch_id = b.branch_id -- Join accounts and branches on branch_id
WHERE 
    a.status = 'Active'; -- Only include active accounts

-- Create a view that shows the account_id, client_id, account_balance, account_status, account_type_id, and branch_id for all active accounts.
CREATE OR REPLACE VIEW wob.account_balances_view AS
SELECT
    a.account_id,
    a.client_id,
    a.balance AS account_balance,
    a.status AS account_status,
    a.account_type_id,
    a.branch_id
FROM
    wob.account a
WHERE
    a.status = 'Active';  -- Only include active accounts