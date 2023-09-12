import express from "express";
const router = express.Router();

import userRoutes from "./userRoutes";
import authRoutes from "./authRoutes";
import courseCatRoutes from "./courseCatRoutes";
import courseRoutes from "./courseRoutes";
import enrollmentRoutes from "./enrollmentRoutes";
import joinRoutes from "./joinRoutes";
import notification from "./notificationRoutes";
router.use("/api/users", userRoutes);
router.use("/api/auth", authRoutes);
router.use("/api/coursecat", courseCatRoutes);
router.use("/api/course", courseRoutes);
router.use("/api/enrollment", enrollmentRoutes);
router.use("/api/join", joinRoutes);
router.use("/api/notification", notification);

export default router;
