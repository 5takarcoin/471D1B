const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobPosting',
    required: true,
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  employerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  scheduledDate: {
    type: Date,
    required: true,
  },
  meetingLink: String, // Zoom/Google Meet
  status: {
    type: String,
    enum: ['Pending', 'Scheduled', 'Cancelled', 'Completed'],
    default: 'Pending',
  },
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Interview', interviewSchema);