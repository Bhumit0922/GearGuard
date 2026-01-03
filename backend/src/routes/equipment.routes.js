import express from "express";
import {
  createEquipment,
  getAllEquipment,
  getEquipmentById,
  scrapEquipment,
  assignEquipmentTeam,
} from "../controllers/equipment.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const equipmentRouter = express.Router();

equipmentRouter.post("/", authenticate, authorize("manager"), createEquipment);

// equipmentRouter.get("/", getAllEquipment);

equipmentRouter.patch(
  "/:id/scrap",
  authenticate,
  authorize("manager"),
  scrapEquipment
);
equipmentRouter.patch(
  "/:id/assign-team",
  authenticate,
  authorize("manager"),
  assignEquipmentTeam
);

equipmentRouter.get("/", authenticate, getAllEquipment);
equipmentRouter.get("/:id", getEquipmentById);

export default equipmentRouter;
