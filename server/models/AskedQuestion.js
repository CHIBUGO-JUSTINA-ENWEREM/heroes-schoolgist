const mongoose = require('mongoose');

const askedQuestionSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  studentName: { type: String, required: true },
  questionText: { type: String, required: true },
  answerText: { type: String, default: '' },
  answeredBy: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'answered'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.models.AskedQuestion || mongoose.model('AskedQuestion', askedQuestionSchema);