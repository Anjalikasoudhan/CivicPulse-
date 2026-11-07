
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function ReportIssue() {
  const navigate = useNavigate();

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await api.post("/complaints", formData);

      setSuccess(
        response.data.message || "Complaint submitted successfully!"
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
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card report-card">
        <h1>Report an Issue</h1>
        <p>Help us make your community better.</p>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <form onSubmit={handleSubmit}>
          <label>Complaint Title</label>
          <input
            type="text"
            name="title"
            placeholder="e.g. Broken streetlight"
            value={formData.title}
            onChange={handleChange}
            maxLength={100}
            required
          />

          <label>Description</label>
          <textarea
            name="description"
            placeholder="Describe the problem..."
            value={formData.description}
            onChange={handleChange}
            maxLength={1000}
            rows={4}
            required
          />

          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select category</option>
            <option value="Roads">Roads</option>
            <option value="Garbage">Garbage</option>
            <option value="Water">Water</option>
            <option value="Electricity">Electricity</option>
            <option value="Drainage">Drainage</option>
            <option value="Other">Other</option>
          </select>

          <label>Location</label>
          <input
            type="text"
            name="location"
            placeholder="Enter area or locality"
            value={formData.location}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Complaint"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="back-button"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default ReportIssue;
