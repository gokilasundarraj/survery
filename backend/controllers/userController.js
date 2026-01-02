const Survey = require('../models/Survey');
const SurveyResult = require('../models/SurveyResult');

exports.getPublishedSurveys = async (req, res) => {
  try {
    const surveys = await Survey.find({ isPublished: true })
      .select('title description questions createdAt')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      surveys: surveys
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch surveys',
      error: error.message
    });
  }
};

exports.getSurveyById = async (req, res) => {
  try {
    const { surveyId } = req.params;

    const survey = await Survey.findById(surveyId);
    if (!survey) {
      return res.status(404).json({
        success: false,
        message: 'Survey not found'
      });
    }

    if (!survey.isPublished) {
      return res.status(403).json({
        success: false,
        message: 'Survey is not published'
      });
    }

    res.json({
      success: true,
      survey: survey
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch survey',
      error: error.message
    });
  }
};

exports.submitSurvey = async (req, res) => {
  try {
    const { surveyId, userId, answers } = req.body;

    const survey = await Survey.findById(surveyId);
    if (!survey) {
      return res.status(404).json({
        success: false,
        message: 'Survey not found'
      });
    }

    let totalMarks = 0;
    const formattedAnswers = answers.map((userAnswer, index) => {
      const question = survey.questions[index];
      let marks = 0;

      if (question.questionType === 'mcq' || question.questionType === 'boolean') {
        if (userAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim()) {
          marks = question.marks;
          totalMarks += marks;
        }
      } else if (question.questionType === 'text') {
      
        if (userAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim()) {
          marks = question.marks;
          totalMarks += marks;
        }
      }

      return {
        questionId: question._id,
        questionText: question.questionText,
        userAnswer: userAnswer,
        correctAnswer: question.correctAnswer,
        marks: marks,
        maxMarks: question.marks
      };
    });

    const surveyResult = new SurveyResult({
      surveyId,
      userId,
      answers: formattedAnswers,
      totalMarks
    });

    await surveyResult.save();

    res.json({
      success: true,
      message: 'Survey submitted successfully',
      result: {
        totalMarks: totalMarks,
        answers: formattedAnswers
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to submit survey',
      error: error.message
    });
  }
};