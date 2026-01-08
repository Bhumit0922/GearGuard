import pool from "../db.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * MANAGER DASHBOARD
 */
export const managerDashboard = asyncHandler(async (req, res) => {
  const { team_id } = req.user;

  const [[equipmentCount]] = await pool.query(
    `SELECT COUNT(*) as total FROM equipment 
     WHERE maintenance_team_id = ? AND is_scrapped = 0`,
    [team_id]
  );

  const [[openRequests]] = await pool.query(
    `SELECT COUNT(*) as total FROM maintenance_requests
     WHERE team_id = ? AND status IN ('New', 'In Progress')`,
    [team_id]
  );

  const [[completedRequests]] = await pool.query(
    `SELECT COUNT(*) as total FROM maintenance_requests
     WHERE team_id = ? AND status = 'Repaired'`,
    [team_id]
  );

  const [recentRequests] = await pool.query(
    `SELECT id, subject, status, created_at
     FROM maintenance_requests
     WHERE team_id = ?
     ORDER BY created_at DESC
     LIMIT 5`,
    [team_id]
  );

  res.status(200).json(
    new ApiResponse(200, {
      stats: {
        equipment: equipmentCount.total,
        openRequests: openRequests.total,
        completedRequests: completedRequests.total,
      },
      recentRequests,
    })
  );
});

/**
 * TECHNICIAN DASHBOARD
 */
export const technicianDashboard = asyncHandler(async (req, res) => {
  const technicianId = req.user.id;

  // Assigned tasks
  const [[assignedCount]] = await pool.query(
    `SELECT COUNT(*) as total
     FROM maintenance_requests
     WHERE assigned_technician_id = ?`,
    [technicianId]
  );

  // In-progress tasks
  const [[inProgressCount]] = await pool.query(
    `SELECT COUNT(*) as total
     FROM maintenance_requests
     WHERE assigned_technician_id = ?
     AND status = 'In Progress'`,
    [technicianId]
  );

  // Completed tasks
  const [[completedCount]] = await pool.query(
    `SELECT COUNT(*) as total
     FROM maintenance_requests
     WHERE assigned_technician_id = ?
     AND status = 'Repaired'`,
    [technicianId]
  );

  // Recent assigned requests
  const [recentRequests] = await pool.query(
    `SELECT 
      r.id,
      r.subject,
      r.status,
      r.type,
      r.created_at,
      e.name AS equipment_name,
      t.name AS team_name
   FROM maintenance_requests r
   JOIN equipment e ON r.equipment_id = e.id
   JOIN teams t ON r.team_id = t.id
   WHERE r.assigned_technician_id = ?
   ORDER BY r.created_at DESC
   LIMIT 5`,
    [technicianId]
  );

  res.status(200).json(
    new ApiResponse(200, {
      stats: {
        totalAssigned: assignedCount.total,
        inProgress: inProgressCount.total,
        completed: completedCount.total,
        dueToday: 0,
      },
      myRequests: recentRequests,
    })
  );
});

/**
 * USER DASHBOARD
 */
export const userDashboard = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const [[total]] = await pool.query(
    `SELECT COUNT(*) as total FROM maintenance_requests WHERE created_by = ?`,
    [userId]
  );

  const [[open]] = await pool.query(
    `SELECT COUNT(*) as total FROM maintenance_requests
     WHERE created_by = ? AND status IN ('New','In Progress')`,
    [userId]
  );

  const [[completed]] = await pool.query(
    `SELECT COUNT(*) as total FROM maintenance_requests
     WHERE created_by = ? AND status = 'Repaired'`,
    [userId]
  );

  const [myRequests] = await pool.query(
    `SELECT 
      r.id,
      r.subject,
      r.status,
      r.type,
      r.created_at,
      e.name AS equipment_name,
      u.name AS technician_name
    FROM maintenance_requests r
    JOIN equipment e ON r.equipment_id = e.id
    LEFT JOIN users u ON r.assigned_technician_id = u.id
    WHERE r.created_by = ?
`,
    [userId]
  );

  res.status(200).json(
    new ApiResponse(200, {
      stats: {
        total: total.total,
        open: open.total,
        completed: completed.total,
      },
      myRequests,
    })
  );
});
