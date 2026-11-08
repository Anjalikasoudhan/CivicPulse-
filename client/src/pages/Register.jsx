
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  ShieldCheck
} from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
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

    if (formData.name.trim().length < 2) {
      setError("Please enter a valid name.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/register", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password
      });

      const { user, token } = response.data;

      login(user, token);

      navigate("/dashboard", { replace: true });

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Registration failed. Please try again."
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

      <div className="login-card register-card">

        <div className="login-icon">
          <ShieldCheck size={28} />
        </div>

        <h1>Create Account</h1>
        <p className="login-subtitle">
          Join CivicPulse and help make your community better.
        </p>

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">

          <div className="login-field">
            <label htmlFor="name">Full Name</label>

            <div className="login-input-wrapper">
              <User size={18} />

              <input
                id="name"
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                maxLength={60}
                required
              />
            </div>
          </div>

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
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                minLength={6}
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

            <span className="register-hint">
              Password must contain at least 6 characters.
            </span>
          </div>

          <button
            type="submit"
            className="login-submit-btn"
            disabled={loading}
          >
            <UserPlus size={18} />
            {loading ? "Creating Account..." : "Create Account"}
          </button>

        </form>

        <div className="login-register">
          Already have an account?
          <Link to="/login"> Login</Link>
        </div>

      </div>

      <p className="login-footer">
        © 2026 CivicPulse. Making communities better.
      </p>

    </div>
  );
}

export default Register;
