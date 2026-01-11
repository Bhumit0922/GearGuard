import pool from "../db.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { logRequestStatusChange } from "../utils/auditLogger.js";
import { createNotification } from "../utils/notification.js";

const FINAL_STATUSES = ["Repaired", "Scrap"];

const ALLOWED_TRANSITIONS = {
  New: ["In Progress"],
  "In Progress": ["Repaired", "Scrap"],
};

/**
 * CREATE MAINTENANCE REQUEST
 * Flow: Breakdown / Preventive
 */
export const createRequest = asyncHandler(async (req, res) => {
  const { subject, type, equipmentId, scheduledDate } = req.body;
  const userId = req.user.id;

  if (!subject || !type || !equipmentId) {
    throw new ApiError(400, "Required fields are missing");
  }

  // 🔴 Auto-fill logic (Equipment → Team)
  // NOTE: This will work once equipment table exists
  const [[equipment]] = await pool.query(
    `SELECT maintenance_team_id FROM equipment WHERE id = ?`,
    [equipmentId]
  );

  if (!equipment) {
    throw new ApiError(404, "Equipment not found");
  }

  const maintenanceTeamId = equipment.maintenance_team_id;

  // Default values
  const status = "New";

  // Insert request
  const [result] = await pool.query(
    `INSERT INTO maintenance_requests
    (subject, type, status, equipment_id, team_id, scheduled_date, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      subject,
      type,
      status,
      equipmentId,
      maintenanceTeamId,
      scheduledDate || null,
      userId,
    ]
  );

  // 🔔 Notify manager(s) of the team
  const [managers] = await pool.query(
    `SELECT id FROM users WHERE role = 'manager' AND team_id = ?`,
    [maintenanceTeamId]
  );

  for (const m of managers) {
    await createNotification({
      userId: m.id,
      title: "New maintenance request",
      message: `New request created: "${subject}"`,
    });
  }

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { requestId: result.insertId },
        "Maintenance request created"
      )
    );
});

/**
 * GET ALL REQUESTS (Kanban View)
 */

export const getAllRequests = asyncHandler(async (req, res) => {
  const { status, type } = req.query;
  const { role, team_id, id } = req.user;

  let query = `
  SELECT
    r.id,
    r.subject,
    r.status,
    r.type,
    r.created_at,
    e.name AS equipment_name,
    t.name AS team_name,
    u.name AS technician_name
  FROM maintenance_requests r
  JOIN equipment e ON r.equipment_id = e.id
  JOIN teams t ON r.team_id = t.id
  LEFT JOIN users u ON r.assigned_technician_id = u.id
  WHERE 1=1
`;
  const values = [];

  if (role === "user") {
    query += " AND r.created_by = ?";
    values.push(id);
  }

  if (role === "manager" || role === "technician") {
    query += " AND r.team_id = ?";
    values.push(team_id);
  }

  if (status) {
    query += " AND r.status = ?";
    values.push(status);
  }

  if (type) {
    query += " AND r.type = ?";
    values.push(type);
  }

  query += " ORDER BY r.created_at DESC";

  const [rows] = await pool.query(query, values);

  res.status(200).json(new ApiResponse(200, rows));
});

/**
 * GET REQUESTS BY EQUIPMENT (Smart Button)
 */
export const getRequestsByEquipment = asyncHandler(async (req, res) => {
  const { equipmentId } = req.params;

  if (req.user.role === "user") {
    const [rows] = await pool.query(
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
  WHERE r.equipment_id = ?
    AND r.created_by = ?
  ORDER BY r.created_at DESC
`,
      [equipmentId, req.user.id]
    );

    return res.status(200).json(new ApiResponse(200, rows));
  }

  const [rows] = await pool.query(
    `SELECT
      r.id,
      r.subject,
      r.status,
      r.type,
      r.created_at,
      e.name AS equipment_name,
      u.name AS technician_name,
      t.name AS team_name
   FROM maintenance_requests r
   JOIN equipment e ON r.equipment_id = e.id
   JOIN teams t ON r.team_id = t.id
   LEFT JOIN users u ON r.assigned_technician_id = u.id
   WHERE r.equipment_id = ?
     AND r.team_id = ?
   ORDER BY r.created_at DESC
  `,
    [equipmentId, req.user.team_id]
  );

  res.status(200).json(new ApiResponse(200, rows));
});

/**
 * ASSIGN TECHNICIAN
 */
export const assignTechnician = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { technicianId } = req.body;

  if (req.user.role !== "manager") {
    throw new ApiError(403, "Only manager can assign technician");
  }

  if (!technicianId) {
    throw new ApiError(400, "Technician ID is required");
  }

  const [[request]] = await pool.query(
    "SELECT * FROM maintenance_requests WHERE id = ?",
    [id]
  );

  if (!request) {
    throw new ApiError(404, "Request not found");
  }

  if (FINAL_STATUSES.includes(request.status)) {
    throw new ApiError(
      400,
      "Cannot assign technician to completed or scrapped request"
    );
  }

  if (request.assigned_technician_id) {
    throw new ApiError(400, "Technician already assigned");
  }

  if (req.user.team_id !== request.team_id) {
    throw new ApiError(403, "Not authorized");
  }

  const [[technician]] = await pool.query(
    `SELECT id FROM users
     WHERE id = ? AND role = 'technician' AND team_id = ?`,
    [technicianId, req.user.team_id]
  );

  if (!technician) {
    throw new ApiError(400, "Invalid technician for this team");
  }

  await pool.query(
    `UPDATE maintenance_requests
     SET assigned_technician_id = ?
     WHERE id = ?`,
    [technicianId, id]
  );

  await createNotification({
    userId: technicianId,
    title: "New task assigned",
    message: `You have been assigned to request: ${request.subject}`,
  });

  res.status(200).json(new ApiResponse(200, null, "Technician assigned"));
});

/**
 * UPDATE REQUEST STATUS (Kanban Drag & Drop)
 */
export const updateRequestStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const [[request]] = await pool.query(
    "SELECT * FROM maintenance_requests WHERE id = ?",
    [id]
  );

  if (!request) {
    throw new ApiError(404, "Request not found");
  }

  if (FINAL_STATUSES.includes(request.status)) {
    throw new ApiError(
      400,
      "Cannot change status of completed or scrapped request"
    );
  }

  if (req.user.team_id !== request.team_id) {
    throw new ApiError(403, "Not authorized");
  }

  if (req.user.role === "technician") {
    if (request.assigned_technician_id !== req.user.id) {
      throw new ApiError(403, "You are not assigned to this request");
    }
    if (status === "Scrap") {
      throw new ApiError(403, "Technician cannot scrap request");
    }
  }

  if (!ALLOWED_TRANSITIONS[request.status]?.includes(status)) {
    throw new ApiError(400, "Invalid status transition");
  }

  const oldStatus = request.status;

  const [result] = await pool.query(
    `UPDATE maintenance_requests
     SET status = ?
     WHERE id = ? AND status = ?`,
    [status, id, oldStatus]
  );

  if (result.affectedRows === 0) {
    throw new ApiError(409, "Request was modified concurrently");
  }

  // ✅ AUDIT LOG AFTER SUCCESS
  await logRequestStatusChange({
    requestId: id,
    oldStatus,
    newStatus: status,
    userId: req.user.id,
  });

  await createNotification({
    userId: request.created_by,
    title: "Request status updated",
    message: `Your request "${request.subject}" move to "${status}"`,
  });

  res.status(200).json(new ApiResponse(200, null, "Status updated"));
});

/**
 * COMPLETE REQUEST (Repaired)
 */
export const completeRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { durationHours } = req.body;

  if (!durationHours) {
    throw new ApiError(400, "Duration is required");
  }

  const [[request]] = await pool.query(
    "SELECT * FROM maintenance_requests WHERE id = ?",
    [id]
  );

  if (!request) {
    throw new ApiError(404, "Request not found");
  }

  if (FINAL_STATUSES.includes(request.status)) {
    throw new ApiError(400, "Request already completed or scrapped");
  }

  if (request.status !== "In Progress") {
    throw new ApiError(400, "Only in-progress requests can be completed");
  }

  if (req.user.team_id !== request.team_id) {
    throw new ApiError(403, "Not authorized");
  }

  if (req.user.id !== request.assigned_technician_id) {
    throw new ApiError(
      403,
      "Only assigned technician can complete this request"
    );
  }

  const oldStatus = request.status;

  await pool.query(
    `UPDATE maintenance_requests
     SET status = 'Repaired', duration_hours = ?
     WHERE id = ?`,
    [durationHours, id]
  );

  // ✅ AUDIT LOG
  await logRequestStatusChange({
    requestId: id,
    oldStatus,
    newStatus: "Repaired",
    userId: req.user.id,
  });

  // Notify user
  await createNotification({
    userId: request.created_by,
    title: "Request Completed",
    message: `Your request "${request.subject}" has been completed`,
  });

  // Notify manager(s)
  const [managers] = await pool.query(
    `SELECT id FROM users WHERE role = 'manager' AND team_id = ?`,
    [request.team_id]
  );

  for (const m of managers) {
    await createNotification({
      userId: m.id,
      title: "Request completed",
      message: `Request "${request.subject}" has been completed`,
    });
  }

  res.status(200).json(new ApiResponse(200, null, "Request completed"));
});

/**
 * SCRAP REQUEST (AND EQUIPMENT)
 */
export const scrapRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (req.user.role !== "manager") {
    throw new ApiError(403, "Only manager can scrap requests");
  }

  const [[request]] = await pool.query(
    "SELECT * FROM maintenance_requests WHERE id = ?",
    [id]
  );

  if (!request) {
    throw new ApiError(404, "Request not found");
  }

  if (FINAL_STATUSES.includes(request.status)) {
    throw new ApiError(400, "Request already completed or scrapped");
  }

  if (req.user.team_id !== request.team_id) {
    throw new ApiError(403, "Not authorized");
  }

  const oldStatus = request.status;

  await pool.query(
    "UPDATE maintenance_requests SET status = 'Scrap' WHERE id = ?",
    [id]
  );

  await pool.query("UPDATE equipment SET is_scrapped = true WHERE id = ?", [
    request.equipment_id,
  ]);

  // ✅ AUDIT LOG
  await logRequestStatusChange({
    requestId: id,
    oldStatus,
    newStatus: "Scrap",
    userId: req.user.id,
  });

  // Notify user
  await createNotification({
    userId: request.created_by,
    title: "Request scrapped",
    message: `Your request "${request.subject}" has been scrapped`,
  });

  // Notify technician if assigned
  if (request.assigned_technician_id) {
    await createNotification({
      userId: request.assigned_technician_id,
      title: "Request scrapped",
      message: `Request "${request.subject}" was scrapped`,
    });
  }

  res
    .status(200)
    .json(new ApiResponse(200, null, "Request and equipment scrapped"));
});

/**
 * CALENDAR VIEW (Preventive Only)
 */
export const getPreventiveCalendar = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT
        r.id,
        r.subject,
        r.status,
        r.scheduled_date,
        e.name AS equipment_name
     FROM maintenance_requests r
     JOIN equipment e ON r.equipment_id = e.id
     WHERE r.type = 'Preventive'
       AND r.team_id = ?
     ORDER BY r.scheduled_date ASC
    `,
    [req.user.team_id]
  );

  res.status(200).json(new ApiResponse(200, rows));
});

export const getRequestLogs = asyncHandler(async (req, res) => {
  const { requestId } = req.params;

  const [logs] = await pool.query(
    `SELECT rl.*, u.name AS changed_by_name
     FROM request_logs rl
     JOIN users u ON rl.changed_by = u.id
     WHERE rl.request_id = ?
     ORDER BY rl.changed_at ASC`,
    [requestId]
  );

  res.status(200).json(new ApiResponse(200, logs));
});

/**
 * GET SINGLE REQUEST DETAILS (User / Technician / Manager)
 */
export const getRequestById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role, id: userId, team_id } = req.user;

  // 1️⃣ Fetch request with equipment info
  const [[request]] = await pool.query(
    `SELECT 
      r.*,
      e.name AS equipment_name,
      tech.name AS technician_name,
      t.name AS team_name,
      creator.name AS created_by_name
    FROM maintenance_requests r
    JOIN equipment e ON r.equipment_id = e.id
    LEFT JOIN users tech ON r.assigned_technician_id = tech.id
    JOIN teams t ON r.team_id = t.id
    JOIN users creator ON r.created_by = creator.id
    WHERE r.id = ?
    `,
    [id]
  );

  if (!request) {
    throw new ApiError(404, "Request not found");
  }

  // 2️⃣ Authorization rules
  if (role === "user" && request.created_by !== userId) {
    throw new ApiError(403, "Not authorized to view this request");
  }

  if (role === "technician" && request.assigned_technician_id !== userId) {
    throw new ApiError(403, "Not assigned to this request");
  }

  if (role === "manager" && request.team_id !== team_id) {
    throw new ApiError(403, "Not authorized for this team");
  }

  // 3️⃣ Fetch audit logs
  const [logs] = await pool.query(
    `
    SELECT 
      rl.id,
      rl.old_status,
      rl.new_status,
      rl.changed_at,
      u.name AS changed_by_name
    FROM request_logs rl
    JOIN users u ON rl.changed_by = u.id
    WHERE rl.request_id = ?
    ORDER BY rl.changed_at ASC
    `,
    [id]
  );

  // 4️⃣ Final response
  res.status(200).json(
    new ApiResponse(200, {
      ...request,
      logs,
    })
  );
});
