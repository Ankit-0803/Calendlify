const express = require('express');
const router = express.Router();
const availabilityController = require('../controllers/availabilityController');
const { validate, availabilityValidation } = require('../middleware/validation');

// Get all availability schedules
router.get('/', availabilityController.getAll);

// Get default availability
router.get('/default', availabilityController.getDefault);

// Get availability by ID
router.get('/:id', availabilityController.getById);

// Create new availability schedule
router.post('/', availabilityValidation.create, validate, availabilityController.create);

// Update availability schedule
router.put('/:id', availabilityController.update);

// Add date override
router.post('/:id/overrides', availabilityController.addOverride);

// Remove date override
router.delete('/overrides/:overrideId', availabilityController.removeOverride);

module.exports = router;
