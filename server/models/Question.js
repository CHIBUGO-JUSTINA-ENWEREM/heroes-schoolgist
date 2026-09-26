 const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  examType: {
    type: String,
    enum: ['JAMB', 'WAEC', 'NECO', 'GCE'],
    required: true
  },
  questionMode: {
    type: String,
    enum: ['Objective', 'Theory'],
    default: 'Objective'
  },
  subject: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  questionText: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    required: true
  },
  correctAnswerIndex: {
    type: Number,
    required: true
  },
  explanation: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.models.Question || mongoose.model('Question', questionSchema);