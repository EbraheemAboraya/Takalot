const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
      requestID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Request', // Assuming 'Request' is the name of the corresponding model
        required: true
    },
    technicalID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Technical', // Assuming 'Technical' is the name of the corresponding model
        required: true
    },
      bid: {
        type: Number,
      },
      comments: {
        type: String,
      },
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
      }
});

const Offer = mongoose.model('Offer', offerSchema);

module.exports = Offer;
