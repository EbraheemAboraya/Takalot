const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
technaicalID: {
    type: Number,
    required: true
},
ratingValue: {
    type: Number,
    required: true
}
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;