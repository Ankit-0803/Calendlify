const express = require('express');
const router = express.Router();
const eventTypeController = require('../controllers/eventTypeController');
const { validate, eventTypeValidation } = require('../middleware/validation');

// Get all event types
router.get('/', eventTypeController.getAll);

// Get event type by slug (public - for booking page)
router.get('/slug/:slug', eventTypeController.getBySlug);

// Get event type by ID
router.get('/:id', eventTypeController.getById);

// Create new event type
router.post('/', eventTypeValidation.create, validate, eventTypeController.create);

// Update event type
router.put('/:id', eventTypeValidation.update, validate, eventTypeController.update);

// Delete event type
router.delete('/:id', eventTypeController.remove);

module.exports = router;
