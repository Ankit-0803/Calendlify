const bookingService = require('../services/bookingService');

/**
 * Get available slots for a date
 */
async function getAvailableSlots(req, res, next) {
    try {
        const { slug, date } = req.params;

        if (!date) {
            return res.status(400).json({ error: 'Date is required' });
        }

        const slots = await bookingService.getAvailableSlots(slug, date);
        res.json({ data: slots });
    } catch (error) {
        if (error.message === 'Event type not found') {
            return res.status(404).json({ error: error.message });
        }
        next(error);
    }
}

/**
 * Create a booking
 */
async function create(req, res, next) {
    try {
        const { eventTypeId, startTime, inviteeName, inviteeEmail, meetingNotes } = req.body;

        const booking = await bookingService.createBooking({
            eventTypeId,
            startTime,
            inviteeName,
            inviteeEmail,
            meetingNotes,
        });

        res.status(201).json({
            data: booking,
            message: 'Meeting scheduled successfully!'
        });
    } catch (error) {
        if (error.message === 'Event type not found') {
            return res.status(404).json({ error: error.message });
        }
        if (error.message === 'This time slot is no longer available') {
            return res.status(409).json({ error: error.message });
        }
        next(error);
    }
}

/**
 * Get booking details
 */
async function getById(req, res, next) {
    try {
        const booking = await bookingService.getBookingById(req.params.id);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        res.json({ data: booking });
    } catch (error) {
        next(error);
    }
}

/**
 * Cancel a booking
 */
async function cancel(req, res, next) {
    try {
        const { id } = req.params;

        const booking = await bookingService.getBookingById(id);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        if (booking.status === 'cancelled') {
            return res.status(400).json({ error: 'Booking is already cancelled' });
        }

        const cancelled = await bookingService.cancelBooking(id);
        res.json({ data: cancelled, message: 'Booking cancelled successfully' });
    } catch (error) {
        next(error);
    }
}

/**
 * Reschedule a booking
 */
async function reschedule(req, res, next) {
    try {
        const { id } = req.params;
        const { newStartTime } = req.body;

        if (!newStartTime) {
            return res.status(400).json({ error: 'New start time is required' });
        }

        const booking = await bookingService.rescheduleBooking(id, newStartTime);
        res.json({ data: booking, message: 'Booking rescheduled successfully' });
    } catch (error) {
        if (error.message === 'Booking not found') {
            return res.status(404).json({ error: error.message });
        }
        if (error.message === 'The new time slot is not available') {
            return res.status(409).json({ error: error.message });
        }
        next(error);
    }
}

module.exports = {
    getAvailableSlots,
    create,
    getById,
    cancel,
    reschedule,
};
