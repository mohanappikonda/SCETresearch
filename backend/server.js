const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
const facultyRoutes = require('./routes/facultyRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/api/faculty', facultyRoutes);
app.use('/api/auth', authRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.send('SCET Research Profile Management API is running...');
});

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('FATAL ERROR: MONGO_URI is not defined in environment variables.');
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB Cloud'))
  .catch(err => {
    console.error('MongoDB connection error details:', err.message);
    console.log('Ensure you have whitelisted the Render IP in MongoDB Atlas.');
  });

app.listen(PORT, () => {
  console.log(`Backend Server is live and running on port ${PORT}`);
});
