import express from "express";
import { createTeam, getAllTeams, assignTechnicianToTeam, updateTeam, deleteTeam } from "../controllers/team.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const teamRouter = express.Router();

teamRouter.post("/", authenticate, authorize("manager"), createTeam);

teamRouter.get("/", authenticate, getAllTeams);

teamRouter.patch(
  "/:teamId/assign",
  authenticate,
  authorize("manager"),
  assignTechnicianToTeam
);

teamRouter.patch("/:id", authenticate, authorize("manager"), updateTeam);

teamRouter.delete("/:id", authenticate, authorize("manager"), deleteTeam);

export default teamRouter;
