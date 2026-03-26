require("dotenv").config();
const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD ?? "",
  database: process.env.DB_NAME || "railway",
  port: Number(process.env.DB_PORT) || 3306,
  connectionLimit: Math.min(Number(process.env.DB_CONNECTION_LIMIT) || 20, 100),
  waitForConnections: true,
});

/**
 * Run SQL. Pass a second argument for bound parameters (recommended for user input).
 * @param {string} qry
 * @param {unknown[]=} params
 */
const mySqlQury = (qry, params) => {
  return new Promise((resolve, reject) => {
    const cb = (err, row) => {
      if (err) return reject(err);
      resolve(row);
    };
    if (params !== undefined) {
      pool.query(qry, params, cb);
    } else {
      pool.query(qry, cb);
    }
  });
};

module.exports = { conn: pool, mySqlQury };
