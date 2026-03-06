const mysql = require('mysql2');
require('dotenv').config();  // loads .env file

// db  create connection
const db= mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER, // mysql username
    password:process.env.DB_PASSWORD, // mysql pwd
    database: process.env.DB_NAME // database name
});

// connect

db.connect((error)=>{
      if (error) {
    console.error('Database connection failed:', err.message);
    return;
  }
  console.log('MySQL connected!');
});

module.exports=db;