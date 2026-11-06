
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Register from "./pages/Register";
import Dashboard from "./pages/DashBoard";
import Login from "./pages/Login";

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={user ? "/dashboard" : "/register"} />}
      />

      <Route path="/register" element={<Register />} />

      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          user ? <Dashboard /> : <Navigate to="/login" />
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
