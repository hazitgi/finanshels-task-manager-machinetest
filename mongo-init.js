// Initialize the replica set
rs.initiate({
    _id: "rs0",
    members: [
      { _id: 0, host: "localhost:27017" }
    ]
  });
  
  // Create an admin user
  db.getSiblingDB('admin').createUser({
    user: "admin",
    pwd: "adminpassword",
    roles: [{ role: "root", db: "admin" }]
  });
  