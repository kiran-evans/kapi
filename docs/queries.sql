-- PRODUCT

CREATE TABLE IF NOT EXISTS products (
    id BIGSERIAL PRIMARY KEY,
    name varchar(255) NOT NULL,
    description varchar(255) NOT NULL,
    price money NOT NULL DEFAULT 0.00
)

-- USER

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    email varchar(255) NOT NULL UNIQUE,
    password text NOT NULL
)

-- CART

CREATE TABLE IF NOT EXISTS carts (
    id BIGSERIAL PRIMARY KEY,
    user_id bigint REFERENCES users ON DELETE CASCADE,
    items bigint[]
)

-- ORDER

-- An order_item contains some information about a product that existed in the database at the time the order was created
-- An order_item DOES NOT contain a reference to a product in the the database, as that product may have been changed or deleted, but the user may still want to see what they ordered
CREATE TYPE order_item AS (
    name varchar(255),
    price money,
    quantity int
);

-- An order is essentially a receipt which is created when a user checks out their cart
-- If a user account is deleted, the user_id column should be set to NULL. This allows orders to stay in the database even if the user account has been deleted
CREATE TABLE IF NOT EXISTS orders (
    id BIGSERIAL PRIMARY KEY,
    user_id bigint REFERENCES users ON DELETE SET NULL,
    items order_item[] NOT NULL
)