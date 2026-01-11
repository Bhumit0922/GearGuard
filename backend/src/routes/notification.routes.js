import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  getMyNotifications,
  markNotificationRead,
} from "../controllers/notification.controller.js";

const notificationRouter = express.Router();

notificationRouter.get("/", authenticate, getMyNotifications);
notificationRouter.patch("/:id/read", authenticate, markNotificationRead);

export default notificationRouter;
