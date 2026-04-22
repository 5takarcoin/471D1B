const express = require('express');
const jobPostingController = require('../controllers/jobPostingController');
const JobPosting = require("../models/JobPosting");

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

// GET /api/jobs/recommendations/:userId
router.get("/recommendations/:userId", async (req, res) => {
  try {
    const Groq = require("groq-sdk");
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const Profile = require("../models/Profile");

    // get user profile
    const profile = await Profile.findOne({ userId: req.params.userId });
    if (!profile || !profile.skills.length) {
      return res.status(404).json({ success: false, message: "No skills found in profile" });
    }

    // fetch all open jobs
    const jobs = await JobPosting.find({ status: "Open" });
    if (!jobs.length) {
      return res.status(404).json({ success: false, message: "No jobs found" });
    }

    // prepare simplified job list for Groq
    const jobList = jobs.map(j => ({
      id: j._id,
      title: j.jobTitle,
      requiredSkills: j.requiredSkills,
      description: j.description.substring(0, 200), // trim to save tokens
      location: j.location,
      jobType: j.jobType,
    }));

    const prompt = `
      You are a job recommendation engine.
      
      Candidate profile:
      - Name: ${profile.name || "Candidate"}
      - Skills: ${profile.skills.join(", ")}
      - Experience: ${profile.experience || "Not specified"}
      - Education: ${profile.education || "Not specified"}

      Here are the available jobs:
      ${JSON.stringify(jobList, null, 2)}

      Analyze the candidate's profile against each job and return the top 5 most suitable jobs.
      
      Respond ONLY with a valid JSON array, no explanation, no markdown, no backticks. Like this:
      [
        {
          "id": "job_id_here",
          "matchScore": 85,
          "reason": "Your React and Node.js skills align well with this role..."
        }
      ]
      
      Order by matchScore descending. matchScore should be 0-100.
    `;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
    });

    // parse Groq response
    const raw = response.choices[0].message.content;
    const clean = raw.replace(/```json|```/g, "").trim();
    const ranked = JSON.parse(clean);

    // attach full job details to each recommendation
    const result = ranked.map(rec => {
      const fullJob = jobs.find(j => j._id.toString() === rec.id.toString());
      return {
        ...fullJob.toObject(),
        matchScore: rec.matchScore,
        reason: rec.reason,
      };
    }).filter(j => j._id); // remove any unmatched

    res.json({ success: true, data: result });
  } catch (err) {
    console.error("Recommendation error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

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
