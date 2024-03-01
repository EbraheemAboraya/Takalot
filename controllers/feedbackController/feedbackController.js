const feedbackRepository = require('../../repository/feedbackRepository/feedbackRepos');
const { NotFoundError, BadRequsetError } = require('../../errors/err');


// add new  feedback to db
const feedback_post = async (req, res) => {
  try {
    const new_feedback = await feedbackRepository.addFeedback(req.body);
    if (!new_feedback) throw new BadRequsetError(`Feedback implement is not true`);
       return res.status(200).json(new_feedback);
  } 
  catch (err) {
    res.status(err?.status || 500).json({ message: err.message });
  }
};

// get all feedback in db
const getFeedbackByID = async (req, res) => {
  try {
    const { id } = req.params;
    const feedback = await feedbackRepository.getFeedbackById(id);
    if (!feedback || feedback.length === 0) throw new NotFoundError('Feedback');
    return res.status(200).send(feedback);
  } 
  catch (err) {
    return res.status(err?.status || 500).json({ message: err.message });
  }
};


// update  feedback
const feedback_update = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedFeedback = await feedbackRepository.udpateFeedback(id, req.body);
    if (!updatedFeedback || updatedFeedback.length === 0) throw new NotFoundError('Feedback');
    return res.status(200).send(updatedFeedback);
  } 
  catch (err) {
    return res.status(err?.status || 500).json({ message: err.message });
  }
};


// delete  feedback
const feedback_delete = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedFeedback = await feedbackRepository.deleteFeedback(id);
    if (!deletedFeedback || deletedFeedback.length === 0) throw new NotFoundError('Feedback');
    return res.status(200).send(deletedFeedback);
  } 
  catch (err) {
    return res.status(err?.status || 500).json({ message: err.message });
  }
};


// get all  feedback in db
const getAllFeedback = async (req, res) => {
  try {
    const feeedback = await feedbackRepository.gettAllFeedback();
    if (!feeedback || feeedback.length === 0) throw new NotFoundError('Feedback');
    return res.status(200).send(feeedback);
  } 
  catch (err) {
    return res.status(err?.status || 500).json({ message: err.message });
  }
};




module.exports = {
feedback_post,
getFeedbackByID,
feedback_update,
feedback_delete,
getAllFeedback
};