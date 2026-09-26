const mongoose = require('mongoose');

const guidanceRequestSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  studentName: { type: String, required: true },
  requestType: { type: String, required: true },
  message: { type: String, required: true },
  response: { type: String, default: '' },
  respondedBy: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'answered'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.models.GuidanceRequest || mongoose.model('GuidanceRequest', guidanceRequestSchema);