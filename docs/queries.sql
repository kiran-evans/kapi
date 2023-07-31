-- PRODUCT

CREATE TABLE products {
    id int PRIMARY KEY,
    name varchar(255) NOT NULL,
    description varchar(255) NOT NULL,
    price money NOT NULL DEFAULT 0.00,
    img_url text DEFAULT NULL
}

-- USER

CREATE TABLE users {
    id int PRIMARY KEY,
    email varchar(255) NOT NULL UNIQUE,
    password text NOT NULL
}

-- CART

-- A cart_item references an existing product in the database
CREATE TYPE cart_item AS (
    product_id int REFERENCES product ON DELETE CASCADE
)

CREATE TABLE carts {
    id int PRIMARY KEY,
    user_id int NOT NULL REFERENCES users ON DELETE CASCADE,
    items cart_item[]
}

-- ORDER

-- An order_item contains some information about a product that existed in the database at the time the order was created
-- An order_item DOES NOT contain a reference to a product in the the database, as that product may have been changed or deleted, but the user may still want to see what they ordered
CREATE TYPE order_item AS (
    name varchar(255) NOT NULL,
    price money NOT NULL,
    quantity int NOT NULL
)

-- An order is essentially a receipt which is created when a user checks out their cart
-- If a user account is deleted, the user_id column should be set to NULL. This allows orders to stay in the database even if the user account has been deleted
CREATE TABLE orders {
    id int PRIMARY KEY,
    user_id int REFERENCES users ON DELETE SET NULL,
    items order_item[] NOT NULL
}