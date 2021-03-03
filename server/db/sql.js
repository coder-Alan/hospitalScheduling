var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'alan',
  database : 'hospital'
});

module.exports = connection;