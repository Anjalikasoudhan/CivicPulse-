import Complaint from "../models/Complaint.js";

// Create complaint
export const createComplaint = async (req, res) => {
  try {
    const { title, description, category, location } = req.body;

    if (!title || !description || !category || !location) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const complaint = await Complaint.create({
      title,
      description,
      category,
      location,
      user: req.user._id
    });

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