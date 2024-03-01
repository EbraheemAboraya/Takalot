const mongoose = require('mongoose');

const technicalSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    password: {
      type: String,
      required: true
    },
    fullName: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    phoneNumber: {
      type: Number,
      required: true
    },
    yearsOfExperience: {
      type: Number,
      required: true
    },
    qualifications: {
      type: String,
      required: true
    },
    ratingAverage: {
      type: Number,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensure no two technicals have the same email
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'] // Simple regex for email validation
    },
    notification:{
      type: Array
    }
    
  });
  

const Technical = mongoose.model('Technical', technicalSchema);

module.exports = Technical;