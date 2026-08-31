import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import {
  managerDashboard,
  technicianDashboard,
  userDashboard,
  generateReport
} from "../controllers/dashboard.controller.js";

const dashboardRouter = express.Router();

console.log("✅ Dashboard routes loaded");

dashboardRouter.get(
  "/manager",
  authenticate,
  authorize("manager"),
  managerDashboard
);

dashboardRouter.get(
  "/manager/report",
  authenticate,
  authorize("manager"),
  generateReport
);

dashboardRouter.get(
  "/technician",
  authenticate,
  authorize("technician"),
  technicianDashboard
);

dashboardRouter.get("/user", authenticate, authorize("user"), userDashboard);

export default dashboardRouter;
