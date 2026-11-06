
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function DashBoard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Welcome to CivicPulse!</h1>

      <h2>Hello, {user?.name}</h2>
      <p>Email: {user?.email}</p>
      <p>Role: {user?.role}</p>

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default DashBoard;
