const express = require('express');
const router = express.Router();
const feedbackController = require('../../controllers/feedbackController/feedbackController');
//feedback
router.get("/feedback/:id", feedbackController.getFeedbackByID);
router.get("/feedback", feedbackController.getAllFeedback);
router.post("/feedback", feedbackController.feedback_post);
router.put("/feedback/:id",feedbackController.feedback_update);
router.delete("/feedback/:id",feedbackController.feedback_delete);

module.exports = router;
