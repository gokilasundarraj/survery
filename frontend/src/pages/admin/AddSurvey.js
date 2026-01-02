import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import AdminNav from '../../components/AdminNav';
import Footer from '../../components/Footer';

const AddSurvey = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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
      const response = await api.post('/admin/surveys', formData);
      if (response.data.success) {
        navigate(`/admin/add-questions/${response.data.survey._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create survey');
      setLoading(false);
    }
  };

  return (
    <div className="page-container fade-in">
      <AdminNav/>
      <div className="form-container">
        <h2>Create New Survey</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label>Survey Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter survey title"
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Enter survey description"
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Survey'}
          </button>
        </form>
      </div>
      <Footer/>
    </div>
  );
};

export default AddSurvey;