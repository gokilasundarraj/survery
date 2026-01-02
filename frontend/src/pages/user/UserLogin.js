import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';

const UserLogin = () => {
  const [formData, setFormData] = useState({
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
      const response = await api.post('/auth/login', formData);
      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        alert('Login successful!');
        navigate('/user/home');
      }
      else{
        alert("Email and Password wrong")
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container fade-in">
      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title">User Login</h2>
          <form onSubmit={handleSubmit} className="auth-form">
           
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
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
              />
               {error && <div className="error-message">{error}</div>}
            </div>
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <p className="auth-link">
              Don't have an account? <Link to="/user/register">Register here</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;