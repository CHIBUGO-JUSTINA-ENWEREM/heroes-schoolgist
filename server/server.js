 require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const questionRoutes = require('./routes/questions');
const askedQuestionRoutes = require('./routes/askedQuestions');
const userRoutes = require('./routes/users');
const alocRoutes = require('./routes/aloc');
const guidanceRoutes = require('./routes/guidance');
const videoRoutes = require('./routes/videos');
const noteRoutes = require('./routes/notes');
const newsRoutes = require('./routes/news');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/asked-questions', askedQuestionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/aloc', alocRoutes);
app.use('/api/guidance', guidanceRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/news', newsRoutes);

app.get('/', (req, res) => {
  res.send('HEROES SchoolGist API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));