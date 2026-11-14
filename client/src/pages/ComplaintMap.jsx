
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin } from "lucide-react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from "react-leaflet";

import L from "leaflet";
import api from "../services/api";

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png"
});

function ComplaintMap() {
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await api.get("/complaints");

        setComplaints(response.data.complaints || []);
      } catch (err) {
        setError("Unable to load complaints on the map.");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const mappedComplaints = complaints.filter(
    (complaint) =>
      Number.isFinite(Number(complaint.latitude)) &&
      Number.isFinite(Number(complaint.longitude)) &&
      complaint.latitude !== null &&
      complaint.longitude !== null &&
      complaint.latitude !== undefined &&
      complaint.longitude !== undefined
  );

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
          <span className="welcome-label">COMMUNITY MAP</span>
          <h1>Reported Civic Issues</h1>
          <p>
            Explore reported civic problems and understand
            what is happening in your community.
          </p>
        </div>

        {loading && <p>Loading complaints...</p>}

        {error && (
          <div className="report-alert report-error">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="report-form-card">
              <h3>
                <MapPin size={18} />
                Community Issue Map
              </h3>

              <p style={{ margin: "10px 0 18px" }}>
                {mappedComplaints.length} complaints with mapped locations
              </p>

              <div
                style={{
                  height: "500px",
                  width: "100%",
                  borderRadius: "12px",
                  overflow: "hidden"
                }}
              >
                <MapContainer
                  center={[26.7606, 83.3732]}
                  zoom={12}
                  style={{ height: "100%", width: "100%" }}
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {mappedComplaints.map((complaint) => (
                    <Marker
                      key={complaint._id}
                      position={[
                        Number(complaint.latitude),
                        Number(complaint.longitude)
                      ]}
                    >
                      <Popup>
                        <strong>{complaint.title}</strong>
                        <p>Category: {complaint.category}</p>
                        <p>Location: {complaint.location}</p>
                        <p>Status: {complaint.status}</p>
                        <p>
                          Priority:{" "}
                          {complaint.aiAnalysis?.priority || "Not analyzed"}
                        </p>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>

              {mappedComplaints.length === 0 && (
                <p style={{ marginTop: "15px" }}>
                  No complaints with saved coordinates are available yet.
                </p>
              )}
            </div>
          </>
        )}

      </main>
    </div>
  );
}

export default ComplaintMap;
