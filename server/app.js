import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";

const app = express();

// Middleware
app.use(cors({
    origin: "http://localhost:5173"
}));

app.use(express.json());

// Routes
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
export default app;