const Feedback = require('../../module/feedbackDataSchema/feed');

const getFeedbackById = async id => {
    try {
        const feedback = await Feedback.findById(id);
        return feedback;
    } 
    catch{
        return false;
    }
};

const addFeedback = async feedbackData => {
    try {
        const newFeedback = new Feedback(feedbackData);
        await newFeedback.save();
        return newFeedback;
    } 
    catch {
        return false;
    }
};


const udpateFeedback = async (id, newData) => {
    try {
        const feedback = await Feedback.findByIdAndUpdate(id,newData);
        return feedback;
    } 
    catch  {
        return false;
    }
};

const deleteFeedback = async id => {
    try {
        const feedback = await Feedback.findByIdAndDelete(id);
        return feedback;
    } 
    catch {
        return false;
    }
};

const gettAllFeedback = async id => {
    try {
        const feedbacks = await Feedback.find();
        return feedbacks;
    } 
    catch {
        return false;
    }
};



module.exports = {
    getFeedbackById,
    addFeedback,
    udpateFeedback,
    deleteFeedback,
    gettAllFeedback
};