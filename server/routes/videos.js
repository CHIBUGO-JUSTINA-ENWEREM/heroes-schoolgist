const express = require('express');
const multer = require('multer');
const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary');
const Video = require('../models/Video');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 300 * 1024 * 1024 } });

router.post('/', upload.single('video'), async (req, res) => {
  try {
    const { title, subject, department, description, teacherId, teacherName } = req.body;
    if (!req.file) return res.status(400).json({ message: 'No video file received' });

    const streamUpload = () => new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: 'video', folder: 'heroes-schoolgist/videos' },
        (error, result) => (result ? resolve(result) : reject(error))
      );
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    const result = await streamUpload();

    const video = new Video({ title, subject, department, description, videoUrl: result.secure_url, teacherId, teacherName });
    await video.save();
    res.status(201).json(video);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not upload video' });
  }
});

router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.department) filter.department = req.query.department;
    const videos = await Video.find(filter).sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch videos' });
  }
});

router.get('/teacher/:teacherId', async (req, res) => {
  try {
    const videos = await Video.find({ teacherId: req.params.teacherId }).sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch videos' });
  }
});

router.post('/:id/view', async (req, res) => {
  try {
    await Video.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: 'Could not update views' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Video.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: 'Could not delete video' });
  }
});

module.exports = router;