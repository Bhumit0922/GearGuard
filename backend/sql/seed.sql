-- ===== TEAMS =====
INSERT INTO teams (id, name) VALUES
(5, 'Mechanical Team'),
(6, 'Electrical Team');


-- ===== USERS =====
-- password for all users: Password@123
-- bcrypt hash (10 rounds)
INSERT INTO users (id, name, email, password, role, team_id) VALUES
(
  25,
  'Manager One',
  'manager@gearguard.com',
  '$2b$10$u0vuWGgEChnwbZK/wh2vUeF3Dr6E9bj38lt0.WdL8U68USOlQ4LS.',
  'manager',
  5
),
(
  26,
  'Technician One',
  'tech1@gearguard.com',
  '$2b$10$u0vuWGgEChnwbZK/wh2vUeF3Dr6E9bj38lt0.WdL8U68USOlQ4LS.',
  'technician',
  5
),
(
  27,
  'User One',
  'user1@gearguard.com',
  '$2b$10$u0vuWGgEChnwbZK/wh2vUeF3Dr6E9bj38lt0.WdL8U68USOlQ4LS.',
  'user',
  NULL
);


-- ===== EQUIPMENT =====
INSERT INTO equipment
(id, name, serial_number, department, location, maintenance_team_id, purchase_date, warranty_expiry, owner_name)
VALUES
(
  7,
  'Hydraulic Press',
  'HP-001',
  'Manufacturing',
  'Plant A',
  5,
  '2023-01-01',
  '2026-01-01',
  'Factory A'
),
(
  8,
  'Conveyor Belt',
  'CB-101',
  'Logistics',
  'Plant B',
  5,
  '2022-06-01',
  '2025-06-01',
  'Factory B'
);


-- ===== MAINTENANCE REQUESTS =====
INSERT INTO maintenance_requests
(id, subject, type, status, equipment_id, team_id, assigned_technician_id, created_by, scheduled_date)
VALUES
(
  11,
  'Oil leakage detected',
  'Corrective',
  'New',
  7,
  5,
  NULL,
  27,
  NULL
),
(
  12,
  'Monthly belt inspection',
  'Preventive',
  'In Progress',
  8,
  5,
  26,
  27,
  '2025-01-15'
);


-- ===== REQUEST LOGS =====
INSERT INTO request_logs
(request_id, old_status, new_status, changed_by)
VALUES
(
  11,
  'New',
  'New',
  27
),
(
  12,
  'New',
  'In Progress',
  25
),
(
  12,
  'In Progress',
  'In Progress',
  26
);

