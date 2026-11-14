
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Dashboard from "./pages/DashBoard";
import Login from "./pages/Login";
import ReportIssue from "./pages/ReportIssue";
import AllComplaints from "./pages/AllComplaints";
import MyComplaints from "./pages/MyComplaints";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import ComplaintMap from "./pages/ComplaintMap";

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          user ? (
            <Navigate
              to={user.role === "admin" ? "/admin-dashboard" : "/dashboard"}
              replace
            />
          ) : (
            <Landing />
          )
        }
      />

      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          user ? <Dashboard /> : <Navigate to="/login" replace />
        }
      />

      <Route
        path="/report-issue"
        element={
          user ? <ReportIssue /> : <Navigate to="/login" replace />
        }
      />

      <Route
        path="/all-complaints"
        element={
          user ? <AllComplaints /> : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/complaint-map"
        element={
        user ? <ComplaintMap /> : <Navigate to="/login" replace />
       }
      />
      <Route
        path="/my-complaints"
        element={
          user ? <MyComplaints /> : <Navigate to="/login" replace />
        }
      />

      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute>
            {user?.role === "admin" ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/dashboard" replace />
            )}
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}

export default App;
