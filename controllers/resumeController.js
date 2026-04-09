const Resume = require('../models/Resume');
const fs = require('fs');
const path = require('path');

// FEATURE 01: Resume Upload & Parsing

/**
 * API 1.1: Upload Resume
 * POST /api/resumes/upload
 */
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    const { userId, fullName, email, phone } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }

    // Extract file type
    const fileType = req.file.mimetype.includes('pdf')
      ? 'pdf'
      : req.file.mimetype.includes('word')
      ? 'docx'
      : 'doc';

    const resume = new Resume({
      userId,
      fileName: req.file.originalname,
      fileType,
      filePath: req.file.path,
      fullName: fullName || 'Not Provided',
      email: email || 'Not Provided',
      phone: phone || 'Not Provided',
      skills: [],
      experience: [],
      education: [],
      rawText: '',
    });

    await resume.save();

    res.status(201).json({
      success: true,
      message: 'Resume uploaded successfully',
      data: {
        resumeId: resume._id,
        fileName: resume.fileName,
        uploadedAt: resume.uploadedAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error uploading resume',
      error: error.message,
    });
  }
};

/**
 * API 1.2: Parse Resume (Extract Skills & Experience)
 * POST /api/resumes/:resumeId/parse
 */
exports.parseResume = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const { skills, experience, education, summary } = req.body;

    const resume = await Resume.findByIdAndUpdate(
      resumeId,
      {
        skills: skills || [],
        experience: experience || [],
        education: education || [],
        summary: summary || '',
      },
      { new: true }
    );

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Resume parsed successfully',
      data: {
        resumeId: resume._id,
        skills: resume.skills,
        experience: resume.experience,
        education: resume.education,
        summary: resume.summary,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error parsing resume',
      error: error.message,
    });
  }
};

/**
 * API 1.3: Get Resume by ID
 * GET /api/resumes/:resumeId
 */
exports.getResume = async (req, res) => {
  try {
    const { resumeId } = req.params;

    const resume = await Resume.findById(resumeId);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    res.status(200).json({
      success: true,
      data: resume,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching resume',
      error: error.message,
    });
  }
};

/**
 * API 1.4: Get All Resumes by User
 * GET /api/resumes/user/:userId
 */
exports.getUserResumes = async (req, res) => {
  try {
    const { userId } = req.params;

    const resumes = await Resume.find({ userId }).sort({ uploadedAt: -1 });

    res.status(200).json({
      success: true,
      count: resumes.length,
      data: resumes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching resumes',
      error: error.message,
    });
  }
};

/**
 * API 1.5: Update Resume
 * PUT /api/resumes/:resumeId
 */
exports.updateResume = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const { skills, experience, education, fullName, email, phone, summary } =
      req.body;

    const resume = await Resume.findByIdAndUpdate(
      resumeId,
      {
        skills: skills || undefined,
        experience: experience || undefined,
        education: education || undefined,
        fullName: fullName || undefined,
        email: email || undefined,
        phone: phone || undefined,
        summary: summary || undefined,
      },
      { new: true }
    );

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Resume updated successfully',
      data: resume,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating resume',
      error: error.message,
    });
  }
};

/**
 * API 1.6: Delete Resume
 * DELETE /api/resumes/:resumeId
 */
exports.deleteResume = async (req, res) => {
  try {
    const { resumeId } = req.params;

    const resume = await Resume.findByIdAndDelete(resumeId);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    // Delete file from server
    if (fs.existsSync(resume.filePath)) {
      fs.unlinkSync(resume.filePath);
    }

    res.status(200).json({
      success: true,
      message: 'Resume deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting resume',
      error: error.message,
    });
  }
};

/**
 * API 1.7: Download Resume File
 * GET /api/resumes/:resumeId/download
 */
exports.downloadResume = async (req, res) => {
  try {
    const { resumeId } = req.params;

    const resume = await Resume.findById(resumeId);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    res.download(resume.filePath, resume.fileName);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error downloading resume',
      error: error.message,
    });
  }
};
