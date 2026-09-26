const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  examType: { type: String, default: 'General' },
  imageUrl: { type: String, default: '' },
  postedById: { type: String, required: true },
  postedByName: { type: String, required: true },
  postedByRole: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('News', newsSchema);