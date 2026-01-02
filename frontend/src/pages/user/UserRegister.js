import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';

const UserRegister = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/register', formData);
      if (response.data.success) {
        alert('Registration successful! Please login.');
        navigate('/user/login');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          'Registration failed. Please try again.';
      setError(errorMessage);
      console.error('Registration error:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container fade-in">
      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title">User Registration</h2>
          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="error-message">{error}</div>}
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Enter your username"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
            <p className="auth-link">
              Already have an account? <Link to="/user/login">Login here</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;