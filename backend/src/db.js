import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import mysql from "mysql2/promise";

console.log("ENV CHECK:");
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_NAME:", process.env.DB_NAME);

// Create a connection pool (recommended for production)
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Simple helper to test DB connection
export async function testDBConnection() {
  const connection = await pool.getConnection();
  connection.release();
  return true;
}

export default pool;
