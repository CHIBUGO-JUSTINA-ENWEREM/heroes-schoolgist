 const express = require('express');
const Question = require('../models/Question');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { examType, subject, questionMode, year } = req.query;

    if (!examType || !subject) {
      return res.status(400).json({ message: 'examType and subject are required' });
    }

    const filter = { examType, subject };
    if (questionMode) filter.questionMode = questionMode;
    if (year) filter.year = year;

    const questions = await Question.find(filter);
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const newQuestion = new Question(req.body);
    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;