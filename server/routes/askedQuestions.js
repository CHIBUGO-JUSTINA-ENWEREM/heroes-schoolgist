 const express = require('express');
const AskedQuestion = require('../models/AskedQuestion');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { studentId, studentName, questionText } = req.body;
    const newQuestion = new AskedQuestion({ studentId, studentName, questionText });
    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/', verifyToken, requireRole('admin', 'teacher'), async (req, res) => {
  try {
    const questions = await AskedQuestion.find().sort({ createdAt: -1 });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/student/:studentId', async (req, res) => {
  try {
    const questions = await AskedQuestion.find({ studentId: req.params.studentId }).sort({ createdAt: -1 });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.patch('/:id', verifyToken, requireRole('admin', 'teacher'), async (req, res) => {
  try {
    const { answerText, answeredBy } = req.body;
    const updated = await AskedQuestion.findByIdAndUpdate(
      req.params.id,
      { answerText, answeredBy, status: 'answered' },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;