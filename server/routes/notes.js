const express = require('express');
const multer = require('multer');
const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary');
const Note = require('../models/Note');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

router.post('/', upload.single('note'), async (req, res) => {
  try {
    const { title, subject, department, description, teacherId, teacherName } = req.body;
    if (!req.file) return res.status(400).json({ message: 'No file received' });

    const streamUpload = () => new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: 'raw', folder: 'heroes-schoolgist/notes' },
        (error, result) => (result ? resolve(result) : reject(error))
      );
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    const result = await streamUpload();

    const note = new Note({ title, subject, department, description, fileUrl: result.secure_url, teacherId, teacherName });
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not upload notes' });
  }
});

router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.department) filter.department = req.query.department;
    const notes = await Note.find(filter).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch notes' });
  }
});

router.get('/teacher/:teacherId', async (req, res) => {
  try {
    const notes = await Note.find({ teacherId: req.params.teacherId }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch notes' });
  }
});

router.post('/:id/download', async (req, res) => {
  try {
    await Note.findByIdAndUpdate(req.params.id, { $inc: { downloads: 1 } });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: 'Could not update downloads' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: 'Could not delete note' });
  }
});

module.exports = router;
