import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post(
        "/auth/admin/login",
        formData
      );

      if (res.data.success) {
        localStorage.setItem(
          "admin",
          JSON.stringify(res.data.user)
        );
        navigate("/admin/home");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Admin login failed"
      );
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-wrapper">
        <div className="admin-login-card">
          <h2 className="admin-login-title">
            Admin Login
          </h2>

          <form
            onSubmit={handleSubmit}
            className="admin-login-form"
          >
            {error && (
              <div className="admin-login-error">
                {error}
              </div>
            )}

            <div className="admin-form-group">
              <label>Email</label>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="gokilasundarraj@email.com"
              />
            </div>

            <div className="admin-form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="admin123"
              />
            </div>

            <button
              type="submit"
              className="admin-login-btn"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
