# kapi
An e-commerce REST API using Express, Node.js, and Postgres

Carts do not need `CREATE` or `DELETE` operations since they will always be created and linked to a `user` when the `user` is created. If a `user` is deleted, they will `CASCADE` and remove the cart from the db.

## Auth flow

### Create user
1. User enters details in client and submits them
2. Firebase client creates new Auth user and establishes a session
3. idToken is sent to server
4. Server decodes idToken
5. Server creates new user in PG DB with user's Firebase Auth id

### Login use
1. User enters credentials in client and submits them
2. Firebase authenticates the user
3. idToken is sent to server
4. Server decodes idToken
5. Server gets user from PG DB with user's Firebase Auth id
