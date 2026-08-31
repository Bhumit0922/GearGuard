import fs from 'fs';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } = process.env;

async function run() {
  const connection = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    port: DB_PORT,
    multipleStatements: true
  });

  console.log('Connected to MySQL...');

  try {
    console.log(`Recreating database ${DB_NAME}...`);
    await connection.query(`DROP DATABASE IF EXISTS ${DB_NAME};`);
    await connection.query(`CREATE DATABASE ${DB_NAME};`);
    await connection.query(`USE ${DB_NAME};`);

    const schemaSql = fs.readFileSync(path.join(process.cwd(), 'sql', 'schema.sql'), 'utf-8');
    console.log('Running schema.sql...');
    await connection.query(schemaSql);

    const seedSql = fs.readFileSync(path.join(process.cwd(), 'sql', 'seed.sql'), 'utf-8');
    console.log('Running seed.sql...');
    await connection.query(seedSql);

    console.log('Database reset complete!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
}

run();
