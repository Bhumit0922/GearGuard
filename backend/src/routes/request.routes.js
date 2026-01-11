import express from "express";
import {
  createRequest,
  getAllRequests,
  getRequestsByEquipment,
  assignTechnician,
  updateRequestStatus,
  completeRequest,
  scrapRequest,
  getPreventiveCalendar,
  getRequestById,
  getRequestLogs,
} from "../controllers/request.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { reschedulePreventive } from "../controllers/request.controller.js";

const requestRoute = express.Router();

requestRoute.post("/", authenticate, createRequest);
requestRoute.get("/", authenticate, getAllRequests);

requestRoute.get(
  "/equipment/:equipmentId",
  authenticate,
  getRequestsByEquipment
);

requestRoute.get(
  "/calendar",
  authenticate,
  authorize("manager", "technician"),
  getPreventiveCalendar
);

requestRoute.patch(
  "/:id/assign",
  authenticate,
  authorize("manager"),
  assignTechnician
);
requestRoute.patch(
  "/:id/status",
  authenticate,
  authorize("manager", "technician"),
  updateRequestStatus
);
requestRoute.patch(
  "/:id/complete",
  authenticate,
  authorize("technician"),
  completeRequest
);
requestRoute.patch(
  "/:id/scrap",
  authenticate,
  authorize("manager"),
  scrapRequest
);

requestRoute.patch(
  "/:id/reschedule",
  authenticate,
  authorize("manager"),
  reschedulePreventive
);

requestRoute.get("/:id/logs", authenticate, getRequestLogs);
requestRoute.get("/:id", authenticate, getRequestById);

export default requestRoute;
