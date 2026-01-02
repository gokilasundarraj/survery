const express = require("express");
const router = express.Router();
const surveyController = require("../controllers/surveyController");

router.post("/", surveyController.createSurvey);
router.get("/:id", surveyController.getSurveyById);
router.post("/:id/submit", surveyController.submitSurvey);
router.get("/:id/responses", surveyController.getSurveyResponses);

module.exports = router;
