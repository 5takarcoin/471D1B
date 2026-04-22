const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  applicantId: {
    type: String,
    required: true
  },
  employerId: {
    type: String,
    required: true
  },
  jobId: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  role: {
    type: String,
    required: [true, 'Job role is required']
  },
  date: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: '#B4B9E8'
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Interview', interviewSchema);