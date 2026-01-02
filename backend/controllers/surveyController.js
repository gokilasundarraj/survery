const Survey = require("../models/Survey");
const SurveyResult = require("../models/SurveyResult");

exports.createSurvey = async (req, res) => {
  try {
    const survey = new Survey(req.body);
    await survey.save();
    res.status(201).json(survey);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getSurveyById = async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);
    res.json(survey);
  } catch (err) {
    res.status(404).json({ message: "Survey not found" });
  }
};

exports.submitSurvey = async (req, res) => {
  try {
    const result = new SurveyResult({
      surveyId: req.params.id,
      userId: req.body.userId,
      answers: req.body.answers
    });
    await result.save();
    res.json({ message: "Survey submitted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getSurveyResponses = async (req, res) => {
  try {
    const results = await SurveyResult.find({ surveyId: req.params.id });
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
