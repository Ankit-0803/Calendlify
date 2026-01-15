const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { validate, bookingValidation } = require('../middleware/validation');

// Get available slots for a date (public)
router.get('/slots/:slug/:date', bookingController.getAvailableSlots);

// Create a booking (public)
router.post('/', bookingValidation.create, validate, bookingController.create);

// Get booking details
router.get('/:id', bookingController.getById);

// Cancel booking
router.put('/:id/cancel', bookingController.cancel);

// Reschedule booking
router.put('/:id/reschedule', bookingController.reschedule);

module.exports = router;
