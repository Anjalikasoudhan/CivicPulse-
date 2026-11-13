
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  CalendarDays,
  ClipboardList,
  ArrowLeft,
  PlusCircle
} from "lucide-react";
import api from "../services/api";

function MyComplaints() {
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyComplaints = async () => {
      try {
        const response = await api.get("/complaints/my");
        setComplaints(response.data.complaints || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Unable to fetch your complaints."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMyComplaints();
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "status-pending";
      case "In Progress":
        return "status-progress";
      case "Resolved":
        return "status-resolved";
      case "Rejected":
        return "status-rejected";
      default:
        return "";
    }
  };

  return (
    <div className="complaints-page">

      <nav className="citizen-navbar">
        <div>
          <h2>
            Civic<span>Pulse</span>
          </h2>
          <p>Community first. Change together.</p>
        </div>

        <button
          className="view-all-btn"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={17} />
          Dashboard
        </button>
      </nav>

      <main className="page-container">

        <section className="complaints-heading">
          <div>
            <span className="welcome-label">YOUR ACTIVITY</span>
            <h1 className="page-heading">My Complaints</h1>
            <p className="page-description">
              Track the civic issues you have reported and
              monitor their progress.
            </p>
          </div>

          <button
            className="primary-btn"
            onClick={() => navigate("/report-issue")}
          >
            <PlusCircle size={18} />
            Report New Issue
          </button>
        </section>

        {loading ? (
          <div className="empty-state">
            Loading your complaints...
          </div>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : complaints.length === 0 ? (
          <div className="empty-state complaints-empty">
            <ClipboardList size={42} />
            <h3>No complaints yet</h3>
            <p>
              You haven't reported any civic issues.
              Start by reporting a problem in your area.
            </p>

            <button
              className="primary-btn"
              onClick={() => navigate("/report-issue")}
            >
              Report an Issue
            </button>
          </div>
        ) : (
          <>
            <div className="complaints-count">
              Showing {complaints.length} reported complaints
            </div>

            <div className="my-complaints-grid">
              {complaints.map((complaint) => (
                <article
                  className="my-complaint-card"
                  key={complaint._id}
                >
                  <div className="my-complaint-top">
                    <span className="category-label">
                      {complaint.category}
                    </span>

                    <span
                      className={`status-badge ${getStatusClass(
                        complaint.status
                      )}`}
                    >
                      {complaint.status}
                    </span>
                  </div>

                  <h3>{complaint.title}</h3>

                  <p className="my-complaint-description">
                    {complaint.description}
                  </p>

                  <div className="my-complaint-info">
                    <div>
                      <MapPin size={16} />
                      <span>{complaint.location}</span>
                    </div>

                    <div>
                      <CalendarDays size={16} />
                      <span>
                        Reported on{" "}
                        {new Date(
                          complaint.createdAt
                        ).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </span>
                    </div>
                  </div>

                  {/* AI Complaint Analysis */}
                  {complaint.aiStatus === "Completed" &&
                    complaint.aiAnalysis && (
                      <div className="ai-analysis-card">

                        <div className="ai-analysis-heading">
                          <h4>✨ AI Complaint Analysis</h4>
                          <span>AI Analyzed</span>
                        </div>

                        <div className="ai-analysis-details">
                          <div>
                            <strong>Suggested Category</strong>
                            <p>
                              {complaint.aiAnalysis.suggestedCategory}
                            </p>
                          </div>

                          <div>
                            <strong>Priority</strong>
                            <p
                              className={`priority-${complaint.aiAnalysis.priority?.toLowerCase()}`}
                            >
                              {complaint.aiAnalysis.priority}
                            </p>
                          </div>

                          <div>
                            <strong>Assigned Department</strong>
                            <p>
                              {complaint.aiAnalysis.department}
                            </p>
                          </div>
                        </div>

                        <div className="ai-summary">
                          <strong>AI Summary</strong>
                          <p>
                            {complaint.aiAnalysis.summary}
                          </p>
                        </div>

                      </div>
                    )}

                  {complaint.aiStatus === "Failed" && (
                    <p className="ai-unavailable">
                      AI analysis is currently unavailable.
                    </p>
                  )}

                </article>
              ))}
            </div>
          </>
        )}

      </main>
    </div>
  );
}

export default MyComplaints;
