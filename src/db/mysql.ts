const mysql = require("mysql2/promise");
const {
  db: { db_host, db_user, db_pass, db_name },
} = require("config");

export const mysqlDB = mysql.createPool({
  host: db_host,
  user: db_user,
  password: db_pass,
  database: db_name,
});
