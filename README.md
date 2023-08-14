# kapi
An e-commerce REST API using Express, Node.js, and Postgres

Carts do not need `CREATE` or `DELETE` operations since they will always be created and linked to a `user` when the `user` is created. If a `user` is deleted, they will `CASCADE` and remove the cart from the db.

## Auth flow

### Create user
1. User enters details in client and submits them
2. Client sends details by JWT to server
3. Server creates new Firebase Auth user
4. Server creates new user in PG DB with user's Firebase Auth id

### Login use
1. User enters credentials in client and submits them
2. Client sends credentials by JWT to server
3. Server verifies credentials with Firebase Auth
4.
    a. If verified, server gets user data from PG DB
    b. If not verified, server responds with not authenticated
