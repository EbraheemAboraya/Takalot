const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    helpseekerId: {
        type: String,
        // required: true
      },
      image: {
        filename: String,
        contentType: String,
        image: Buffer
      },
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
      },
      category: {
        type: String,
        // required: true
      },
      details: {
        type: String,
      }

});

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;
