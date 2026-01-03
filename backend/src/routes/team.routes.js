import express from "express";
import { createTeam, getAllTeams } from "../controllers/team.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { assignTechnicianToTeam } from "../controllers/team.controller.js";

const teamRouter = express.Router();

teamRouter.post("/", authenticate, authorize("manager"), createTeam);

teamRouter.get("/", authenticate, getAllTeams);

teamRouter.patch(
  "/:teamId/assign",
  authenticate,
  authorize("manager"),
  assignTechnicianToTeam
);

export default teamRouter;
