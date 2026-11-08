
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut, ClipboardList, Clock, CheckCircle, AlertCircle } from "lucide-react";
import api from "../services/api";

function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchComplaints = async () => {
    try {
      const response = await api.get("/complaints/admin/all");
      setComplaints(response.data.complaints);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch complaints"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/complaints/${id}/status`, { status });
      await fetchComplaints();
    } catch (err) {
      alert(err.response?.data?.message || "Status update failed");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const stats = [
    {
      title: "Total Complaints",
      value: complaints.length,
      icon: <ClipboardList />,
      className: "stat-total"
    },
    {
      title: "Pending",
      value: complaints.filter(c => c.status === "Pending").length,
      icon: <Clock />,
      className: "stat-pending"
    },
    {
      title: "In Progress",
      value: complaints.filter(c => c.status === "In Progress").length,
      icon: <AlertCircle />,
      className: "stat-progress"
    },
    {
      title: "Resolved",
      value: complaints.filter(c => c.status === "Resolved").length,
      icon: <CheckCircle />,
      className: "stat-resolved"
    }
  ];

  return (
    <div className="admin-page">
      <nav className="admin-navbar">
        <div>
          <h2>Civic<span>Pulse</span></h2>
          <p>Administration Panel</p>
        </div>

        <div className="admin-profile">
          <span>{user?.name || "Administrator"}</span>
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </nav>

      <main className="page-container">
        <div className="admin-heading">
          <div>
            <h1 className="page-heading">Admin Dashboard</h1>
            <p className="page-description">
              Monitor and manage community complaints.
            </p>
          </div>
          <span className="admin-tag">ADMIN PANEL</span>
        </div>

        {loading ? (
          <p>Loading dashboard...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <>
            <section className="stats-grid">
              {stats.map((stat) => (
                <div className="stat-card" key={stat.title}>
                  <div className={`stat-icon ${stat.className}`}>
                    {stat.icon}
                  </div>
                  <p>{stat.title}</p>
                  <h2>{stat.value}</h2>
                </div>
              ))}
            </section>

            <section className="admin-complaints">
              <div className="section-heading">
                <div>
                  <h2>All Complaints</h2>
                  <p>Review and update reported civic issues.</p>
                </div>
                <span>{complaints.length} Reports</span>
              </div>

              {complaints.length === 0 ? (
                <div className="empty-state">
                  No complaints have been reported yet.
                </div>
              ) : (
                <div className="complaint-grid">
                  {complaints.map((complaint) => (
                    <article
                      className="complaint-card"
                      key={complaint._id}
                    >
                      <div className="complaint-top">
                        <span className="category-label">
                          {complaint.category}
                        </span>

                        <span className={`status-badge ${
                          complaint.status === "Pending"
                            ? "status-pending"
                            : complaint.status === "In Progress"
                            ? "status-progress"
                            : complaint.status === "Resolved"
                            ? "status-resolved"
                            : "status-rejected"
                        }`}>
                          {complaint.status}
                        </span>
                      </div>

                      <h3>{complaint.title}</h3>
                      <p>{complaint.description}</p>

                      <div className="complaint-details">
                        <span>Location</span>
                        <strong>{complaint.location}</strong>
                        <span>Reported by</span>
                        <strong>{complaint.user?.name || "Unknown"}</strong>
                      </div>

                      <div className="status-control">
                        <label>Update Status</label>
                        <select
                          value={complaint.status}
                          onChange={(e) =>
                            handleStatusChange(
                              complaint._id,
                              e.target.value
                            )
                          }
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
