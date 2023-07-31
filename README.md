# kapi
An e-commerce REST API using Express, Node.js, and Postgres

Carts do not need `CREATE` or `DELETE` operations since they will always be created and linked to a `user` when the `user` is created. If a `user` is deleted, they will `CASCADE` and remove the cart from the db.