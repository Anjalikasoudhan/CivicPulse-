
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  FileText,
  Send,
  CheckCircle
} from "lucide-react";
import api from "../services/api";

function ReportIssue() {
  const navigate = useNavigate();

  // Prevent multiple submissions
  const submittingRef = useRef(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Stop duplicate submissions immediately
    if (submittingRef.current) return;

    setError("");
    setSuccess("");

    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.category ||
      !formData.location.trim()
    ) {
      setError("Please fill in all the fields.");
      return;
    }

    submittingRef.current = true;
    setLoading(true);

    try {
      const response = await api.post("/complaints", {
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
        location: formData.location.trim()
      });

      setSuccess(
        response.data.message ||
        "Your complaint has been submitted successfully!"
      );

      setFormData({
        title: "",
        description: "",
        category: "",
        location: ""
      });

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to submit complaint. Please try again."
      );
    } finally {
      submittingRef.current = false;
      setLoading(false);
    }
  };

  return (
    <div className="report-page">

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

      <main className="report-page-container">

        <div className="report-intro">
          <span className="welcome-label">MAKE A DIFFERENCE</span>
          <h1>Report a Community Issue</h1>
          <p>
            Help improve your neighbourhood. Share the details
            of a civic problem so it can be tracked and addressed.
          </p>
        </div>

        <div className="report-form-card">

          <div className="report-form-heading">
            <div className="report-heading-icon">
              <FileText size={23} />
            </div>

            <div>
              <h2>Complaint Details</h2>
              <p>Provide accurate information about the issue.</p>
            </div>
          </div>

          {error && (
            <div className="report-alert report-error">
              {error}
            </div>
          )}

          {success && (
            <div className="report-alert report-success">
              <CheckCircle size={18} />
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="report-form">

            <div className="form-group">
              <label htmlFor="title">Complaint Title *</label>

              <input
                id="title"
                type="text"
                name="title"
                placeholder="e.g. Broken streetlight near main road"
                value={formData.title}
                onChange={handleChange}
                maxLength={100}
                required
              />

              <span className="character-count">
                {formData.title.length}/100 characters
              </span>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>

              <textarea
                id="description"
                name="description"
                placeholder="Describe the issue, when you noticed it and how it affects the community..."
                value={formData.description}
                onChange={handleChange}
                maxLength={1000}
                rows={5}
                required
              />

              <span className="character-count">
                {formData.description.length}/1000 characters
              </span>
            </div>

            <div className="form-group">
              <label htmlFor="category">Issue Category *</label>

              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select an issue category</option>
                <option value="Roads">Roads</option>
                <option value="Garbage">Garbage</option>
                <option value="Water">Water Supply</option>
                <option value="Electricity">Electricity</option>
                <option value="Drainage">Drainage</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="location">Issue Location *</label>

              <div className="location-input">
                <MapPin size={18} />

                <input
                  id="location"
                  type="text"
                  name="location"
                  placeholder="Enter area, street or locality"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="report-form-actions">
              <button
                type="submit"
                className="primary-btn submit-complaint-btn"
                disabled={loading}
              >
                <Send size={17} />
                {loading ? "Submitting..." : "Submit Complaint"}
              </button>

              <button
                type="button"
                className="cancel-form-btn"
                onClick={() => navigate("/dashboard")}
                disabled={loading}
              >
                Cancel
              </button>
            </div>

          </form>
        </div>

        <p className="report-note">
          <CheckCircle size={15} />
          Your complaint will be recorded with Pending status
          and can be tracked from My Complaints.
        </p>

      </main>
    </div>
  );
}

export default ReportIssue;
