
import Complaint from "../models/Complaint.js";
import { analyzeComplaint } from "../services/aiService.js";

// Create complaint with AI analysis and location coordinates
export const createComplaint = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      location,
      latitude,
      longitude
    } = req.body;

    if (!title || !description || !category || !location) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Step 1: Analyze complaint using Groq AI
    console.log("CREATE COMPLAINT CONTROLLER HIT");

    let aiAnalysis = null;
    let aiStatus = "Failed";

    try {
      console.log("Calling Groq AI...");

      aiAnalysis = await analyzeComplaint(title, description);

      console.log("AI RESULT:", aiAnalysis);

      aiStatus = "Completed";
    } catch (aiError) {
      console.error("AI classification failed:", aiError.message);
    }

    // Step 2: Save complaint in MongoDB
    const complaint = await Complaint.create({
      title,
      description,
      category,
      location,
      latitude,
      longitude,
      user: req.user._id,
      aiAnalysis: aiAnalysis || undefined,
      aiStatus
    });

    // Step 3: Send response
    res.status(201).json({
      success: true,
      message: "Complaint submitted successfully",
      complaint
    });

  } catch (error) {
    console.error("Create complaint error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to submit complaint"
    });
  }
};


// Get all complaints
export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      complaints
    });

  } catch (error) {
    console.error("Get complaints error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch complaints"
    });
  }
};


// Get logged-in user's complaints
export const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      user: req.user._id
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      complaints
    });

  } catch (error) {
    console.error("My complaints error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch your complaints"
    });
  }
};


// Update complaint status
export const updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "In Progress",
      "Resolved",
      "Rejected"
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint status"
      });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Complaint status updated successfully",
      complaint
    });

  } catch (error) {
    console.error("Update complaint status error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
