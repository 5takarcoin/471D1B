const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  jobId: { type: String, required: true },
  applicantId: { type: String, required: true },
  employerId: { type: String, required: true },
  coverLetter: { type: String, required: true },
  applicantName: { type: String },
  jobTitle: { type: String },
  status: {
    type: String,
    enum: ['Applied', 'Shortlisted', 'Interview', 'Rejected'],
    default: 'Applied'
  },
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);