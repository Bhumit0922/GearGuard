import pool from "../db.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { logRequestStatusChange } from "../utils/auditLogger.js";
/**
 * Create new equipment
 */
export const createEquipment = asyncHandler(async (req, res) => {
  const {
    name,
    serialNumber,
    department,
    location,
    maintenanceTeamId,
    purchaseDate,
    warrantyExpiry,
    ownerName,
    pmFrequencyDays
  } = req.body;

  if (!name || !serialNumber || !maintenanceTeamId) {
    throw new ApiError(400, "Required fields are missing");
  }

  if (req.user.role === "manager" && Number(maintenanceTeamId) !== req.user.team_id) {
    throw new ApiError(403, "You can only assign equipment to your own maintenance team");
  }

  if (purchaseDate && warrantyExpiry) {
    if (new Date(warrantyExpiry) < new Date(purchaseDate)) {
      throw new ApiError(400, "Warranty expiry cannot be before purchase date");
    }
  }

  const [result] = await pool.query(
    `INSERT INTO equipment
   (name, serial_number, department, location, maintenance_team_id,
    purchase_date, warranty_expiry, owner_name, pm_frequency_days)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      name,
      serialNumber,
      department,
      location,
      maintenanceTeamId,
      purchaseDate || null,
      warrantyExpiry || null,
      ownerName || null,
      pmFrequencyDays || null
    ]
  );

  res
    .status(201)
    .json(new ApiResponse(201, { id: result.insertId }, "Equipment created"));
});

/**
 * Get all equipment
 */
export const getAllEquipment = asyncHandler(async (req, res) => {
  const { role, team_id } = req.user;
  const { search, department, location, teamId, hasWarranty } = req.query;

  let query = `
    SELECT
      e.id,
      e.name,
      e.serial_number,
      e.department,
      e.location,
      e.warranty_expiry,
      e.maintenance_team_id,
      e.pm_frequency_days,
      e.last_maintenance_date,
      e.next_maintenance_date,
      t.name AS team_name
    FROM equipment e
    JOIN teams t ON e.maintenance_team_id = t.id
    WHERE IFNULL(e.is_scrapped, 0) = 0
  `;
  const values = [];

  // Managers & technicians see only their team equipment
  if (role === "manager" || role === "technician") {
    query += " AND e.maintenance_team_id = ?";
    values.push(team_id);
  } else if (teamId) {
    query += " AND e.maintenance_team_id = ?";
    values.push(teamId);
  }

  if (search) {
    query += " AND (e.name LIKE ? OR e.serial_number LIKE ?)";
    values.push(`%${search}%`, `%${search}%`);
  }
  
  if (department) {
    query += " AND e.department = ?";
    values.push(department);
  }

  if (location) {
    query += " AND e.location = ?";
    values.push(location);
  }

  if (hasWarranty === "true") {
    query += " AND e.warranty_expiry >= CURDATE()";
  } else if (hasWarranty === "false") {
    query += " AND (e.warranty_expiry < CURDATE() OR e.warranty_expiry IS NULL)";
  }

  const [rows] = await pool.query(query, values);

  const enriched = rows.map((e) => ({
    ...e,
    isUnderWarranty:
      e.warranty_expiry && new Date(e.warranty_expiry) >= new Date(),
  }));

  res.status(200).json(new ApiResponse(200, enriched));
});

/**
 * Get equipment by ID
 */
export const getEquipmentById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [[equipment]] = await pool.query(
    `SELECT * FROM equipment WHERE id = ?`,
    [id]
  );

  if (!equipment) {
    throw new ApiError(404, "Equipment not found");
  }

  const isUnderWarranty =
    equipment.warranty_expiry &&
    new Date(equipment.warranty_expiry) >= new Date();

  res.status(200).json(
    new ApiResponse(200, {
      ...equipment,
      isUnderWarranty,
    })
  );
});

/**
 * SCRAP EQUIPMENT
 * → Auto scrap all active maintenance requests
 */
export const scrapEquipment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  // 1️⃣ Scrap the equipment
  const [equipmentResult] = await pool.query(
    `UPDATE equipment 
     SET is_scrapped = true 
     WHERE id = ? AND is_scrapped = false`,
    [id]
  );

  if (equipmentResult.affectedRows === 0) {
    throw new ApiError(404, "Equipment not found or already scrapped");
  }

  // 2️⃣ Get all ACTIVE requests linked to this equipment
  const [activeRequests] = await pool.query(
    `SELECT id, status
     FROM maintenance_requests
     WHERE equipment_id = ?
       AND status IN ('New', 'In Progress')`,
    [id]
  );

  // 3️⃣ Scrap each request + audit log
  for (const request of activeRequests) {
    await pool.query(
      `UPDATE maintenance_requests
       SET status = 'Scrap'
       WHERE id = ?`,
      [request.id]
    );

    await logRequestStatusChange({
      requestId: request.id,
      oldStatus: request.status,
      newStatus: "Scrap",
      userId,
    });
  }

  res.status(200).json(
    new ApiResponse(
      200,
      {
        closedRequests: activeRequests.length,
      },
      "Equipment and related requests scrapped successfully"
    )
  );
});

/**
 * ASSIGN EQUIPMENT TO TEAM (Manager only)
 */
export const assignEquipmentTeam = asyncHandler(async (req, res) => {
  const { id } = req.params; // equipment id
  const { teamId } = req.body;

  if (!teamId) {
    throw new ApiError(400, "Team ID is required");
  }

  // 1️⃣ Check equipment exists & not scrapped
  const [[equipment]] = await pool.query(
    `SELECT id, is_scrapped FROM equipment WHERE id = ?`,
    [id]
  );

  if (!equipment) {
    throw new ApiError(404, "Equipment not found");
  }

  if (equipment.is_scrapped) {
    throw new ApiError(400, "Cannot assign team to scrapped equipment");
  }

  // 2️⃣ Check team exists
  const [[team]] = await pool.query(`SELECT id FROM teams WHERE id = ?`, [
    teamId,
  ]);

  if (!team) {
    throw new ApiError(404, "Team not found");
  }

  // 3️⃣ Update equipment
  await pool.query(
    `UPDATE equipment SET maintenance_team_id = ? WHERE id = ?`,
    [teamId, id]
  );

  res
    .status(200)
    .json(
      new ApiResponse(200, null, "Equipment assigned to team successfully")
    );
});

/**
 * UPDATE EQUIPMENT (Manager only)
 */
export const updateEquipment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    name,
    serialNumber,
    department,
    location,
    maintenanceTeamId,
    purchaseDate,
    warrantyExpiry,
    ownerName,
    pmFrequencyDays
  } = req.body;

  if (!name || !serialNumber || !maintenanceTeamId) {
    throw new ApiError(400, "Required fields are missing");
  }

  const [[equipment]] = await pool.query("SELECT * FROM equipment WHERE id = ?", [id]);
  if (!equipment) {
    throw new ApiError(404, "Equipment not found");
  }

  if (req.user.role === "manager") {
    if (equipment.maintenance_team_id !== req.user.team_id) {
      throw new ApiError(403, "You are not authorized to modify this equipment");
    }
    if (Number(maintenanceTeamId) !== req.user.team_id) {
      throw new ApiError(403, "You can only assign equipment to your own team");
    }
  }

  const [result] = await pool.query(
    `UPDATE equipment
     SET name = ?, serial_number = ?, department = ?, location = ?,
         maintenance_team_id = ?, purchase_date = ?, warranty_expiry = ?, owner_name = ?,
         pm_frequency_days = ?
     WHERE id = ?`,
    [
      name,
      serialNumber,
      department,
      location,
      maintenanceTeamId,
      purchaseDate || null,
      warrantyExpiry || null,
      ownerName || null,
      pmFrequencyDays || null,
      id
    ]
  );

  if (result.affectedRows === 0) {
    throw new ApiError(404, "Equipment not found");
  }

  res.status(200).json(new ApiResponse(200, null, "Equipment updated"));
});

/**
 * DELETE EQUIPMENT (Manager only)
 */
export const deleteEquipment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [[equipment]] = await pool.query("SELECT * FROM equipment WHERE id = ?", [id]);
  if (!equipment) {
    throw new ApiError(404, "Equipment not found");
  }

  if (req.user.role === "manager" && equipment.maintenance_team_id !== req.user.team_id) {
    throw new ApiError(403, "You are not authorized to delete this equipment");
  }

  const [result] = await pool.query(`DELETE FROM equipment WHERE id = ?`, [id]);

  if (result.affectedRows === 0) {
    throw new ApiError(404, "Equipment not found");
  }

  res.status(200).json(new ApiResponse(200, null, "Equipment deleted"));
});

/**
 * GET EQUIPMENT HISTORY
 */
export const getEquipmentHistory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [[equipment]] = await pool.query("SELECT * FROM equipment WHERE id = ?", [id]);
  if (!equipment) {
    throw new ApiError(404, "Equipment not found");
  }

  if (req.user.role === "manager" && equipment.maintenance_team_id !== req.user.team_id) {
    throw new ApiError(403, "You are not authorized to view this equipment");
  }

  const [history] = await pool.query(
    `SELECT
      r.id,
      r.subject,
      r.type,
      r.status,
      r.priority,
      r.created_at,
      r.completed_at,
      r.duration_hours,
      r.labor_cost,
      r.parts_cost,
      u.name AS technician_name
     FROM maintenance_requests r
     LEFT JOIN users u ON r.assigned_technician_id = u.id
     WHERE r.equipment_id = ?
     ORDER BY r.created_at DESC`,
    [id]
  );

  res.status(200).json(new ApiResponse(200, history));
});

