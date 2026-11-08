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
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
