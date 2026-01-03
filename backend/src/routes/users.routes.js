import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

import {
  signupUser,
  loginUser,
  getTechnicians,
  createTechnician,
  refreshAccessToken,
  logoutUser,
} from "../controllers/users.controller.js";

const userRouter = express.Router();

userRouter.post("/signup", signupUser);
userRouter.post("/login", loginUser);

userRouter.post("/refresh", refreshAccessToken);
userRouter.post("/logout", logoutUser);

userRouter.get(
  "/technicians",
  authenticate,
  authorize("manager"),
  getTechnicians
);
userRouter.post(
  "/technicians",
  authenticate,
  authorize("manager"),
  createTechnician
);


export default userRouter;
