const express = require('express');
const router = express.Router();

const {
  createSurvey,
  addQuestion,
  publishSurvey,
  getAllSurveys,
  getSurveyResults,
  getAllResults,
  deleteSurvey,
  getSurveyQuestions,
  checkSurveyStatus
} = require('../controllers/adminController');

router.post('/surveys', createSurvey);
router.post('/surveys/:surveyId/questions', addQuestion);
router.get('/surveys/:surveyId/questions', getSurveyQuestions);
router.put('/surveys/:surveyId/publish', publishSurvey);
router.delete('/surveys/:surveyId', deleteSurvey);

router.get('/surveys', getAllSurveys);
router.get('/surveys/:surveyId/results', getSurveyResults);
router.get('/results', getAllResults);

router.get(
  '/surveys/:surveyId/status/:userId',
  checkSurveyStatus
);


module.exports = router;
