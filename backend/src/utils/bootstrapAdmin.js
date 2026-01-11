import pool from "../db.js";
import bcrypt from "bcryptjs";

export const bootstrapAdmin = async () => {
  const [[existingManager]] = await pool.query(
    "SELECT id FROM users WHERE role = 'manager' LIMIT 1"
  );

  if (existingManager) {
    console.log("✅ Manager already exists. Skipping bootstrap.");
    return;
  }

  console.log("⚠️ No manager found. Bootstrapping admin...");

  // 1️⃣ Create team
  const [teamResult] = await pool.query("INSERT INTO teams (name) VALUES (?)", [
    process.env.BOOTSTRAP_TEAM_NAME,
  ]);

  const teamId = teamResult.insertId;

  // 2️⃣ Create manager
  const hashedPassword = await bcrypt.hash(
    process.env.BOOTSTRAP_MANAGER_PASSWORD,
    10
  );

  await pool.query(
    `INSERT INTO users (name, email, password, role, team_id)
     VALUES (?, ?, ?, 'manager', ?)`,
    [
      process.env.BOOTSTRAP_MANAGER_NAME,
      process.env.BOOTSTRAP_MANAGER_EMAIL,
      hashedPassword,
      teamId,
    ]
  );

  console.log("✅ Super Manager created successfully");
};
