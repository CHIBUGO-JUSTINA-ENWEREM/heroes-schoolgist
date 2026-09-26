const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  department: { type: String, required: true },
  description: { type: String, default: '' },
  videoUrl: { type: String, required: true },
  teacherId: { type: String, required: true },
  teacherName: { type: String, required: true },
  views: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Video', videoSchema);