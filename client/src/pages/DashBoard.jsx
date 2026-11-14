
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  LogOut,
  PlusCircle,
  ClipboardList,
  FileText,
  CheckCircle,
  Clock,
  ArrowRight,
  MapPin,
  Map
} from "lucide-react";
import api from "../services/api";

function DashBoard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    const fetchMyComplaints = async () => {
      try {
        const response = await api.get("/complaints/my");
        setComplaints(response.data.complaints || []);
      } catch (error) {
        console.error("Failed to fetch complaints:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyComplaints();
  }, []);

  const stats = [
    {
      title: "Total Complaints",
      value: complaints.length,
      icon: <ClipboardList size={22} />,
      className: "stat-total"
    },
    {
      title: "Pending",
      value: complaints.filter(c => c.status === "Pending").length,
      icon: <Clock size={22} />,
      className: "stat-pending"
    },
    {
      title: "In Progress",
      value: complaints.filter(c => c.status === "In Progress").length,
      icon: <FileText size={22} />,
      className: "stat-progress"
    },
    {
      title: "Resolved",
      value: complaints.filter(c => c.status === "Resolved").length,
      icon: <CheckCircle size={22} />,
      className: "stat-resolved"
    }
  ];

  const recentComplaints = complaints.slice(0, 3);

  const quickActions = [
    {
      title: "Report an Issue",
      description: "Report a new problem in your area.",
      label: "Get started",
      image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=700&q=80",
      path: "/report-issue"
    },
    {
      title: "All Complaints",
      description: "Explore issues reported by citizens.",
      label: "Explore",
      image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=700&q=80",
      path: "/all-complaints"
    },
    {
      title: "My Complaints",
      description: "Track the progress of your reports.",
      label: "View reports",
      image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=700&q=80",
      path: "/my-complaints"
    },
    {
      title: "Community Map",
      description: "Explore civic issues reported across your community.",
      label: "View map",
      image: "https://as2.ftcdn.net/v2/jpg/10/01/92/27/1000_F_1001922727_VqWMQoMO1QL1ldA2ZRWgWTgS5kkENChz.jpg",
      path: "/complaint-map"
    }
  ];

  return (
    <div className="citizen-dashboard">

      {/* Navbar */}
      <nav className="citizen-navbar">
        <div>
          <h2>
            Civic<span>Pulse</span>
          </h2>
          <p>Community first. Change together.</p>
        </div>

        <div className="citizen-nav-right">
          <span>{user?.name}</span>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </nav>

      <main className="page-container">

        {/* Visual Welcome Banner */}
        <section className="dashboard-visual-hero">
          <img
            src="https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1800&q=85"
            alt="Modern city buildings"
          />

          <div className="dashboard-hero-overlay" />

          <div className="dashboard-hero-content">
            <span className="dashboard-hero-label">
              <MapPin size={15} />
              CITIZEN DASHBOARD
            </span>

            <h1>
              Welcome back, {user?.name?.split(" ")[0]}!
            </h1>

            <p>
              Your voice matters. Report civic issues and help
              make your community cleaner, safer and better.
            </p>

            <button
              className="dashboard-hero-btn"
              onClick={() => navigate("/report-issue")}
            >
              <PlusCircle size={18} />
              Report an Issue
              <ArrowRight size={17} />
            </button>
          </div>
        </section>

        {/* Statistics */}
        <section className="stats-grid">
          {stats.map(stat => (
            <div className="stat-card" key={stat.title}>
              <div className={`stat-icon ${stat.className}`}>
                {stat.icon}
              </div>

              <p>{stat.title}</p>

              <h2>{loading ? "..." : stat.value}</h2>
            </div>
          ))}
        </section>

        {/* Quick Actions */}
        <section className="quick-actions">
          <div className="dashboard-section-title">
            <div>
              <h2>Explore CivicPulse</h2>
              <p>Everything you need to make a difference.</p>
            </div>
          </div>

          <div className="dashboard-image-action-grid">
            {quickActions.map(action => (
              <article
                className="dashboard-image-action-card"
                key={action.title}
                onClick={() => navigate(action.path)}
                role="button"
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    navigate(action.path);
                  }
                }}
              >
                <div className="dashboard-action-image">
                  <img
                    src={action.image}
                    alt={action.title}
                  />
                </div>

                <div className="dashboard-action-content">
                  <h3>{action.title}</h3>
                  <p>{action.description}</p>

                  <span>
                    {action.label}
                    <ArrowRight size={16} />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Recent Complaints */}
        <section className="recent-section">
          <div className="recent-heading">
            <div>
              <h2>Recent Complaints</h2>
              <p>Track your recently submitted reports.</p>
            </div>

            <button
              className="view-all-btn"
              onClick={() => navigate("/my-complaints")}
            >
              View All
              <ArrowRight size={16} />
            </button>
          </div>

          {loading ? (
            <p>Loading your complaints...</p>
          ) : recentComplaints.length === 0 ? (
            <div className="empty-state">
              <ClipboardList size={35} />
              <h3>No complaints yet</h3>
              <p>Start by reporting an issue in your community.</p>

              <button
                className="dashboard-empty-btn"
                onClick={() => navigate("/report-issue")}
              >
                Report your first issue
              </button>
            </div>
          ) : (
            <div className="recent-list">
              {recentComplaints.map(complaint => (
                <div
                  className="recent-item"
                  key={complaint._id}
                >
                  <div>
                    <h3>{complaint.title}</h3>
                    <p>
                      {complaint.category} · {complaint.location}
                    </p>
                  </div>

                  <span
                    className={`status-badge ${
                      complaint.status === "Pending"
                        ? "status-pending"
                        : complaint.status === "In Progress"
                        ? "status-progress"
                        : complaint.status === "Resolved"
                        ? "status-resolved"
                        : "status-rejected"
                    }`}
                  >
                    {complaint.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="dashboard-footer">
          <p>© 2026 CivicPulse. Making communities better.</p>
        </footer>

      </main>
    </div>
  );
}

export default DashBoard;
