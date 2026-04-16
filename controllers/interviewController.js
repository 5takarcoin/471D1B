import Interview from '../models/Interview.js';

// @desc    Get all interviews for logged in user
export const getInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(interviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new interview
export const addInterview = async (req, res) => {
  try {
    const { company, role, date, color, notes } = req.body;
    
    const interview = await Interview.create({
      user: req.body.userId,
      company,
      role,
      date,
      color,
      notes
    });

    res.status(201).json(interview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update interview
export const updateInterview = async (req, res) => {
  try {
    let interview = await Interview.findById(req.params.id);

    if (!interview) return res.status(404).json({ message: 'Not found' });

    // Make sure user owns the interview
    if (interview.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    interview = await Interview.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(interview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};