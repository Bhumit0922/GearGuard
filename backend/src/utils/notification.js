import pool from "../db.js";

export const createNotification = async ({ userId, title, message }) => {
  await pool.query(
    `INSERT INTO notifications (user_id, title, message)
     VALUES (?, ?, ?)`,
    [userId, title, message]
  );
};
