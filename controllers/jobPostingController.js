const JobPosting = require('../models/JobPosting');

// FEATURE 02: Job Posting & Management

/**
 * API 2.1: Create Job Posting
 * POST /api/jobs/create
 */
exports.createJobPosting = async (req, res) => {
  try {
    const {
      employerId,
      jobTitle,
      description,
      requiredSkills,
      qualifications,
      location,
      salary,
      jobType,
      experience,
      deadline,
    } = req.body;

    // Validation
    if (!employerId || !jobTitle || !description || !location) {
      return res.status(400).json({
        success: false,
        message:
          'employerId, jobTitle, description, and location are required',
      });
    }

    const jobPosting = new JobPosting({
      employerId,
      jobTitle,
      description,
      requiredSkills: requiredSkills || [],
      qualifications: qualifications || [],
      location,
      salary: salary || {},
      jobType: jobType || 'Full-Time',
      experience: experience || {},
      deadline: deadline || null,
      status: 'Open',
      applicantsCount: 0,
    });

    await jobPosting.save();

    res.status(201).json({
      success: true,
      message: 'Job posting created successfully',
      data: {
        jobId: jobPosting._id,
        jobTitle: jobPosting.jobTitle,
        status: jobPosting.status,
        createdAt: jobPosting.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating job posting',
      error: error.message,
    });
  }
};

/**
 * API 2.2: Get Job Posting by ID
 * GET /api/jobs/:jobId
 */
exports.getJobPosting = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await JobPosting.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found',
      });
    }

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching job posting',
      error: error.message,
    });
  }
};

/**
 * API 2.3: Get All Job Postings
 * GET /api/jobs
 */
exports.getAllJobPostings = async (req, res) => {
  try {
    const { status, location, jobType } = req.query;

    let filter = {};

    if (status) filter.status = status;
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (jobType) filter.jobType = jobType;

    const jobs = await JobPosting.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching job postings',
      error: error.message,
    });
  }
};

/**
 * API 2.4: Get Jobs by Employer
 * GET /api/jobs/employer/:employerId
 */
exports.getEmployerJobs = async (req, res) => {
  try {
    const { employerId } = req.params;

    const jobs = await JobPosting.find({ employerId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching employer jobs',
      error: error.message,
    });
  }
};

/**
 * API 2.5: Update Job Posting
 * PUT /api/jobs/:jobId
 */
exports.updateJobPosting = async (req, res) => {
  try {
    const { jobId } = req.params;
    const {
      jobTitle,
      description,
      requiredSkills,
      qualifications,
      location,
      salary,
      jobType,
      experience,
      status,
      deadline,
    } = req.body;

    const job = await JobPosting.findByIdAndUpdate(
      jobId,
      {
        jobTitle: jobTitle || undefined,
        description: description || undefined,
        requiredSkills: requiredSkills || undefined,
        qualifications: qualifications || undefined,
        location: location || undefined,
        salary: salary || undefined,
        jobType: jobType || undefined,
        experience: experience || undefined,
        status: status || undefined,
        deadline: deadline || undefined,
        updatedAt: Date.now(),
      },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Job posting updated successfully',
      data: job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating job posting',
      error: error.message,
    });
  }
};

/**
 * API 2.6: Close Job Posting
 * PUT /api/jobs/:jobId/close
 */
exports.closeJobPosting = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await JobPosting.findByIdAndUpdate(
      jobId,
      { status: 'Closed', updatedAt: Date.now() },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Job posting closed successfully',
      data: job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error closing job posting',
      error: error.message,
    });
  }
};

/**
 * API 2.7: Delete Job Posting
 * DELETE /api/jobs/:jobId
 */
exports.deleteJobPosting = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await JobPosting.findByIdAndDelete(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Job posting deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting job posting',
      error: error.message,
    });
  }
};

/**
 * API 2.8: Search Jobs by Skills
 * POST /api/jobs/search/skills
 */
exports.searchJobsBySkills = async (req, res) => {
  try {
    const { skills } = req.body;

    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Skills array is required',
      });
    }

    const jobs = await JobPosting.find({
      status: 'Open',
      requiredSkills: { $in: skills },
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching jobs',
      error: error.message,
    });
  }
};

/**
 * API 2.9: Update Applicant Count
 * PUT /api/jobs/:jobId/apply
 */
exports.incrementApplicants = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await JobPosting.findByIdAndUpdate(
      jobId,
      { $inc: { applicantsCount: 1 } },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Application recorded successfully',
      data: {
        jobId: job._id,
        applicantsCount: job.applicantsCount,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error recording application',
      error: error.message,
    });
  }
};
