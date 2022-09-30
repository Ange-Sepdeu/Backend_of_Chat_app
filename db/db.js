// import mysql from 'mysql'
const mysql = require('mysql')
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "wechat"
});

module.exports = db