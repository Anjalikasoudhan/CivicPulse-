
import { useEffect, useState } from "react";
import api from "../services/api";

function AllComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (loading) return <h2>Loading complaints...</h2>;

  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: "30px" }}>
      <h1>Community Complaints</h1>
      <p>View issues reported by your community.</p>

      {complaints.length === 0 ? (
        <p>No complaints reported yet.</p>
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
            <p>
              Reported by: {complaint.user?.name || "Citizen"}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default AllComplaints;
