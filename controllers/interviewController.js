const mongoose = require('mongoose'); // Make sure this is at the top
const Interview = require('../models/Interview');

exports.getInterviews = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "userId query parameter is required" });
    }

    // This finds only interviews belonging to this specific ID
    const interviews = await Interview.find({ user: userId }).sort({ createdAt: -1 });
    
    res.status(200).json(interviews);
  } catch (error) {
    console.error("Fetch Error:", error.message);
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

// @desc    Create new interview
exports.addInterview = async (req, res) => {
  try {
    const { company, role, date, color, notes, userId } = req.body;
    
    const interview = await Interview.create({
      user: req.body.userId, // Passed from frontend payload
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
exports.updateInterview = async (req, res) => {
  try {
    let interview = await Interview.findById(req.params.id);

    if (!interview) return res.status(404).json({ message: 'Not found' });

    // FIX: Use userId from body for authorization check
    if (interview.user.toString() !== req.body.userId) {
      return res.status(401).json({ message: 'Not authorized to update this' });
    }

    // We exclude userId from being updated directly via req.body spread
    const updatedData = { ...req.body };
    delete updatedData.userId;

    interview = await Interview.findByIdAndUpdate(
      req.params.id, 
      updatedData, 
      { new: true }
    );
    
    res.status(200).json(interview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete interview (Added this so your frontend delete works too)
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