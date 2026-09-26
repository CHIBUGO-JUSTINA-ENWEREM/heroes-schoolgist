const express = require('express');
const GuidanceRequest = require('../models/GuidanceRequest');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { studentId, studentName, requestType, message } = req.body;
    const newRequest = new GuidanceRequest({ studentId, studentName, requestType, message });
    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/', verifyToken, requireRole('admin', 'teacher'), async (req, res) => {
  try {
    const requests = await GuidanceRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/student/:studentId', async (req, res) => {
  try {
    const requests = await GuidanceRequest.find({ studentId: req.params.studentId }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.patch('/:id', verifyToken, requireRole('admin', 'teacher'), async (req, res) => {
  try {
    const { response, respondedBy } = req.body;
    const updated = await GuidanceRequest.findByIdAndUpdate(
      req.params.id,
      { response, respondedBy, status: 'answered' },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;