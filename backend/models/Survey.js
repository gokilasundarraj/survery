const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true
  },
  questionType: {
    type: String,
    enum: ['mcq', 'text', 'boolean'],
    required: true
  },
  options: {
    type: [String],
    default: []
  }
  
});

const surveySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  questions: {
    type: [questionSchema],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isPublished: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Survey', surveySchema);