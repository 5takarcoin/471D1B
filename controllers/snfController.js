const Bookmark = require('../models/Bookmark');
const JobPosting = require('../models/JobPosting');

// API: Toggle Bookmark (Add if doesn't exist, Remove if it does)
exports.toggleBookmark = async (req, res) => {
  try {
    const { jobId, userId } = req.body; // In production, get userId from JWT token

    const existingBookmark = await Bookmark.findOne({ user: userId, job: jobId });

    if (existingBookmark) {
      await Bookmark.findOneAndDelete({ user: userId, job: jobId });
      return res.status(200).json({ success: true, message: "Bookmark removed", bookmarked: false });
    }

    const newBookmark = await Bookmark.create({ user: userId, job: jobId });
    res.status(201).json({ success: true, message: "Job bookmarked", bookmarked: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// API: Get all Bookmarked Jobs for a specific User
exports.getMyBookmarks = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Find bookmarks and "populate" the job details
    const bookmarks = await Bookmark.find({ user: userId }).populate('job');
    
    // Filter out bookmarks where the job might have been deleted by an admin
    const savedJobs = bookmarks.map(b => b.job).filter(j => j !== null);

    res.status(200).json({ success: true, data: savedJobs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// API: Advanced Search & Multi-Filter


exports.searchAndFilterJobs = async (req, res) => {
  try {
    const { keyword, location, jobType, minSalary, userId } = req.query;
    
    // 1. BUILD THE QUERY OBJECT
    let query = { status: 'Open' };

    // Keyword Search (Title or Skills)
    if (keyword && keyword.trim() !== "") {
      query.$or = [
        { jobTitle: { $regex: keyword, $options: 'i' } },
        { requiredSkills: { $in: [new RegExp(keyword, 'i')] } }
      ];
    }

    // Location Filter
    if (location && location.trim() !== "") {
      query.location = { $regex: location, $options: 'i' };
    }

    // Job Type Filter
    if (jobType && jobType !== 'All' && jobType !== "") {
      query.jobType = jobType;
    }

    // Salary Filter (Greater than or equal to minSalary)
    if (minSalary && Number(minSalary) > 0) {
      query['salary.min'] = { $gte: Number(minSalary) };
    }

    // 2. EXECUTE QUERY 
    // .lean() is required to allow us to add the 'isBookmarked' property later
    const jobs = await JobPosting.find(query).sort({ createdAt: -1 }).lean();

    // 3. FLAG BOOKMARKED JOBS
    // If the user is logged in, check their bookmarks collection
    if (userId && userId !== 'undefined') {
      const userBookmarks = await Bookmark.find({ user: userId }).select('job');
      
      // Create a Set of job IDs for O(1) lookup speed
      const bookmarkedJobIds = new Set(userBookmarks.map(b => b.job.toString()));
      
      jobs.forEach(job => {
        // Add a boolean flag so the frontend knows which icon to show
        job.isBookmarked = bookmarkedJobIds.has(job._id.toString());
      });
    } else {
      // If no user, all jobs are unbookmarked by default
      jobs.forEach(job => {
        job.isBookmarked = false;
      });
    }

    // 4. SEND RESPONSE
    res.status(200).json({ 
      success: true, 
      count: jobs.length, 
      data: jobs 
    });

  } catch (error) {
    console.error("SnF Controller Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal Server Error", 
      error: error.message 
    });
  }
};

// NEW API: Search Suggestions (For a "Typeahead" feature)
exports.getSearchSuggestions = async (req, res) => {
  try {
    const { query } = req.query;
    const suggestions = await JobPosting.find(
      { jobTitle: { $regex: query, $options: 'i' } },
      { jobTitle: 1 }
    ).limit(5);
    res.status(200).json({ success: true, data: suggestions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// NEW API: Job Stats (To show "Jobs Found" counts in the UI)
exports.getJobStats = async (req, res) => {
  try {
    const stats = await JobPosting.aggregate([
      { $group: { _id: "$jobType", count: { $sum: 1 } } }
    ]);
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};