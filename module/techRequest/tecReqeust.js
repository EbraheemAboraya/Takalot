const mongoose = require('mongoose');

const techrequestSchema = new mongoose.Schema({
    requestID: {
        type: String,
        required: true
    },
    technicalID: {
        type: String,
        required: true
    }
});
const techRequestModel = mongoose.model('TechRequest', techrequestSchema);
module.exports = techRequestModel;

