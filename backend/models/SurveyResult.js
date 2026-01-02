const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  questionText: {
    type: String,
    required: true
  },
  userAnswer: {
    type: String,
    required: true
  }
});

const surveyResultSchema = new mongoose.Schema({
  surveyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Survey",
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  answers: {
    type: [answerSchema],
    default: []
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("SurveyResult", surveyResultSchema);
