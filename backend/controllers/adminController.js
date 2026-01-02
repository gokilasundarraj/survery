const Survey = require('../models/Survey');
const SurveyResult = require('../models/SurveyResult');
const User = require('../models/User');

exports.createSurvey = async (req, res) => {
  try {
    const { title, description } = req.body;

    const survey = new Survey({
      title,
      description,
      isPublished: false
    });

    await survey.save();

    res.json({
      success: true,
      message: 'Survey created successfully',
      survey
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create survey',
      error: error.message
    });
  }
};

exports.addQuestion = async (req, res) => {
  try {
    const { surveyId } = req.params;
    const { questionText, questionType, options } = req.body;

    const survey = await Survey.findById(surveyId);

    if (!survey) {
      return res.status(404).json({
        success: false,
        message: 'Survey not found'
      });
    }

    if (survey.isPublished) {
      return res.status(400).json({
        success: false,
        message: 'Survey already published. Cannot add questions.'
      });
    }

    survey.questions.push({
      questionText,
      questionType,
      options: options || []
    });

    await survey.save();

    res.json({
      success: true,
      message: 'Question added successfully',
      questions: survey.questions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add question',
      error: error.message
    });
  }
};

exports.getSurveyQuestions = async (req, res) => {
  try {
    const { surveyId } = req.params;

    const survey = await Survey.findById(surveyId);

    if (!survey) {
      return res.status(404).json({
        success: false,
        message: 'Survey not found'
      });
    }

    res.json({
      success: true,
      questions: survey.questions || []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to load questions',
      error: error.message
    });
  }
};

exports.getSurveyById = async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.surveyId);

    if (!survey) {
      return res.status(404).json({
        success: false,
        message: 'Survey not found'
      });
    }

    res.json({
      success: true,
      survey
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch survey',
      error: error.message
    });
  }
};

exports.publishSurvey = async (req, res) => {
  try {
    const { surveyId } = req.params;

    const survey = await Survey.findById(surveyId);
    if (!survey) {
      return res.status(404).json({
        success: false,
        message: 'Survey not found'
      });
    }

    survey.isPublished = true;
    await survey.save();

    res.json({
      success: true,
      message: 'Survey published successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to publish survey',
      error: error.message
    });
  }
};

exports.deleteSurvey = async (req, res) => {
  try {
    const { surveyId } = req.params;

    const survey = await Survey.findByIdAndDelete(surveyId);
    if (!survey) {
      return res.status(404).json({
        success: false,
        message: 'Survey not found'
      });
    }

    await SurveyResult.deleteMany({ surveyId });

    res.json({
      success: true,
      message: 'Survey deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete survey',
      error: error.message
    });
  }
};

exports.getAllSurveys = async (req, res) => {
  try {
    const surveys = await Survey.find().sort({ createdAt: -1 });

    const surveysWithCount = await Promise.all(
      surveys.map(async (survey) => {
        const responseCount = await SurveyResult.countDocuments({
          surveyId: survey._id
        });

        return {
          ...survey.toObject(),
          responseCount
        };
      })
    );

    res.json({
      success: true,
      surveys: surveysWithCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch surveys',
      error: error.message
    });
  }
};

exports.getSurveyResults = async (req, res) => {
  try {
    const { surveyId } = req.params;

    const results = await SurveyResult.find({ surveyId })
      .populate('userId', 'username email')
      .sort({ submittedAt: -1 });

    const formattedResults = results.map((result) => ({
      id: result._id,
      userName: result.userId.username,
      userEmail: result.userId.email,
      submittedAt: result.submittedAt,
      totalMarks: result.totalMarks,
      answers: result.answers
    }));

    res.json({
      success: true,
      results: formattedResults
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch survey results',
      error: error.message
    });
  }
};

exports.getAllResults = async (req, res) => {
  try {
    const results = await SurveyResult.find()
      .populate('userId', 'username email')
      .populate('surveyId', 'title')
      .sort({ submittedAt: -1 });

    res.json({
      success: true,
      results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch results',
      error: error.message
    });
  }
};

exports.checkSurveyStatus = async (req, res) => {
  const { surveyId, userId } = req.params;

  const submitted = await SurveyResult.findOne({
    surveyId,
    userId
  });

  res.json({
    completed: !!submitted
  });
};

