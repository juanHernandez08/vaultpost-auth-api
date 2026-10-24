// Pool de conexiones a MySQL. Los datos se leen de variables de entorno (.env).
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "vaultpost_api",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "vaultpost_auth",
  charset: "utf8mb4",
  connectionLimit: 10,
});

module.exports = pool;
