import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import userRouter from "./routes/users.routes.js";
import equipmentRouter from "./routes/equipment.routes.js";
import requestRoute from "./routes/request.routes.js";
import teamRouter from "./routes/team.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";
import notificationRouter from "./routes/notification.routes.js";
import { bootstrapAdmin } from "./utils/bootstrapAdmin.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();
console.log("✅ App booting...");
await bootstrapAdmin();

app.use(helmet());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
});

app.use(cors());
app.use(express.json());

app.use("/api/users", authLimiter, userRouter);
app.use("/api/equipment", equipmentRouter);
app.use("/api/requests", requestRoute);
app.use("/api/teams", teamRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/notifications", notificationRouter);

// Health check (optional but nice)
app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "API is running" });
});

// Global error handler (must be LAST)
app.use(errorHandler);

export default app;
