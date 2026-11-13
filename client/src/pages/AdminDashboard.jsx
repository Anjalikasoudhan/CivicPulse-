
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ClipboardList,
  CheckCircle,
  Clock,
  LogOut,
  RefreshCw,
  AlertCircle,
  Brain
} from "lucide-react";
import api from "../services/api";

function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/complaints/admin/all");

      setComplaints(response.data.complaints || []);
    } catch (err) {
      console.error("Fetch complaints error:", err);
      setError(
        err.response?.data?.message || "Failed to load complaints"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/complaints/${id}/status`, { status });

      setComplaints((prevComplaints) =>
        prevComplaints.map((complaint) =>
          complaint._id === id
            ? { ...complaint, status }
            : complaint
        )
      );
    } catch (err) {
      console.error("Update status error:", err);
      alert(
        err.response?.data?.message || "Failed to update complaint status"
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const totalComplaints = complaints.length;

  const pendingComplaints = complaints.filter(
    (complaint) => complaint.status === "Pending"
  ).length;

  const inProgressComplaints = complaints.filter(
    (complaint) => complaint.status === "In Progress"
  ).length;

  const resolvedComplaints = complaints.filter(
    (complaint) => complaint.status === "Resolved"
  ).length;

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Manage and monitor community complaints</p>
        </div>

        <div className="admin-header-actions">
          <button onClick={fetchComplaints} className="refresh-btn">
            <RefreshCw size={16} />
            Refresh
          </button>

          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      <section className="admin-stats">
        <div className="admin-stat-card">
          <ClipboardList size={25} />
          <div>
            <h3>{totalComplaints}</h3>
            <p>Total Complaints</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <Clock size={25} />
          <div>
            <h3>{pendingComplaints}</h3>
            <p>Pending</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <AlertCircle size={25} />
          <div>
            <h3>{inProgressComplaints}</h3>
            <p>In Progress</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <CheckCircle size={25} />
          <div>
            <h3>{resolvedComplaints}</h3>
            <p>Resolved</p>
          </div>
        </div>
      </section>

      <section className="admin-complaints-section">
        <div className="admin-section-heading">
          <div>
            <h2>All Complaints</h2>
            <p>Review complaints and update their status</p>
          </div>
        </div>

        {loading ? (
          <p className="admin-message">Loading complaints...</p>
        ) : error ? (
          <p className="admin-error">{error}</p>
        ) : complaints.length === 0 ? (
          <p className="admin-message">No complaints found.</p>
        ) : (
          <div className="admin-complaints-list">
            {complaints.map((complaint) => (
              <div className="admin-complaint-card" key={complaint._id}>
                <div className="admin-complaint-header">
                  <h3>{complaint.title}</h3>
                  <span className={`status-badge status-${complaint.status?.toLowerCase().replace(/\s+/g, "-")}`}>
                    {complaint.status}
                  </span>
                </div>

                <div className="complaint-details">
                  <p>
                    <strong>Description:</strong> {complaint.description}
                  </p>

                  <p>
                    <strong>Category:</strong> {complaint.category}
                  </p>

                  <p>
                    <strong>Location:</strong> {complaint.location}
                  </p>

                  {complaint.user && (
                    <>
                      <p>
                        <strong>Reported by:</strong>{" "}
                        {complaint.user.name || "Unknown"}
                      </p>

                      <p>
                        <strong>Email:</strong>{" "}
                        {complaint.user.email || "Not available"}
                      </p>
                    </>
                  )}

                  <p>
                    <strong>Reported on:</strong>{" "}
                    {complaint.createdAt
                      ? new Date(complaint.createdAt).toLocaleString()
                      : "Not available"}
                  </p>
                </div>

                {/* AI Analysis Section */}
                <div className="ai-analysis-card">
                  <div className="ai-analysis-heading">
                    <h4>
                      <Brain size={18} />
                      AI Analysis
                    </h4>

                    <span>
                      {complaint.aiStatus || "Not Available"}
                    </span>
                  </div>

                  {complaint.aiStatus === "Completed" &&
                  complaint.aiAnalysis ? (
                    <div className="ai-analysis-details">
                      <div>
                        <strong>Suggested Category</strong>
                        <p>
                          {complaint.aiAnalysis.suggestedCategory || "N/A"}
                        </p>
                      </div>

                      <div>
                        <strong>Priority</strong>
                        <p className={`priority-${complaint.aiAnalysis.priority?.toLowerCase()}`}>
                          {complaint.aiAnalysis.priority || "N/A"}
                        </p>
                      </div>

                      <div>
                        <strong>Suggested Department</strong>
                        <p>
                          {complaint.aiAnalysis.department || "N/A"}
                        </p>
                      </div>

                      <div>
                        <strong>AI Summary</strong>
                        <p>
                          {complaint.aiAnalysis.summary || "N/A"}
                        </p>
                      </div>
                    </div>
                  ) : complaint.aiStatus === "Failed" ? (
                    <p className="ai-unavailable">
                      AI analysis is currently unavailable for this complaint.
                    </p>
                  ) : complaint.aiStatus === "Pending" ? (
                    <p className="ai-unavailable">
                      AI analysis is pending.
                    </p>
                  ) : (
                    <p className="ai-unavailable">
                      AI analysis is not available for this complaint.
                    </p>
                  )}
                </div>

                {/* Update Complaint Status */}
                <div className="admin-status-control">
                  <label htmlFor={`status-${complaint._id}`}>
                    Update Status
                  </label>

                  <select
                    id={`status-${complaint._id}`}
                    value={complaint.status}
                    onChange={(e) =>
                      updateStatus(complaint._id, e.target.value)
                    }
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default AdminDashboard;
