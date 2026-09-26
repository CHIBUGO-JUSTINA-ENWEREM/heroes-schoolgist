const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  department: { type: String, required: true },
  description: { type: String, default: '' },
  fileUrl: { type: String, required: true },
  teacherId: { type: String, required: true },
  teacherName: { type: String, required: true },
  downloads: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);