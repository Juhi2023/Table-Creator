const mysql = require('mysql2')

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'tablecreator',
    password:'rootuser',
    multipleStatements: true
});



module.exports = db;