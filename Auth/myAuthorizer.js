// Update with your config settings.
require('dotenv').config();

const knex = require('knex')({
    client: 'postgresql',
    connection: {
        database:   process.env.DATABASE_NAME,
        user:       process.env.DATABASE_USERNAME,
        password:   process.env.DATABASE_PASSWORD
    }
});

// Confirm that the user has provided the proper credentials by comparing to JSON file
async function myAuthorizer(username, password, callback) {
    let results = await knex
        .select('username','password')
        .from("users")
        .catch((err) => console.log(err))

    let user = results.filter((user) => user.username == username);
    
    if (user[0].username === username && user[0].password === password) {
        return callback(null, true);
    } else {
        return callback(null, false);
    }
};

module.exports = myAuthorizer