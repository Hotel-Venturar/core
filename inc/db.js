// get the client
const mysql = require('mysql2');

// create the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'user',
    database: 'hotelventura',
    password: 'Us.123',
    // multipleStatements: true
});

module.exports = connection;