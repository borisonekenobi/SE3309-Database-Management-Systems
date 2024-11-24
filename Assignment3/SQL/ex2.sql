-- CREATE STATEMENTS

CREATE TABLE IF NOT EXISTS wob.account
(
    account_id uuid NOT NULL DEFAULT gen_random_uuid(),
    client_id uuid NOT NULL,
    account_type_id uuid NOT NULL,
    balance money NOT NULL DEFAULT 0,
    status text COLLATE pg_catalog."default" NOT NULL,
    branch_id uuid NOT NULL,
    CONSTRAINT account_pkey PRIMARY KEY (account_id)
);

CREATE TABLE IF NOT EXISTS wob.account_type
(
    account_type_id uuid NOT NULL DEFAULT gen_random_uuid(),
    name text COLLATE pg_catalog."default" NOT NULL,
    interest_id uuid NOT NULL,
    CONSTRAINT account_type_pkey PRIMARY KEY (account_type_id)
);

CREATE TABLE IF NOT EXISTS wob.address
(
    address_id uuid NOT NULL DEFAULT gen_random_uuid(),
    street_number integer NOT NULL,
    street_name text COLLATE pg_catalog."default" NOT NULL,
    city text COLLATE pg_catalog."default" NOT NULL,
    province text COLLATE pg_catalog."default" NOT NULL,
    country text COLLATE pg_catalog."default" NOT NULL DEFAULT 'Canada'::text,
    postal_code character(6) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT address_pkey PRIMARY KEY (address_id)
);

CREATE TABLE IF NOT EXISTS wob.audit
(
    audit_id uuid NOT NULL DEFAULT gen_random_uuid(),
    audit_date date NOT NULL,
    notes text COLLATE pg_catalog."default" NOT NULL DEFAULT ''::text,
    account_id uuid NOT NULL,
    staff_id uuid NOT NULL,
    CONSTRAINT audit_pkey PRIMARY KEY (audit_id)
);

CREATE TABLE IF NOT EXISTS wob.bank_card
(
    bank_card_id uuid NOT NULL DEFAULT gen_random_uuid(),
    expiry_date date NOT NULL,
    card_number character(16) COLLATE pg_catalog."default" NOT NULL,
    pin character(64) COLLATE pg_catalog."default" NOT NULL,
    verification_value character(64) COLLATE pg_catalog."default" NOT NULL,
    status text COLLATE pg_catalog."default" NOT NULL,
    account_id uuid NOT NULL,
    daily_limit money,
    card_type_id uuid NOT NULL,
    CONSTRAINT bank_card_pkey PRIMARY KEY (bank_card_id)
);

CREATE TABLE IF NOT EXISTS wob.branch
(
    branch_id uuid NOT NULL DEFAULT gen_random_uuid(),
    address_id uuid NOT NULL,
    CONSTRAINT branch_pkey PRIMARY KEY (branch_id)
);

CREATE TABLE IF NOT EXISTS wob.card_application
(
    card_application_id uuid NOT NULL DEFAULT gen_random_uuid(),
    submission_date date NOT NULL,
    status text COLLATE pg_catalog."default" NOT NULL,
    client_id uuid NOT NULL,
    card_type_id uuid NOT NULL,
    staff_id uuid,
    notes text COLLATE pg_catalog."default" NOT NULL DEFAULT ''::text,
    CONSTRAINT card_application_pkey PRIMARY KEY (card_application_id)
);

CREATE TABLE IF NOT EXISTS wob.card_type
(
    card_type_id uuid NOT NULL DEFAULT gen_random_uuid(),
    name text COLLATE pg_catalog."default" NOT NULL,
    interest_id uuid NOT NULL,
    CONSTRAINT card_type_pkey PRIMARY KEY (card_type_id)
);

CREATE TABLE IF NOT EXISTS wob.client
(
    client_id uuid NOT NULL DEFAULT gen_random_uuid(),
    student_number integer NOT NULL,
    status text COLLATE pg_catalog."default" NOT NULL,
    user_id uuid NOT NULL,
    CONSTRAINT client_pkey PRIMARY KEY (client_id)
);

CREATE TABLE IF NOT EXISTS wob.interest
(
    interest_id uuid NOT NULL DEFAULT gen_random_uuid(),
    interest_rate numeric(5, 4) NOT NULL,
    interest_type text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT interest_pkey PRIMARY KEY (interest_id)
);

CREATE TABLE IF NOT EXISTS wob.loan
(
    loan_id uuid NOT NULL DEFAULT gen_random_uuid(),
    client_id uuid NOT NULL,
    principal money NOT NULL,
    interest_accumulated money NOT NULL,
    term_months smallint NOT NULL,
    monthly_payment_amount money NOT NULL,
    status text COLLATE pg_catalog."default" NOT NULL,
    interest_id uuid NOT NULL,
    CONSTRAINT loan_pkey PRIMARY KEY (loan_id)
);

CREATE TABLE IF NOT EXISTS wob.loan_application
(
    loan_application_id uuid NOT NULL DEFAULT gen_random_uuid(),
    amount money NOT NULL,
    status text COLLATE pg_catalog."default" NOT NULL,
    collateral text COLLATE pg_catalog."default" NOT NULL,
    notes text COLLATE pg_catalog."default" NOT NULL DEFAULT ''::text,
    client_id uuid NOT NULL,
    staff_id uuid,
    interest_id uuid NOT NULL,
    CONSTRAINT loan_application_pkey PRIMARY KEY (loan_application_id)
);

CREATE TABLE IF NOT EXISTS wob.notification
(
    notification_id uuid NOT NULL DEFAULT gen_random_uuid(),
    message text COLLATE pg_catalog."default" NOT NULL,
    datetime timestamp(3) with time zone NOT NULL,
    client_id uuid NOT NULL,
    CONSTRAINT notification_pkey PRIMARY KEY (notification_id)
);

CREATE TABLE IF NOT EXISTS wob.staff
(
    staff_id uuid NOT NULL DEFAULT gen_random_uuid(),
    staff_role_id uuid NOT NULL,
    status text COLLATE pg_catalog."default" NOT NULL,
    branch_id uuid NOT NULL,
    user_id uuid NOT NULL,
    CONSTRAINT staff_pkey PRIMARY KEY (staff_id)
);

CREATE TABLE IF NOT EXISTS wob.staff_role
(
    staff_role_id uuid NOT NULL DEFAULT gen_random_uuid(),
    name text COLLATE pg_catalog."default" NOT NULL,
    base_salary money NOT NULL,
    CONSTRAINT staff_role_pkey PRIMARY KEY (staff_role_id)
);

CREATE TABLE IF NOT EXISTS wob.statement
(
    statement_id uuid NOT NULL DEFAULT gen_random_uuid(),
    account_id uuid NOT NULL,
    closing_balance money NOT NULL,
    end_date date NOT NULL,
    CONSTRAINT statement_pkey PRIMARY KEY (statement_id)
);

CREATE TABLE IF NOT EXISTS wob.transaction
(
    transaction_id uuid NOT NULL DEFAULT gen_random_uuid(),
    amount money NOT NULL,
    datetime timestamp(3) with time zone NOT NULL,
    status text COLLATE pg_catalog."default" NOT NULL,
    account_id uuid NOT NULL,
    merchant_name text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT transaction_pkey PRIMARY KEY (transaction_id)
);

CREATE TABLE IF NOT EXISTS wob."user"
(
    user_id uuid NOT NULL DEFAULT gen_random_uuid(),
    name text COLLATE pg_catalog."default" NOT NULL,
    phone_number text COLLATE pg_catalog."default" NOT NULL,
    email text COLLATE pg_catalog."default" NOT NULL,
    date_of_birth date NOT NULL,
    password character(64) COLLATE pg_catalog."default" NOT NULL,
    address_id uuid NOT NULL,
    CONSTRAINT user_pkey PRIMARY KEY (user_id)
);

ALTER TABLE IF EXISTS wob.account
    ADD CONSTRAINT fk_account_type_id FOREIGN KEY (account_type_id)
        REFERENCES wob.account_type (account_type_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;


ALTER TABLE IF EXISTS wob.account
    ADD CONSTRAINT fk_branch_id FOREIGN KEY (branch_id)
        REFERENCES wob.branch (branch_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;


ALTER TABLE IF EXISTS wob.account
    ADD CONSTRAINT fk_client_id FOREIGN KEY (client_id)
        REFERENCES wob.client (client_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;


ALTER TABLE IF EXISTS wob.account_type
    ADD CONSTRAINT fk_interest_rate_id FOREIGN KEY (interest_id)
        REFERENCES wob.interest (interest_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;


ALTER TABLE IF EXISTS wob.audit
    ADD CONSTRAINT fk_account_id FOREIGN KEY (account_id)
        REFERENCES wob.account (account_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;


ALTER TABLE IF EXISTS wob.audit
    ADD CONSTRAINT fk_staff_id FOREIGN KEY (staff_id)
        REFERENCES wob.staff (staff_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;


ALTER TABLE IF EXISTS wob.bank_card
    ADD CONSTRAINT fk_account_id FOREIGN KEY (account_id)
        REFERENCES wob.account (account_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;


ALTER TABLE IF EXISTS wob.bank_card
    ADD CONSTRAINT fk_card_type_id FOREIGN KEY (card_type_id)
        REFERENCES wob.card_type (card_type_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID;


ALTER TABLE IF EXISTS wob.branch
    ADD CONSTRAINT fk_address_id FOREIGN KEY (address_id)
        REFERENCES wob.address (address_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID;


ALTER TABLE IF EXISTS wob.card_application
    ADD CONSTRAINT fk_card_type_id FOREIGN KEY (card_type_id)
        REFERENCES wob.card_type (card_type_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;


ALTER TABLE IF EXISTS wob.card_application
    ADD CONSTRAINT fk_client_id FOREIGN KEY (client_id)
        REFERENCES wob.client (client_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;


ALTER TABLE IF EXISTS wob.card_application
    ADD CONSTRAINT fk_staff_id FOREIGN KEY (staff_id)
        REFERENCES wob.staff (staff_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;


ALTER TABLE IF EXISTS wob.card_type
    ADD CONSTRAINT fk_interest_id FOREIGN KEY (interest_id)
        REFERENCES wob.interest (interest_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;


ALTER TABLE IF EXISTS wob.client
    ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id)
        REFERENCES wob."user" (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;


ALTER TABLE IF EXISTS wob.loan
    ADD CONSTRAINT fk_client_id FOREIGN KEY (client_id)
        REFERENCES wob.client (client_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;


ALTER TABLE IF EXISTS wob.loan
    ADD CONSTRAINT fk_interest_id FOREIGN KEY (interest_id)
        REFERENCES wob.interest (interest_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;


ALTER TABLE IF EXISTS wob.loan_application
    ADD CONSTRAINT fk_client_id FOREIGN KEY (client_id)
        REFERENCES wob.client (client_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;


ALTER TABLE IF EXISTS wob.loan_application
    ADD CONSTRAINT fk_interest_id FOREIGN KEY (interest_id)
        REFERENCES wob.interest (interest_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;


ALTER TABLE IF EXISTS wob.loan_application
    ADD CONSTRAINT fk_staff_id FOREIGN KEY (staff_id)
        REFERENCES wob.staff (staff_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;


ALTER TABLE IF EXISTS wob.notification
    ADD CONSTRAINT fk_client_id FOREIGN KEY (client_id)
        REFERENCES wob.client (client_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;


ALTER TABLE IF EXISTS wob.staff
    ADD CONSTRAINT fk_branch_id FOREIGN KEY (branch_id)
        REFERENCES wob.branch (branch_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;


ALTER TABLE IF EXISTS wob.staff
    ADD CONSTRAINT fk_role_id FOREIGN KEY (staff_role_id)
        REFERENCES wob.staff_role (staff_role_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;


ALTER TABLE IF EXISTS wob.staff
    ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id)
        REFERENCES wob."user" (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;


ALTER TABLE IF EXISTS wob.statement
    ADD CONSTRAINT fk_account_id FOREIGN KEY (account_id)
        REFERENCES wob.account (account_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;


ALTER TABLE IF EXISTS wob.transaction
    ADD CONSTRAINT fk_account_id FOREIGN KEY (account_id)
        REFERENCES wob.account (account_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;


ALTER TABLE IF EXISTS wob."user"
    ADD CONSTRAINT fk_address_id FOREIGN KEY (address_id)
        REFERENCES wob.address (address_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID;