import "dotenv/config";
import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initializeDB() {
  console.log("Connecting to MySQL to initialize the database...");

  try {
    // Connect without specifying the database first, so we can create it
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "127.0.0.1",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      port: Number(process.env.DB_PORT) || 3306,
      multipleStatements: true,
    });

    const dbName = process.env.DB_NAME || "gearguard";
    
    console.log(`Creating database '${dbName}' if it doesn't exist...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    await connection.query(`USE \`${dbName}\`;`);

    console.log("Reading schema.sql...");
    const schemaPath = path.join(__dirname, "../../sql/schema.sql");
    const schemaSql = fs.readFileSync(schemaPath, "utf8");

    console.log("Running schema.sql...");
    await connection.query(schemaSql);
    
    console.log("✅ Database initialized successfully with schema!");
    
    // Check if seed.sql exists and ask user? Or just run it.
    const seedPath = path.join(__dirname, "../../sql/seed.sql");
    if (fs.existsSync(seedPath)) {
        console.log("Reading seed.sql...");
        const seedSql = fs.readFileSync(seedPath, "utf8");
        try {
            await connection.query(seedSql);
            console.log("✅ Database seeded successfully!");
        } catch(seedErr) {
            console.log("⚠️ Seed might have already run or failed: ", seedErr.message);
        }
    }

    await connection.end();
  } catch (error) {
    console.error("❌ Failed to initialize database:", error);
    process.exit(1);
  }
}

initializeDB();
