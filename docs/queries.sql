-- PRODUCT

CREATE TABLE IF NOT EXISTS products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(255) NOT NULL,
    description varchar(255) NOT NULL,
    price money NOT NULL DEFAULT 0.00,
    categories text[] NOT NULL,
    sizes varchar(15)[] NOT NULL,
    colours varchar(15)[] NOT NULL
)

-- USER

CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id text NOT NULL UNIQUE,
    cart_items uuid[] NOT NULL DEFAULT '{}'
)

-- CART

CREATE TABLE IF NOT EXISTS cart_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id uuid REFERENCES products ON DELETE CASCADE,
    quantity int NOT NULL,
    colour varchar(15) NOT NULL,
    size varchar(15) NOT NULL
)

-- ORDER

-- An order is essentially a receipt which is created when a user checks out their cart
-- If a user account is deleted, the user_id column should be set to NULL. This allows orders to stay in the database even if the user account has been deleted
CREATE TABLE IF NOT EXISTS orders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES users ON DELETE SET NULL,
    date_placed bigint NOT NULL,
    items json[] NOT NULL
)