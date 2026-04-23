const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/database');
const resumeRoutes = require('./routes/resumeRoutes');
const jobPostingRoutes = require('./routes/jobPostingRoutes');
const authRoutes = require('./routes/authRoutes');
const searchRoutes = require('./routes/searchRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const coverLetterRoute = require("./routes/coverLetter");
const profileRoute = require("./routes/profile");
const applicationRoutes = require("./routes/applicationRoutes");

const app = express();
const PORT = process.env.PORT || 1008;
const HOST = process.env.HOST || '0.0.0.0';

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.options("*", cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, 'uploads', 'resumes');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Routes

// FEATURE 01: Resume Upload & Parsing Routes
app.use('/api/resumes', resumeRoutes);

// FEATURE 02: Job Posting & Management Routes
app.use('/api/jobs', jobPostingRoutes);

app.use('/api/auth', authRoutes);

app.use('/api/search', searchRoutes);
app.use('/api/interview', interviewRoutes);

app.use("/api/cover-letter", coverLetterRoute);
app.use("/api/profile", profileRoute);
app.use("/api/applications", applicationRoutes);



// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date(),
    port: PORT,
  });
});

// Root Endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Resume & Job Portal API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      resumes: '/api/resumes',
      jobs: '/api/jobs',
    },
  });
});

// 404 Error Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: err.message,
  });
});

// Start Server
app.listen(PORT, HOST, () => {
  console.log(`\n========================================`);
  console.log(`Server started successfully!`);
  console.log(`Host: ${HOST}`);
  console.log(`Port: ${PORT}`);
  console.log(`URL: http://localhost:${PORT}`);

});

module.exports = app;
