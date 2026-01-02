import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import AdminNav from '../../components/AdminNav';
import Footer from '../../components/Footer';

const AdminHome = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const admin = localStorage.getItem('admin');
    if (!admin) {
      navigate('/admin/login');
      return;
    }
    fetchSurveys();
  }, [navigate]);

  const fetchSurveys = async () => {
    try {
      const response = await api.get('/admin/surveys');
      if (response.data.success) {
        setSurveys(response.data.surveys);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSurvey = async (surveyId) => {
    const confirm = window.confirm('Are you sure you want to remove this survey?');
    if (!confirm) return;

    try {
      await api.delete(`/admin/surveys/${surveyId}`);
      alert('Survey removed successfully');
      fetchSurveys();
    } catch (error) {
      alert('Failed to remove survey');
    }
  };

  const handleViewResponses = (surveyId) => {
    navigate(`/admin/results/${surveyId}`);
  };

 
  const handleCreateSurvey = () => {
    navigate('/admin/add-survey');
  };

  if (loading) {
    return <div className="page-container">Loading...</div>;
  }


  const totalSurveys = surveys.length;
  const totalResponses = surveys.reduce(
    (sum, survey) => sum + (survey.responseCount || 0),
    0
  );

  return (
    <div className="page-container fade-in" style={{background:"white"}}>
      <AdminNav />

   
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <button
          onClick={handleCreateSurvey}
          className="btn btn-primary"
        >
          + Create Survey
        </button>
      </div>

      <div className="admin-summary">
        <div className="summary-card">
          <h3>Total Surveys</h3>
          <p>{totalSurveys}</p>
        </div>
        <div className="summary-card">
          <h3>Total Responses</h3>
          <p>{totalResponses}</p>
        </div>
      </div>

      <div className="survey-list">
        <h2>Surveys</h2>

        {surveys.map((survey, index) => (
          <div key={survey._id} className="survey-row">
            <div>
              <h4>{index + 1}. {survey.title}</h4>
              <p>Responses: {survey.responseCount || 0}</p>
            </div>

            <div className="survey-actions">
              <button
                onClick={() => handleViewResponses(survey._id)}
                className="btn btn-secondary"
              >
                View Responses
              </button>

              <button
                onClick={() => handleDeleteSurvey(survey._id)}
                className="btn btn-danger"
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        {surveys.length === 0 && (
          <p>No surveys available</p>
        )}
      </div>
      <Footer/>
    </div>
  );
};

export default AdminHome;
