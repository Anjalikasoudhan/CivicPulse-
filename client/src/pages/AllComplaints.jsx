
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  CalendarDays,
  ArrowLeft,
  ClipboardList
} from "lucide-react";
import api from "../services/api";

function AllComplaints() {
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await api.get("/complaints");
        setComplaints(response.data.complaints || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Unable to fetch complaints."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
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

  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        complaint.title?.toLowerCase().includes(searchText) ||
        complaint.location?.toLowerCase().includes(searchText) ||
        complaint.user?.name?.toLowerCase().includes(searchText);

      const matchesCategory =
        categoryFilter === "All" ||
        complaint.category === categoryFilter;

      const matchesStatus =
        statusFilter === "All" ||
        complaint.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [complaints, search, categoryFilter, statusFilter]);

  return (
    <div className="all-complaints-page">

      <nav className="citizen-navbar">
        <div>
          <h2>Civic<span>Pulse</span></h2>
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

        <section className="all-complaints-heading">
          <div>
            <span className="welcome-label">COMMUNITY ACTIVITY</span>
            <h1 className="page-heading">Community Complaints</h1>
            <p className="page-description">
              Explore civic issues reported by people in your community
              and follow their resolution progress.
            </p>
          </div>
        </section>

        <section className="complaint-filters">
          <div className="search-box">
            <Search size={19} />
            <input
              type="text"
              placeholder="Search by title, location or reporter..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Roads">Roads</option>
            <option value="Garbage">Garbage</option>
            <option value="Water">Water</option>
            <option value="Electricity">Electricity</option>
            <option value="Drainage">Drainage</option>
            <option value="Other">Other</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </section>

        {loading ? (
          <div className="empty-state">
            Loading community complaints...
          </div>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <>
            <div className="complaints-count">
              Showing {filteredComplaints.length} of {complaints.length} complaints
            </div>

            {filteredComplaints.length === 0 ? (
              <div className="empty-state complaints-empty">
                <ClipboardList size={42} />
                <h3>No complaints found</h3>
                <p>
                  Try changing your search or filters.
                </p>
                <button
                  className="primary-btn"
                  onClick={() => {
                    setSearch("");
                    setCategoryFilter("All");
                    setStatusFilter("All");
                  }}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="my-complaints-grid">
                {filteredComplaints.map((complaint) => (
                  <article
                    className="my-complaint-card"
                    key={complaint._id}
                  >
                    <div className="my-complaint-top">
                      <span className="category-label">
                        {complaint.category}
                      </span>

                      <span className={`status-badge ${getStatusClass(complaint.status)}`}>
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
                        <ClipboardList size={16} />
                        <span>
                          Reported by: {complaint.user?.name || "Citizen"}
                        </span>
                      </div>

                      <div>
                        <CalendarDays size={16} />
                        <span>
                          {new Date(complaint.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric"
                            }
                          )}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}

      </main>
    </div>
  );
}

export default AllComplaints;
