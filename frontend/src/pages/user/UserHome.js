import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import UserNav from "../../components/UserNav";
import Footer from "../../components/Footer";

const UserHome = () => {
  const [surveys, setSurveys] = useState([]);
  const [completedSurveys, setCompletedSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/user/login");
      return;
    }

    const user = JSON.parse(userData);

    const completedKey = `completedSurveys_${user.id}`;
    const completed =
      JSON.parse(localStorage.getItem(completedKey)) || [];

    setCompletedSurveys(completed);
    fetchSurveys();
  }, [navigate]);

  const fetchSurveys = async () => {
    try {
      const response = await api.get("/user/surveys");
      if (response.data.success) {
        setSurveys(response.data.surveys);
      }
    } catch (error) {
      console.error("Failed to fetch surveys:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartSurvey = (surveyId) => {
    if (completedSurveys.includes(surveyId)) return;
    navigate(`/user/survey/${surveyId}`);
  };

  if (loading) {
    return <div className="uh-loading">Loading...</div>;
  }

  return (
    <div className="uh-page">
      <UserNav />

     
      <div className="uh-header">
        <h1>Available Surveys</h1>
        <p>Participate and share your valuable feedback</p>
      </div>

     
      <div className="uh-grid">
        {surveys.map((survey) => {
          const isCompleted = completedSurveys.includes(survey._id);

          return (
            <div key={survey._id} className="uh-card">
              <div>
                <h3 className="uh-title">{survey.title}</h3>
                <p className="uh-desc">{survey.description}</p>

                <div className="uh-meta">
                  {survey.questions.length} Questions
                </div>
              </div>

              <button
                className={`uh-btn ${
                  isCompleted ? "uh-btn-complete" : "uh-btn-start"
                }`}
                disabled={isCompleted}
                onClick={() => handleStartSurvey(survey._id)}
              >
                {isCompleted ? "✅ Completed" : "Start Survey"}
              </button>
            </div>
          );
        })}

        {surveys.length === 0 && (
          <div className="uh-empty">
            <p>No surveys available right now</p>
          </div>
        )}
      </div>
      <Footer/>
    </div>
  );
};

export default UserHome;
