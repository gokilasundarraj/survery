import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import Footer from '../../components/Footer';

const AddQuestions = () => {
  const { surveyId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [isPublished, setIsPublished] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState({
    questionText: '',
    questionType: 'mcq',
    options: []
  });
  const [newOption, setNewOption] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const admin = localStorage.getItem('admin');
    if (!admin) navigate('/admin/login');
  }, [navigate]);

 
  useEffect(() => {
    const fetchSurveyData = async () => {
      try {
        const surveyRes = await api.get(`/admin/surveys/${surveyId}`);
        if (surveyRes.data.success) {
          setIsPublished(surveyRes.data.survey.isPublished);
          setQuestions(surveyRes.data.survey.questions || []);
        }
      } catch (err) {
        console.error('Failed to load survey data');
      }
    };

    fetchSurveyData();
  }, [surveyId]);

  
  const handleQuestionChange = (e) => {
    const { name, value } = e.target;

    setCurrentQuestion({
      ...currentQuestion,
      [name]: value,
      options:
        name === 'questionType' && value !== 'mcq'
          ? []
          : currentQuestion.options
    });
  };


  const handleAddOption = () => {
    if (!newOption.trim()) return;

    setCurrentQuestion({
      ...currentQuestion,
      options: [...currentQuestion.options, newOption.trim()]
    });
    setNewOption('');
  };

 
  const handleRemoveOption = (index) => {
    setCurrentQuestion({
      ...currentQuestion,
      options: currentQuestion.options.filter((_, i) => i !== index)
    });
  };


  const handleAddQuestion = async () => {
    if (isPublished) {
      alert('Survey already published. Cannot add questions.');
      return;
    }

    if (!currentQuestion.questionText) {
      alert('Please enter question text');
      return;
    }

    if (
      currentQuestion.questionType === 'mcq' &&
      currentQuestion.options.length < 2
    ) {
      alert('Please add at least 2 options');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post(
        `/admin/surveys/${surveyId}/questions`,
        currentQuestion
      );

      if (res.data.success) {
        setQuestions(res.data.questions);
        setCurrentQuestion({
          questionText: '',
          questionType: 'mcq',
          options: []
        });
        setNewOption('');
      }
    } catch (err) {
      alert(
        err.response?.data?.message ||
        'Failed to add question'
      );
    } finally {
      setLoading(false);
    }
  };

 
  const handlePublish = async () => {
    if (questions.length === 0) {
      alert('Please add at least one question');
      return;
    }

    try {
      const res = await api.put(`/admin/surveys/${surveyId}/publish`);
      if (res.data.success) {
        alert('Survey published successfully');
        navigate('/admin/home');
      }
    } catch {
      alert('Failed to publish survey');
    }
  };

  return (
    <div className="page-container fade-in">
      

      <div className="questions-container">
        <h2>Add Questions to Survey</h2>

        {isPublished && (
          <p style={{ color: 'red', fontWeight: 'bold' }}>
            This survey is already published. You cannot add questions.
          </p>
        )}

       
        <div className="question-form-card">
          <div className="form-group">
            <label>Question Text</label>
            <textarea
              name="questionText"
              value={currentQuestion.questionText}
              onChange={handleQuestionChange}
              rows="3"
              disabled={isPublished}
            />
          </div>

          <div className="form-group">
            <label>Question Type</label>
            <select
              name="questionType"
              value={currentQuestion.questionType}
              onChange={handleQuestionChange}
              disabled={isPublished}
            >
              <option value="mcq">Multiple Choice</option>
              <option value="text">Text</option>
              <option value="boolean">Yes / No</option>
            </select>
          </div>

          {currentQuestion.questionType === 'mcq' && (
            <div className="form-group">
              <label>Options</label>

              {currentQuestion.options.map((opt, index) => (
                <div key={index} className="option-item">
                  <span>{opt}</span>
                  <button
                    onClick={() => handleRemoveOption(index)}
                    className="btn-remove"
                    disabled={isPublished}
                  >
                    Remove
                  </button>
                </div>
              ))}

              <div className="add-option">
                <input
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  placeholder="Add option"
                  disabled={isPublished}
                />
                <button
                  onClick={handleAddOption}
                  className="btn btn-small"
                  disabled={isPublished}
                >
                  Add
                </button>
              </div>
            </div>
          )}

          <button
            onClick={handleAddQuestion}
            className="btn btn-primary"
            disabled={loading || isPublished}
          >
            {isPublished
              ? 'Survey Published'
              : loading
              ? 'Adding...'
              : 'Add Question'}
          </button>
        </div>

        <div className="questions-list">
          <h3>Added Questions ({questions.length})</h3>

          {questions.map((q, index) => (
            <div key={index} className="question-item">
              <p>
                <strong>Q{index + 1}:</strong> {q.questionText}
              </p>
              <p>
                <strong>Type:</strong> {q.questionType}
              </p>

              {q.questionType === 'mcq' && (
                <ul>
                  {q.options.map((opt, i) => (
                    <li key={i}>{opt}</li>
                  ))}
                </ul>
              )}

              {q.questionType === 'boolean' && (
                <p>Options: Yes / No</p>
              )}
            </div>
          ))}
        </div>

        {!isPublished && (
          <div className="publish-section">
            <button
              onClick={handlePublish}
              className="btn btn-success btn-large"
            >
              Publish Survey
            </button>
          </div>
        )}
      </div>
      <Footer/>
    </div>
  );
};

export default AddQuestions;
