const express = require('express');
const router = express.Router();
const {
  getPublishedSurveys,
  getSurveyById,
  submitSurvey
} = require('../controllers/userController');

router.get('/surveys', getPublishedSurveys);
router.get('/surveys/:surveyId', getSurveyById);
router.post('/surveys/submit', submitSurvey);

module.exports = router;