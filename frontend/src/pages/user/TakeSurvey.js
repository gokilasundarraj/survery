import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import UserNav from "../../components/UserNav";
import Footer from "../../components/Footer";

const TakeSurvey = () => {
  const { surveyId } = useParams();
  const navigate = useNavigate();

  const [survey, setSurvey] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/user/login");
      return;
    }

    const fetchSurvey = async () => {
      try {
        const res = await api.get(`/surveys/${surveyId}`);
        setSurvey(res.data);
        setAnswers(new Array(res.data.questions.length).fill(""));
      } catch (err) {
        console.error("Failed to fetch survey", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSurvey();
  }, [surveyId, navigate]);


  const handleAnswerChange = (e) => {
    setCurrentAnswer(e.target.value);
  };

  
  const saveCurrentAnswer = () => {
    setAnswers((prev) => {
      const temp = [...prev];
      temp[currentQuestionIndex] = currentAnswer;
      return temp;
    });
  };

 
  const handleNext = () => {
    saveCurrentAnswer();
    setCurrentQuestionIndex((prev) => prev + 1);
    setCurrentAnswer(answers[currentQuestionIndex + 1] || "");
  };

 
  const handlePrevious = () => {
    saveCurrentAnswer();
    setCurrentQuestionIndex((prev) => prev - 1);
    setCurrentAnswer(answers[currentQuestionIndex - 1] || "");
  };


  const handleSubmit = async () => {

    const finalAnswers = [...answers];
    finalAnswers[currentQuestionIndex] = currentAnswer;
  
 
    if (finalAnswers.some((a) => !a || !a.trim())) {
      alert("Please answer all questions");
      return;
    }
  
    setSubmitting(true);
  
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const completedKey = `completedSurveys_${user.id}`;
  
      const formattedAnswers = survey.questions.map((q, i) => ({
        questionId: q._id,
        questionText: q.questionText,
        userAnswer: finalAnswers[i],
      }));
  
      await api.post(`/surveys/${surveyId}/submit`, {
        userId: user.id,
        answers: formattedAnswers,
      });
  
      
      const completed =
        JSON.parse(localStorage.getItem(completedKey)) || [];
  
      if (!completed.includes(surveyId)) {
        completed.push(surveyId);
        localStorage.setItem(
          completedKey,
          JSON.stringify(completed)
        );
      }
      alert("Thank you for your response!... Your answers have been successfully submitted.")
      navigate("/user/thank-you"); 
    } catch (err) {
      alert("Failed to submit survey");
      setSubmitting(false);
    }
  };
  
  if (loading) return <div className="uh-loading">Loading...</div>;
  if (!survey) return <div className="uh-loading">Survey not found</div>;

  const currentQuestion = survey.questions[currentQuestionIndex];
  const progress =
    ((currentQuestionIndex + 1) / survey.questions.length) * 100;

  return (
    <div className="ts-page">
      <UserNav />

      <div className="ts-container">
       
        <div className="ts-header">
          <h2>{survey.title}</h2>
          <p>{survey.description}</p>

          <div className="ts-progress">
            <div
              className="ts-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="ts-progress-text">
            Question {currentQuestionIndex + 1} of{" "}
            {survey.questions.length}
          </p>
        </div>

       
        <div className="ts-question-box">
          <h3>{currentQuestion.questionText}</h3>

          {currentQuestion.questionType === "mcq" &&
            currentQuestion.options.map((opt, i) => (
              <label key={i} className="ts-option">
                <input
                  type="radio"
                  name="answer"
                  value={opt}
                  checked={currentAnswer === opt}
                  onChange={handleAnswerChange}
                />
                <span>{opt}</span>
              </label>
            ))}

          {currentQuestion.questionType === "boolean" &&
            ["Yes", "No"].map((val) => (
              <label key={val} className="ts-option">
                <input
                  type="radio"
                  name="answer"
                  value={val}
                  checked={currentAnswer === val}
                  onChange={handleAnswerChange}
                />
                <span>{val}</span>
              </label>
            ))}

          {currentQuestion.questionType === "text" && (
            <textarea
              className="ts-textarea"
              rows="4"
              value={currentAnswer}
              onChange={handleAnswerChange}
              placeholder="Type your answer..."
            />
          )}
        </div>

      
        <div className="ts-nav">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="ts-btn ts-btn-secondary"
          >
            Previous
          </button>

          {currentQuestionIndex < survey.questions.length - 1 ? (
            <button
              onClick={handleNext}
              className="ts-btn ts-btn-primary"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="ts-btn ts-btn-success"
            >
              {submitting ? "Submitting..." : "Submit Survey"}
            </button>
          )}
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default TakeSurvey;
