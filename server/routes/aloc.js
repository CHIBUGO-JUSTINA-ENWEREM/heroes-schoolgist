 const express = require('express');
const axios = require('axios');
const Question = require('../models/Question');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();

const examTypeMap = {
  JAMB: 'utme',
  WAEC: 'wassce',
  NECO: 'neco',
  GCE: 'wassce'
};

router.post('/import', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const { examType, subject, year } = req.body;

    if (!examType || !subject) {
      return res.status(400).json({ message: 'examType and subject are required' });
    }

    const alocType = examTypeMap[examType] || 'utme';
    let url = `https://questions.aloc.com.ng/api/v2/m?subject=${subject.toLowerCase()}&type=${alocType}`;
    if (year) url += `&year=${year}`;

    const response = await axios.get(url, {
      headers: { 'AccessToken': process.env.ALOC_ACCESS_TOKEN }
    });

    const alocQuestions = response.data.data;

    if (!alocQuestions || alocQuestions.length === 0) {
      return res.status(404).json({ message: 'No questions found from ALOC for these filters' });
    }

    let savedCount = 0;

    for (const q of alocQuestions) {
      const optionLetters = ['a', 'b', 'c', 'd', 'e'];
      const options = optionLetters
        .map((letter) => q.option[letter])
        .filter((opt) => opt !== undefined && opt !== null && opt !== '');

      const correctAnswerIndex = optionLetters.indexOf(q.answer);

      if (correctAnswerIndex === -1 || options.length === 0) continue;

      const newQuestion = new Question({
        examType,
        questionMode: 'Objective',
        subject,
        year: Number(q.examyear) || Number(year) || new Date().getFullYear(),
        questionText: q.question,
        options,
        correctAnswerIndex,
        explanation: q.solution || ''
      });

      await newQuestion.save();
      savedCount++;
    }

    res.json({ message: `Imported ${savedCount} questions successfully` });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;