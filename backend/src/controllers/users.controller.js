import pool from "../db.js";
import bcrypt from "bcryptjs";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
} from "../utils/token.js";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;

/**
 * SIGNUP (USER ONLY)
 */
export const signupUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  // Enforce USER role only
  const role = "user";

  if (!passwordRegex.test(password)) {
    throw new ApiError(
      400,
      "Password must contain lowercase, uppercase, special character and be at least 8 characters long"
    );
  }

  const [[existingUser]] = await pool.query(
    `SELECT id FROM users WHERE email = ?`,
    [email]
  );

  if (existingUser) {
    throw new ApiError(409, "Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const [result] = await pool.query(
    `INSERT INTO users (name, email, password, role)
     VALUES (?, ?, ?, ?)`,
    [name, email, hashedPassword, role]
  );

  res.status(201).json(
    new ApiResponse(
      201,
      {
        id: result.insertId,
        name,
        email,
        role,
      },
      "Signup successful"
    )
  );
});

/**
 * LOGIN
 */
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const [[user]] = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);

  if (!user) {
    throw new ApiError(404, "Account does not exist");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid password");
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken();

  await pool.query(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
     VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 14 DAY))`,
    [user.id, hashToken(refreshToken)]
  );

  res.status(200).json(
    new ApiResponse(
      200,
      {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          name: user.name,
          role: user.role,
          team_id: user.team_id,
          phone: user.phone,
          profile_picture_url: user.profile_picture_url,
          notification_preferences: user.notification_preferences
        },
      },
      "Login successful"
    )
  );
});

/**
 * GET TECHNICIANS (Manager only via middleware)
 */
export const getTechnicians = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT id, name, email, team_id FROM users WHERE role = 'technician'`
  );

  res.status(200).json(new ApiResponse(200, rows));
});

/**
 * Manager creates technician
 */
export const createTechnician = asyncHandler(async (req, res) => {
  const { name, email, password, teamId } = req.body;

  if (!name || !email || !password || !teamId) {
    throw new ApiError(400, "All fields are required");
  }

  const [[team]] = await pool.query("SELECT id FROM teams WHERE id = ?", [
    teamId,
  ]);

  if (!team) {
    throw new ApiError(404, "Team not found");
  }

  const [[existing]] = await pool.query(
    "SELECT id FROM users WHERE email = ?",
    [email]
  );

  if (existing) {
    throw new ApiError(409, "Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const [result] = await pool.query(
    `INSERT INTO users (name, email, password, role, team_id)
     VALUES (?, ?, ?, 'technician', ?)`,
    [name, email, hashedPassword, teamId]
  );

  res.status(201).json(
    new ApiResponse(
      201,
      {
        id: result.insertId,
        name,
        email,
        role: "technician",
        team_id: teamId,
      },
      "Technician created successfully"
    )
  );
});

/**
 * Manager creates another manager (WITH TEAM)
 */
export const createManager = asyncHandler(async (req, res) => {
  const { name, email, password, teamId } = req.body;

  if (!name || !email || !password || !teamId) {
    throw new ApiError(400, "All fields are required");
  }

  // Check team exists
  const [[team]] = await pool.query("SELECT id FROM teams WHERE id = ?", [
    teamId,
  ]);

  if (!team) {
    throw new ApiError(404, "Team not found");
  }

  // Check email
  const [[existing]] = await pool.query(
    "SELECT id FROM users WHERE email = ?",
    [email]
  );

  if (existing) {
    throw new ApiError(409, "Email already exists");
  }

  if (!passwordRegex.test(password)) {
    throw new ApiError(
      400,
      "Password must contain lowercase, uppercase, special character and be at least 8 characters long"
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const [result] = await pool.query(
    `INSERT INTO users (name, email, password, role, team_id)
     VALUES (?, ?, ?, 'manager', ?)`,
    [name, email, hashedPassword, teamId]
  );

  res.status(201).json(
    new ApiResponse(
      201,
      {
        id: result.insertId,
        name,
        email,
        role: "manager",
        team_id: teamId,
      },
      "Manager created successfully"
    )
  );
});

/**
 * REFRESH ACCESS TOKEN
 */
export const refreshAccessToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new ApiError(400, "Refresh token required");
  }

  const hashed = hashToken(refreshToken);

  const [[stored]] = await pool.query(
    `SELECT * FROM refresh_tokens
     WHERE token_hash = ? AND expires_at > NOW()`,
    [hashed]
  );

  if (!stored) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const [[user]] = await pool.query(
    `SELECT id, role, team_id FROM users WHERE id = ?`,
    [stored.user_id]
  );

  const newAccessToken = generateAccessToken(user);

  res.status(200).json(new ApiResponse(200, { accessToken: newAccessToken }));
});

/**
 * LOGOUT
 */
export const logoutUser = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (refreshToken) {
    await pool.query(`DELETE FROM refresh_tokens WHERE token_hash = ?`, [
      hashToken(refreshToken),
    ]);
  }

  res.status(200).json(new ApiResponse(200, null, "Logged out successfully"));
});

/**
 * GET ALL USERS (Manager only)
 */
export const getAllUsers = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT u.id, u.name, u.email, u.role, u.team_id, t.name as team_name 
     FROM users u 
     LEFT JOIN teams t ON u.team_id = t.id 
     ORDER BY u.role, u.name`
  );
  res.status(200).json(new ApiResponse(200, rows));
});

/**
 * UPDATE USER ROLE/TEAM (Manager only)
 */
export const updateUserRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role, teamId } = req.body;

  if (!role) {
    throw new ApiError(400, "Role is required");
  }

  const [result] = await pool.query(
    "UPDATE users SET role = ?, team_id = ? WHERE id = ?",
    [role, teamId || null, id]
  );

  if (result.affectedRows === 0) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json(new ApiResponse(200, null, "User updated successfully"));
});

/**
 * DELETE USER (Manager only)
 */
export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      throw new ApiError(404, "User not found");
    }

    res.status(200).json(new ApiResponse(200, null, "User deleted successfully"));
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      throw new ApiError(400, "Cannot delete user: They have linked records.");
    }
    throw error;
  }
});

/**
 * GET CURRENT PROFILE
 */
export const getProfile = asyncHandler(async (req, res) => {
  const [[user]] = await pool.query(
    "SELECT id, name, email, role, team_id, phone, profile_picture_url, notification_preferences FROM users WHERE id = ?",
    [req.user.id]
  );
  if (!user) throw new ApiError(404, "User not found");
  res.status(200).json(new ApiResponse(200, user));
});

/**
 * UPDATE CURRENT PROFILE
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, profilePictureUrl, notificationPreferences, newPassword } = req.body;
  const userId = req.user.id;

  let query = "UPDATE users SET name = COALESCE(?, name), phone = COALESCE(?, phone), profile_picture_url = COALESCE(?, profile_picture_url), notification_preferences = COALESCE(?, notification_preferences)";
  const params = [name, phone, profilePictureUrl, notificationPreferences ? JSON.stringify(notificationPreferences) : null];

  if (newPassword) {
    if (!passwordRegex.test(newPassword)) {
      throw new ApiError(400, "Password must contain lowercase, uppercase, special character and be at least 8 characters long");
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    query += ", password = ?";
    params.push(hashedPassword);
  }

  query += " WHERE id = ?";
  params.push(userId);

  await pool.query(query, params);

  res.status(200).json(new ApiResponse(200, null, "Profile updated successfully"));
});
