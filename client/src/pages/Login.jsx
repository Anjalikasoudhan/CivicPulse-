
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  ShieldCheck
} from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email: formData.email.trim(),
        password: formData.password
      });

      const { user, token } = response.data;

      login(user, token);

      if (user.role === "admin") {
        navigate("/admin-dashboard", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-brand">
        <h2>Civic<span>Pulse</span></h2>
        <p>Community first. Change together.</p>
      </div>

      <div className="login-card">

        <div className="login-icon">
          <ShieldCheck size={28} />
        </div>

        <h1>Welcome Back!</h1>
        <p className="login-subtitle">
          Login to continue to your CivicPulse account.
        </p>

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">

          <div className="login-field">
            <label htmlFor="email">Email Address</label>
            <div className="login-input-wrapper">
              <Mail size={18} />
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="login-field">
            <label htmlFor="password">Password</label>
            <div className="login-input-wrapper">
              <Lock size={18} />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="login-submit-btn"
            disabled={loading}
          >
            <LogIn size={18} />
            {loading ? "Logging in..." : "Login to Account"}
          </button>

        </form>

        <div className="login-register">
          Don't have an account?
          <Link to="/register"> Create an account</Link>
        </div>

      </div>

      <p className="login-footer">
        © 2026 CivicPulse. Making communities better.
      </p>

    </div>
  );
}

export default Login;
