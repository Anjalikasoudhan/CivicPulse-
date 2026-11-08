import express from "express";

import {
  createComplaint,
  getAllComplaints,
  getMyComplaints,
  updateComplaintStatus
} from "../controllers/complaintController.js";

import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/", createComplaint);
router.get("/", getAllComplaints);
router.get("/my", getMyComplaints);

// Admin routes
router.get("/admin/all", adminOnly, getAllComplaints);
router.put("/:id/status", adminOnly, updateComplaintStatus);

export default router;