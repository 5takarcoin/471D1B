const express = require('express');
const router = express.Router();
const snfController = require('../controllers/snfController');

router.get('/search', snfController.searchAndFilterJobs);
router.get('/suggestions', snfController.getSearchSuggestions); // Feature Extension
router.get('/stats', snfController.getJobStats); // Feature Extension

router.post('/bookmarks/toggle', snfController.toggleBookmark);
router.get('/bookmarks/:userId', snfController.getMyBookmarks);

module.exports = router;