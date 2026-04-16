const express = require('express');
const router = express.Router();
const { 
    getInterviews, 
    addInterview, 
    updateInterview 
} = require('../controllers/interviewController');

// Using the .route() pattern to keep it clean
router.route('/')
    .get(getInterviews)
    .post(addInterview);

router.route('/:id')
    .put(updateInterview);

module.exports = router;