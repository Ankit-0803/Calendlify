const { validationResult, body, param, query } = require('express-validator');

/**
 * Middleware to check validation results
 */
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: 'Validation Error',
            details: errors.array(),
        });
    }
    next();
};

/**
 * Event Type validation rules
 */
const eventTypeValidation = {
    create: [
        body('name')
            .trim()
            .notEmpty().withMessage('Name is required')
            .isLength({ max: 100 }).withMessage('Name must be less than 100 characters'),
        body('slug')
            .trim()
            .notEmpty().withMessage('Slug is required')
            .matches(/^[a-z0-9-]+$/).withMessage('Slug must contain only lowercase letters, numbers, and hyphens'),
        body('durationMinutes')
            .isInt({ min: 5, max: 480 }).withMessage('Duration must be between 5 and 480 minutes'),
        body('description')
            .optional()
            .trim()
            .isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
        body('color')
            .optional()
            .matches(/^#[0-9A-Fa-f]{6}$/).withMessage('Color must be a valid hex color'),
    ],
    update: [
        body('name')
            .optional()
            .trim()
            .isLength({ max: 100 }).withMessage('Name must be less than 100 characters'),
        body('slug')
            .optional()
            .trim()
            .matches(/^[a-z0-9-]+$/).withMessage('Slug must contain only lowercase letters, numbers, and hyphens'),
        body('durationMinutes')
            .optional()
            .isInt({ min: 5, max: 480 }).withMessage('Duration must be between 5 and 480 minutes'),
    ],
};

/**
 * Booking validation rules
 */
const bookingValidation = {
    create: [
        body('eventTypeId')
            .notEmpty().withMessage('Event type ID is required')
            .isUUID().withMessage('Event type ID must be a valid UUID'),
        body('startTime')
            .notEmpty().withMessage('Start time is required')
            .isISO8601().withMessage('Start time must be a valid ISO 8601 date'),
        body('inviteeName')
            .trim()
            .notEmpty().withMessage('Invitee name is required')
            .isLength({ max: 100 }).withMessage('Name must be less than 100 characters'),
        body('inviteeEmail')
            .trim()
            .notEmpty().withMessage('Invitee email is required')
            .isEmail().withMessage('Must be a valid email address'),
        body('meetingNotes')
            .optional()
            .trim()
            .isLength({ max: 1000 }).withMessage('Notes must be less than 1000 characters'),
    ],
};

/**
 * Availability validation rules
 */
const availabilityValidation = {
    create: [
        body('name')
            .trim()
            .notEmpty().withMessage('Name is required')
            .isLength({ max: 100 }).withMessage('Name must be less than 100 characters'),
        body('rules')
            .isArray().withMessage('Rules must be an array'),
        body('rules.*.dayOfWeek')
            .isInt({ min: 0, max: 6 }).withMessage('Day of week must be between 0 (Sunday) and 6 (Saturday)'),
        body('rules.*.startTime')
            .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Start time must be in HH:mm format'),
        body('rules.*.endTime')
            .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('End time must be in HH:mm format'),
    ],
};

module.exports = {
    validate,
    eventTypeValidation,
    bookingValidation,
    availabilityValidation,
};
