const express = require('express');
const jobPostingController = require('../controllers/jobPostingController');

const router = express.Router();

// FEATURE 02: Job Posting & Management Routes

/**
 * API 2.1: Create Job Posting
 * POST /api/jobs/create
 * Body: { employerId, jobTitle, description, requiredSkills[], qualifications[], location, salary?, jobType?, experience?, deadline? }
 */
router.post('/create', jobPostingController.createJobPosting);

/**
 * API 2.2: Get Job Posting by ID
 * GET /api/jobs/:jobId
 */
router.get('/:jobId', jobPostingController.getJobPosting);

/**
 * API 2.3: Get All Job Postings
 * GET /api/jobs?status=Open&location=&jobType=
 * Query params: status?, location?, jobType?
 */
router.get('/', jobPostingController.getAllJobPostings);

/**
 * API 2.4: Get Jobs by Employer
 * GET /api/jobs/employer/:employerId
 */
router.get('/employer/:employerId', jobPostingController.getEmployerJobs);

/**
 * API 2.5: Update Job Posting
 * PUT /api/jobs/:jobId
 * Body: Any fields to update
 */
router.put('/:jobId', jobPostingController.updateJobPosting);

/**
 * API 2.6: Close Job Posting
 * PUT /api/jobs/:jobId/close
 */
router.put('/:jobId/close', jobPostingController.closeJobPosting);

/**
 * API 2.7: Delete Job Posting
 * DELETE /api/jobs/:jobId
 */
router.delete('/:jobId', jobPostingController.deleteJobPosting);

/**
 * API 2.8: Search Jobs by Skills
 * POST /api/jobs/search/skills
 * Body: { skills[] }
 */
router.post('/search/skills', jobPostingController.searchJobsBySkills);

/**
 * API 2.9: Apply to Job (Increment Applicants)
 * PUT /api/jobs/:jobId/apply
 */
router.put('/:jobId/apply', jobPostingController.incrementApplicants);

module.exports = router;
