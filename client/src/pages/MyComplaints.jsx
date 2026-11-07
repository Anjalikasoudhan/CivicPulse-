
import { useEffect, useState } from "react";
import api from "../services/api";

function MyComplaints() {
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

  if (loading) return <h2>Loading your complaints...</h2>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: "30px" }}>
      <h1>My Complaints</h1>
      <p>Track the civic issues you have reported.</p>

      {complaints.length === 0 ? (
        <p>You haven't reported any complaints yet.</p>
      ) : (
        complaints.map((complaint) => (
          <div
            key={complaint._id}
            style={{
              border: "1px solid #ddd",
              padding: "20px",
              marginBottom: "15px",
              borderRadius: "8px"
            }}
          >
            <h3>{complaint.title}</h3>
            <p>{complaint.description}</p>
            <p>Category: {complaint.category}</p>
            <p>Location: {complaint.location}</p>
            <p>Status: {complaint.status}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default MyComplaints;
