-- PRODUCT

CREATE TABLE IF NOT EXISTS products (
    id uuid PRIMARY KEY,
    name varchar(255) NOT NULL,
    description varchar(255) NOT NULL,
    price money NOT NULL DEFAULT 0.00,
    categories text[],
    sizes varchar(15)[],
    colours varchar(15)[]
)

-- USER

CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY,
    auth_id text NOT NULL UNIQUE
)

-- CART

CREATE TYPE cart_item AS (
    product_id uuid REFERENCES products ON DELETE CASCADE,
    quantity int NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS carts (
    id uuid PRIMARY KEY,
    user_id uuid REFERENCES users ON DELETE CASCADE,
    items cart_item[] NOT NULL DEFAULT '{}'
)

-- ORDER

-- An order_item contains some information about a product that existed in the database at the time the order was created
-- An order_item DOES NOT contain a reference to a product in the the database, as that product may have been changed or deleted, but the user may still want to see what they ordered
CREATE TYPE order_item AS (
    name varchar(255) NOT NULL,
    price money NOT NULL,
    quantity int NOT NULL
);

-- An order is essentially a receipt which is created when a user checks out their cart
-- If a user account is deleted, the user_id column should be set to NULL. This allows orders to stay in the database even if the user account has been deleted
CREATE TABLE IF NOT EXISTS orders (
    id uuid PRIMARY KEY,
    user_id uuid REFERENCES users ON DELETE SET NULL,
    date_placed bigint NOT NULL,
    items order_item[] NOT NULL
)