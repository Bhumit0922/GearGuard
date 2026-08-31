import pool from "../db.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * CREATE TEAM (Manager only)
 */
export const createTeam = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    throw new ApiError(400, "Team name is required");
  }

  // Prevent duplicate teams
  const [[existing]] = await pool.query("SELECT id FROM teams WHERE name = ?", [
    name,
  ]);

  if (existing) {
    throw new ApiError(409, "Team already exists");
  }

  const [result] = await pool.query("INSERT INTO teams (name) VALUES (?)", [
    name,
  ]);

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { id: result.insertId, name },
        "Team created successfully"
      )
    );
});

/**
 * GET ALL TEAMS
 */
export const getAllTeams = asyncHandler(async (req, res) => {
  const [rows] = await pool.query("SELECT id, name FROM teams ORDER BY name");

  res.status(200).json(new ApiResponse(200, rows));
});

export const assignTechnicianToTeam = asyncHandler(async (req, res) => {
  const { teamId } = req.params;
  const { technicianId } = req.body;

  if (!technicianId) {
    throw new ApiError(400, "Technician ID required");
  }

  await pool.query(
    "UPDATE users SET team_id = ? WHERE id = ? AND role = 'technician'",
    [teamId, technicianId]
  );

  res
    .status(200)
    .json(new ApiResponse(200, null, "Technician assigned to team"));
});

/**
 * UPDATE TEAM (Manager only)
 */
export const updateTeam = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    throw new ApiError(400, "Team name is required");
  }

  const [result] = await pool.query(
    "UPDATE teams SET name = ? WHERE id = ?",
    [name, id]
  );

  if (result.affectedRows === 0) {
    throw new ApiError(404, "Team not found");
  }

  res.status(200).json(new ApiResponse(200, null, "Team updated successfully"));
});

/**
 * DELETE TEAM (Manager only)
 */
export const deleteTeam = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Ideally, ensure no users/equipment are linked before deleting,
  // or handle constraint errors cleanly.
  try {
    const [result] = await pool.query("DELETE FROM teams WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      throw new ApiError(404, "Team not found");
    }

    res.status(200).json(new ApiResponse(200, null, "Team deleted successfully"));
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      throw new ApiError(400, "Cannot delete team: There are users or equipment assigned to it.");
    }
    throw error;
  }
});
