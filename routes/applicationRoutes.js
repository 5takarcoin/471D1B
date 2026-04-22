const express = require("express");
const router = express.Router();
const Application = require("../models/Application");

// POST — applicant sends cover letter (applies)
router.post("/apply", async (req, res) => {
  const { jobId, applicantId, employerId, coverLetter, applicantName, jobTitle } = req.body;
  try {
    // prevent duplicate applications
    const existing = await Application.findOne({ jobId, applicantId });
    if (existing) return res.status(400).json({ success: false, message: "Already applied to this job" });

    const application = await Application.create({
      jobId, applicantId, employerId, coverLetter, applicantName, jobTitle
    });
    res.json({ success: true, data: application });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET — employer sees all applicants for their jobs
router.get("/employer/:employerId", async (req, res) => {
  try {
    const applications = await Application.find({ employerId: req.params.employerId })
      .sort({ createdAt: -1 });
    res.json({ success: true, data: applications });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET — applicant sees their own applications
router.get("/applicant/:applicantId", async (req, res) => {
  try {
    const applications = await Application.find({ applicantId: req.params.applicantId })
      .sort({ createdAt: -1 });
    res.json({ success: true, data: applications });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH — employer updates application status
router.patch("/:applicationId/status", async (req, res) => {
  const { status } = req.body;
  try {
    const application = await Application.findByIdAndUpdate(
      req.params.applicationId,
      { status },
      { new: true }
    );
    res.json({ success: true, data: application });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;