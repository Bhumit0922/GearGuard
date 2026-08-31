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

  const [[scrappedRequests]] = await pool.query(
    `SELECT COUNT(*) as total FROM maintenance_requests
     WHERE team_id = ? AND status = 'Scrap'`,
    [team_id]
  );

  const [[preventiveDue]] = await pool.query(
    `SELECT COUNT(*) as total FROM maintenance_requests
     WHERE team_id = ? AND type = 'Preventive' AND scheduled_date >= CURDATE() AND scheduled_date <= DATE_ADD(CURDATE(), INTERVAL 7 DAY) AND status NOT IN ('Repaired', 'Scrap')`,
    [team_id]
  );

  const [[overdueRequests]] = await pool.query(
    `SELECT COUNT(*) as total FROM maintenance_requests
     WHERE team_id = ? AND status NOT IN ('Repaired', 'Scrap') AND (scheduled_date < CURDATE() OR due_at < NOW())`,
    [team_id]
  );

  const [technicianWorkload] = await pool.query(
    `SELECT 
      u.id, 
      u.name, 
      COUNT(r.id) AS assigned_tasks,
      SUM(CASE WHEN r.status = 'In Progress' THEN 1 ELSE 0 END) AS in_progress_tasks,
      SUM(CASE WHEN r.status = 'Repaired' THEN 1 ELSE 0 END) AS completed_tasks,
      SUM(CASE WHEN r.status NOT IN ('Repaired', 'Scrap') AND (r.scheduled_date < CURDATE() OR r.due_at < NOW()) THEN 1 ELSE 0 END) AS overdue_tasks
     FROM users u
     LEFT JOIN maintenance_requests r ON u.id = r.assigned_technician_id
     WHERE u.team_id = ? AND u.role = 'technician'
     GROUP BY u.id, u.name`,
    [team_id]
  );

  const [recentRequests] = await pool.query(
    `SELECT id, subject, status, priority, type, created_at, due_at
     FROM maintenance_requests
     WHERE team_id = ?
     ORDER BY created_at DESC
     LIMIT 5`,
    [team_id]
  );

  // Team info
  const [[team]] = await pool.query(`SELECT name FROM teams WHERE id = ?`, [
    team_id,
  ]);

  // Technician count
  const [[technicianCount]] = await pool.query(
    `SELECT COUNT(*) as total 
   FROM users 
   WHERE role = 'technician' AND team_id = ?`,
    [team_id]
  );

  res.status(200).json(
    new ApiResponse(200, {
      team: {
        id: team_id,
        name: team?.name || "Unknown Team",
        technicianCount: technicianCount.total,
      },
      stats: {
        equipment: equipmentCount.total,
        openRequests: openRequests.total,
        completedRequests: completedRequests.total,
        scrappedRequests: scrappedRequests.total,
        preventiveDue: preventiveDue.total,
        overdueRequests: overdueRequests.total,
      },
      technicianWorkload,
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

/**
 * EXPORT MAINTENANCE REPORT (Manager Only)
 */
export const generateReport = asyncHandler(async (req, res) => {
  const { team_id } = req.user;

  const [requests] = await pool.query(
    `SELECT 
      r.id AS "Request ID",
      e.name AS "Equipment",
      r.type AS "Type",
      r.status AS "Status",
      r.priority AS "Priority",
      u.name AS "Technician",
      r.duration_hours AS "Duration",
      r.labor_cost AS "Labor Cost",
      r.parts_cost AS "Parts Cost",
      DATE_FORMAT(r.created_at, '%Y-%m-%d %H:%i:%s') AS "Created At",
      DATE_FORMAT(r.completed_at, '%Y-%m-%d %H:%i:%s') AS "Completed At"
     FROM maintenance_requests r
     JOIN equipment e ON r.equipment_id = e.id
     LEFT JOIN users u ON r.assigned_technician_id = u.id
     WHERE r.team_id = ?
     ORDER BY r.created_at DESC`,
    [team_id]
  );

  res.status(200).json(new ApiResponse(200, requests));
});
