const mongoose = require('mongoose');

const jobPostingSchema = new mongoose.Schema(
  {
    employerId: {
      type: String,
      required: true,
    },
    jobTitle: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    requiredSkills: [
      {
        type: String,
      },
    ],
    qualifications: [
      {
        type: String,
      },
    ],
    location: {
      type: String,
      required: true,
    },
    salary: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: 'USD',
      },
    },
    jobType: {
      type: String,
      enum: ['Full-Time', 'Part-Time', 'Contract', 'Internship'],
      default: 'Full-Time',
    },
    experience: {
      min: Number, // in years
      max: Number, // in years
    },
    status: {
      type: String,
      enum: ['Open', 'Closed', 'On Hold'],
      default: 'Open',
    },
    deadline: Date,
    applicantsCount: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('JobPosting', jobPostingSchema);
