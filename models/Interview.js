const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
    type: String, // Matches your frontend "DD/MM/YYYY" format
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
  timestamps: true // Automatically adds createdAt and updatedAt
});

// CRITICAL: Use module.exports for CommonJS compatibility
module.exports = mongoose.model('Interview', interviewSchema);