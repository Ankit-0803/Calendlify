const express = require('express');
const router = express.Router();
const meetingController = require('../controllers/meetingController');

// Get meeting counts
router.get('/counts', meetingController.getCounts);

// Get all meetings (with optional filter: upcoming, past, cancelled)
router.get('/', meetingController.getAll);

// Get meeting by ID
router.get('/:id', meetingController.getById);

// Cancel meeting
router.put('/:id/cancel', meetingController.cancel);

module.exports = router;
