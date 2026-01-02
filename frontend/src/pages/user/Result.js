import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserNav from "../../components/UserNav";
import Footer from "../../components/Footer";

const Result = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const resultData = localStorage.getItem("result");

    if (!resultData) {
      navigate("/user/home");
      return;
    }

    try {
      const parsedResult = JSON.parse(resultData);

     
      if (!parsedResult.answers || parsedResult.answers.length === 0) {
        navigate("/user/home");
        return;
      }

      setResult(parsedResult);
    } catch (err) {
      console.error("Invalid result data");
      navigate("/user/home");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  if (loading) {
    return <div className="page-container">Loading...</div>;
  }

  if (!result) {
    return null;
  }

  return (
    <div className="page-container fade-in">
      <UserNav />

      <div className="result-container">
        <div className="result-header">
          <h1>Thank you for your response!</h1>
          <p className="result-subtitle">
            Your answers have been successfully submitted.
          </p>
        </div>

        <div className="result-details">
          <h3>Your Responses</h3>

          {result.answers.map((answer, index) => (
            <div key={index} className="result-answer-item">
              <p>
                <strong>Question {index + 1}:</strong>{" "}
                {answer.questionText}
              </p>
              <p>
                <strong>Your Answer:</strong>{" "}
                {answer.userAnswer}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("result");
            navigate("/user/home");
          }}
          className="btn btn-primary btn-large"
        >
          Back to Surveys
        </button>
      </div>
      <Footer/>
    </div>
  );
};

export default Result;
