import express from "express";

import {
  createComplaint,
  getAllComplaints,
  getMyComplaints
} from "../controllers/complaintController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require login
router.use(protect);

router.post("/", createComplaint);

router.get("/", getAllComplaints);

router.get("/my", getMyComplaints);

export default router;