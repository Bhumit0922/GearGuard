import pool from "../db.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * GET MY NOTIFICATIONS
 */
export const getMyNotifications = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const [rows] = await pool.query(
    `SELECT id, message, is_read, created_at
     FROM notifications
     WHERE user_id = ?
     ORDER BY created_at DESC`,
    [userId]
  );

  res.status(200).json(new ApiResponse(200, rows));
});

/**
 * MARK NOTIFICATION AS READ
 */
export const markNotificationRead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  await pool.query(
    `UPDATE notifications
     SET is_read = true
     WHERE id = ? AND user_id = ?`,
    [id, userId]
  );

  res
    .status(200)
    .json(new ApiResponse(200, null, "Notification marked as read"));
});
