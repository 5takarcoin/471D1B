const Interview = require('../models/Interview');

// GET — applicant sees their scheduled interviews
exports.getInterviews = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: "userId is required" });
    const interviews = await Interview.find({ applicantId: userId }).sort({ createdAt: -1 });
    res.status(200).json(interviews);
  } catch (error) {
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

// POST — employer schedules interview for an applicant
exports.addInterview = async (req, res) => {
  try {
    const { applicantId, employerId, jobId, company, role, date, color, notes } = req.body;
    const interview = await Interview.create({
      applicantId, employerId, jobId, company, role, date, color, notes
    });
    res.status(201).json(interview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PATCH — employer updates interview
exports.updateInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) return res.status(404).json({ message: 'Not found' });

    const updated = await Interview.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE — employer deletes interview
exports.deleteInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) return res.status(404).json({ message: 'Not found' });
    await interview.deleteOne();
    res.status(200).json({ message: 'Interview removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};