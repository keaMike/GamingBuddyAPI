const mysql = require('mysql')
let pool

function initConnection() {
  if (!pool) {
    pool = mysql.createPool({
      connectionLimit: 10,
      host: process.env.MYSQL_DB_URL,
      user: process.env.MYSQL_DB_USERNAME,
      password: process.env.MYSQL_DB_PASSWORD,
      database: process.env.MYSQL_DB_NAME,
    })
  }
}

async function getPool() {
  if (!pool) {
    throw new Error('The db pool has not been initialized')
  }
  return pool
}

module.exports = {
  initConnection,
  getPool,
}
