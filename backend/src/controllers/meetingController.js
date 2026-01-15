const meetingService = require('../services/meetingService');
const bookingService = require('../services/bookingService');

/**
 * Get meetings with filter
 */
async function getAll(req, res, next) {
    try {
        const { filter } = req.query; // upcoming, past, cancelled, all
        const meetings = await meetingService.getMeetings(filter || 'all');
        res.json({ data: meetings });
    } catch (error) {
        next(error);
    }
}

/**
 * Get meeting by ID
 */
async function getById(req, res, next) {
    try {
        const meeting = await meetingService.getMeetingById(req.params.id);
        if (!meeting) {
            return res.status(404).json({ error: 'Meeting not found' });
        }
        res.json({ data: meeting });
    } catch (error) {
        next(error);
    }
}

/**
 * Get meeting counts for dashboard
 */
async function getCounts(req, res, next) {
    try {
        const counts = await meetingService.getMeetingCounts();
        res.json({ data: counts });
    } catch (error) {
        next(error);
    }
}

/**
 * Cancel a meeting
 */
async function cancel(req, res, next) {
    try {
        const { id } = req.params;

        const meeting = await meetingService.getMeetingById(id);
        if (!meeting) {
            return res.status(404).json({ error: 'Meeting not found' });
        }

        if (meeting.status === 'cancelled') {
            return res.status(400).json({ error: 'Meeting is already cancelled' });
        }

        const cancelled = await bookingService.cancelBooking(id);
        res.json({ data: cancelled, message: 'Meeting cancelled successfully' });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAll,
    getById,
    getCounts,
    cancel,
};
