const availabilityService = require('../services/availabilityService');

/**
 * Get all availability schedules
 */
async function getAll(req, res, next) {
    try {
        const availabilities = await availabilityService.getAllAvailabilities();
        res.json({ data: availabilities });
    } catch (error) {
        next(error);
    }
}

/**
 * Get availability by ID
 */
async function getById(req, res, next) {
    try {
        const availability = await availabilityService.getAvailabilityById(req.params.id);
        if (!availability) {
            return res.status(404).json({ error: 'Availability schedule not found' });
        }
        res.json({ data: availability });
    } catch (error) {
        next(error);
    }
}

/**
 * Get default availability
 */
async function getDefault(req, res, next) {
    try {
        const availability = await availabilityService.getDefaultAvailability();
        res.json({ data: availability });
    } catch (error) {
        next(error);
    }
}

/**
 * Create availability schedule
 */
async function create(req, res, next) {
    try {
        const { name, rules, isDefault } = req.body;

        const availability = await availabilityService.createAvailability({
            name,
            rules,
            isDefault,
        });

        res.status(201).json({ data: availability, message: 'Availability schedule created successfully' });
    } catch (error) {
        next(error);
    }
}

/**
 * Update availability schedule
 */
async function update(req, res, next) {
    try {
        const { id } = req.params;
        const { name, rules, isDefault } = req.body;

        const existing = await availabilityService.getAvailabilityById(id);
        if (!existing) {
            return res.status(404).json({ error: 'Availability schedule not found' });
        }

        const availability = await availabilityService.updateAvailability(id, {
            name,
            rules,
            isDefault,
        });

        res.json({ data: availability, message: 'Availability schedule updated successfully' });
    } catch (error) {
        next(error);
    }
}

/**
 * Add date override
 */
async function addOverride(req, res, next) {
    try {
        const { id } = req.params;
        const { date, startTime, endTime, isUnavailable } = req.body;

        const existing = await availabilityService.getAvailabilityById(id);
        if (!existing) {
            return res.status(404).json({ error: 'Availability schedule not found' });
        }

        const override = await availabilityService.addDateOverride(id, {
            date,
            startTime,
            endTime,
            isUnavailable,
        });

        res.status(201).json({ data: override, message: 'Date override added successfully' });
    } catch (error) {
        next(error);
    }
}

/**
 * Remove date override
 */
async function removeOverride(req, res, next) {
    try {
        const { overrideId } = req.params;

        await availabilityService.removeDateOverride(overrideId);
        res.json({ message: 'Date override removed successfully' });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAll,
    getById,
    getDefault,
    create,
    update,
    addOverride,
    removeOverride,
};
