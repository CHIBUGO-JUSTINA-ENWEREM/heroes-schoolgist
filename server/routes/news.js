const express = require('express');
const multer = require('multer');
const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary');
const News = require('../models/News');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, message, examType, postedById, postedByName, postedByRole } = req.body;
    if (!title || !message) return res.status(400).json({ message: 'Title and message are required' });

    let imageUrl = '';

    if (req.file) {
      const streamUpload = () => new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: 'image', folder: 'heroes-schoolgist/news' },
          (error, result) => (result ? resolve(result) : reject(error))
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
      const result = await streamUpload();
      imageUrl = result.secure_url;
    }

    const news = new News({
      title,
      message,
      examType: examType || 'General',
      imageUrl,
      postedById,
      postedByName,
      postedByRole
    });
    await news.save();
    res.status(201).json(news);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not post news' });
  }
});

router.get('/', async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch news' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await News.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: 'Could not delete news' });
  }
});

module.exports = router;