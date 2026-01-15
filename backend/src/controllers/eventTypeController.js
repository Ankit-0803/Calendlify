const eventTypeService = require('../services/eventTypeService');

/**
 * Get all event types
 */
async function getAll(req, res, next) {
    try {
        const eventTypes = await eventTypeService.getAllEventTypes();
        res.json({ data: eventTypes });
    } catch (error) {
        next(error);
    }
}

/**
 * Get single event type by ID
 */
async function getById(req, res, next) {
    try {
        const eventType = await eventTypeService.getEventTypeById(req.params.id);
        if (!eventType) {
            return res.status(404).json({ error: 'Event type not found' });
        }
        res.json({ data: eventType });
    } catch (error) {
        next(error);
    }
}

/**
 * Get event type by slug (for public booking)
 */
async function getBySlug(req, res, next) {
    try {
        const eventType = await eventTypeService.getEventTypeBySlug(req.params.slug);
        if (!eventType) {
            return res.status(404).json({ error: 'Event type not found' });
        }
        res.json({ data: eventType });
    } catch (error) {
        next(error);
    }
}

/**
 * Create new event type
 */
async function create(req, res, next) {
    try {
        const { name, slug, durationMinutes, description, color } = req.body;

        // Check slug availability
        const isAvailable = await eventTypeService.isSlugAvailable(slug);
        if (!isAvailable) {
            return res.status(409).json({ error: 'Slug already in use' });
        }

        const eventType = await eventTypeService.createEventType({
            name,
            slug,
            durationMinutes,
            description,
            color,
        });

        res.status(201).json({ data: eventType, message: 'Event type created successfully' });
    } catch (error) {
        next(error);
    }
}

/**
 * Update event type
 */
async function update(req, res, next) {
    try {
        const { id } = req.params;
        const { name, slug, durationMinutes, description, color, isActive } = req.body;

        // Check if event exists
        const existing = await eventTypeService.getEventTypeById(id);
        if (!existing) {
            return res.status(404).json({ error: 'Event type not found' });
        }

        // Check slug availability if changing
        if (slug && slug !== existing.slug) {
            const isAvailable = await eventTypeService.isSlugAvailable(slug, id);
            if (!isAvailable) {
                return res.status(409).json({ error: 'Slug already in use' });
            }
        }

        const eventType = await eventTypeService.updateEventType(id, {
            name,
            slug,
            durationMinutes,
            description,
            color,
            isActive,
        });

        res.json({ data: eventType, message: 'Event type updated successfully' });
    } catch (error) {
        next(error);
    }
}

/**
 * Delete event type
 */
async function remove(req, res, next) {
    try {
        const { id } = req.params;

        const existing = await eventTypeService.getEventTypeById(id);
        if (!existing) {
            return res.status(404).json({ error: 'Event type not found' });
        }

        await eventTypeService.deleteEventType(id);
        res.json({ message: 'Event type deleted successfully' });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAll,
    getById,
    getBySlug,
    create,
    update,
    remove,
};
