import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import AdminNav from "../../components/AdminNav";
import Footer from "../../components/Footer";

const ViewResults = () => {
  const { surveyId } = useParams();
  const navigate = useNavigate();

  const [results, setResults] = useState([]);
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const admin = localStorage.getItem("admin");
    if (!admin) {
      navigate("/admin/login");
      return;
    }

    const fetchResults = async () => {
      try {
        const res = await api.get(
          `/admin/surveys/${surveyId}/results`
        );
        if (res.data.success) {
          setResults(res.data.results);
          setSurvey(res.data.survey);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [surveyId, navigate]);

  if (loading) {
    return <div className="ar-loading">Loading...</div>;
  }

  const totalResponses = results.length;

  const getOptionStats = (qIndex, option) => {
    const count = results.filter(
      (r) => r.answers[qIndex]?.userAnswer === option
    ).length;

    const percentage =
      totalResponses > 0
        ? ((count / totalResponses) * 100).toFixed(1)
        : 0;

    return { count, percentage };
  };

  return (
    <div className="ar-page">
      <AdminNav />

      <div className="ar-header">
        <h1>Survey Results</h1>
        <button
          className="ar-btn ar-btn-secondary"
          onClick={() => navigate("/admin/home")}
        >
          ← Back
        </button>
      </div>

      {survey && (
        <div className="ar-analytics">
          <h2>{survey.title}</h2>
          <p className="ar-total">
            Total Responses: {totalResponses}
          </p>

          {survey.questions.map((q, qIndex) => (
            <div key={qIndex} className="ar-question">
              <h4>
                Q{qIndex + 1}. {q.questionText}
              </h4>

              {(q.questionType === "mcq" ||
                q.questionType === "boolean") && (
                <div className="ar-options">
                  {(q.options.length
                    ? q.options
                    : ["Yes", "No"]
                  ).map((opt, i) => {
                    const stat = getOptionStats(qIndex, opt);
                    return (
                      <div key={i} className="ar-option">
                        <div className="ar-option-label">
                          {opt} — {stat.count} users (
                          {stat.percentage}%)
                        </div>

                        <div className="ar-progress">
                          <div
                            className="ar-progress-fill"
                            style={{
                              width: `${stat.percentage}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="ar-results">
        <h2>User Responses</h2>

        {results.length === 0 ? (
          <p className="ar-empty">
            No responses submitted yet.
          </p>
        ) : (
          results.map((res, idx) => (
            <div key={idx} className="ar-card">
              <div className="ar-card-header">
                <h3>{res.userName}</h3>
                <p>{res.userEmail}</p>
                <span>
                  {new Date(
                    res.submittedAt
                  ).toLocaleString()}
                </span>
              </div>

              <div className="ar-answers">
                {res.answers.map((ans, i) => (
                  <div key={i} className="ar-answer">
                    <p>
                      <strong>Q{i + 1}:</strong>{" "}
                      {ans.questionText}
                    </p>
                    <p>
                      <strong>Answer:</strong>{" "}
                      {ans.userAnswer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
      <Footer/>
    </div>
  );
};

export default ViewResults;
