const express = require('express');
const multer = require('multer');
const resumeController = require('../controllers/resumeController');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/resumes/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and DOC are allowed.'));
    }
  },
});

// FEATURE 01: Resume Upload & Parsing Routes

/**
 * API 1.1: Upload Resume
 * POST /api/resumes/upload
 * Body: { userId, fullName?, email?, phone? }
 * File: resume (PDF/DOC/DOCX)
 */
router.post('/upload', upload.single('resume'), resumeController.uploadResume);

/**
 * API 1.2: Parse Resume
 * POST /api/resumes/:resumeId/parse
 * Body: { skills[], experience[], education[], summary? }
 */
router.post('/:resumeId/parse', resumeController.parseResume);

/**
 * API 1.3: Get Resume by ID
 * GET /api/resumes/:resumeId
 */
router.get('/:resumeId', resumeController.getResume);

/**
 * API 1.4: Get All Resumes by User
 * GET /api/resumes/user/:userId
 */
router.get('/user/:userId', resumeController.getUserResumes);

/**
 * API 1.5: Update Resume
 * PUT /api/resumes/:resumeId
 */
router.put('/:resumeId', resumeController.updateResume);

/**
 * API 1.6: Delete Resume
 * DELETE /api/resumes/:resumeId
 */
router.delete('/:resumeId', resumeController.deleteResume);

/**
 * API 1.7: Download Resume File
 * GET /api/resumes/:resumeId/download
 */
router.get('/:resumeId/download', resumeController.downloadResume);

module.exports = router;
