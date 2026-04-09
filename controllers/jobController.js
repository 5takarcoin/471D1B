const JobPosting = require('../models/JobPosting');

exports.searchJobs = async (req, res) => {
  try {
    const { keyword, location, jobType, minSalary } = req.query;
    let query = {};

    // 1. Keyword Search (Title or Description)
    if (keyword) {
      query.$or = [
        { jobTitle: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ];
    }

    // 2. Filter by Location
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // 3. Filter by Job Type (Full-Time, Internship, etc.)
    if (jobType) {
      query.jobType = jobType;
    }

    // 4. Filter by Salary Range
    if (minSalary) {
      query['salary.min'] = { $gte: Number(minSalary) };
    }

    const jobs = await JobPosting.find(query).sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ error: "Search failed" });
  }
};