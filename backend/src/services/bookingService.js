const prisma = require('../config/database');
const { getEventTypeBySlug } = require('./eventTypeService');
const { getAvailabilityForDay } = require('./availabilityService');
const { generateTimeSlots, filterBookedSlots, getDayBounds } = require('../utils/dateUtils');

/**
 * Get available time slots for a specific date and event type
 */
async function getAvailableSlots(slug, date) {
    // Get event type
    const eventType = await getEventTypeBySlug(slug);
    if (!eventType) {
        throw new Error('Event type not found');
    }

    if (!eventType.isActive) {
        throw new Error('Event type is not active');
    }

    // Get availability for this day
    const dayAvailability = await getAvailabilityForDay(date);
    if (!dayAvailability) {
        return []; // Not available on this day
    }

    // Generate all possible slots
    const allSlots = generateTimeSlots(
        date,
        dayAvailability.startTime,
        dayAvailability.endTime,
        eventType.durationMinutes
    );

    // Get existing bookings for this date
    const { start, end } = getDayBounds(date);
    const existingBookings = await prisma.booking.findMany({
        where: {
            eventTypeId: eventType.id,
            status: 'confirmed',
            startTime: {
                gte: start,
                lt: end,
            },
        },
        select: {
            startTime: true,
            endTime: true,
        },
    });

    // Filter out booked slots
    const availableSlots = filterBookedSlots(allSlots, existingBookings);

    // Filter out past slots if date is today
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const requestDate = new Date(date);
    requestDate.setHours(0, 0, 0, 0);

    if (requestDate.getTime() === today.getTime()) {
        return availableSlots.filter(slot => new Date(slot.startTime) > now);
    }

    // Don't show slots for past dates
    if (requestDate < today) {
        return [];
    }

    return availableSlots;
}

/**
 * Create a new booking
 */
async function createBooking(data) {
    const { eventTypeId, startTime, inviteeName, inviteeEmail, meetingNotes } = data;

    // Get event type
    const eventType = await prisma.eventType.findUnique({
        where: { id: eventTypeId },
    });

    if (!eventType) {
        throw new Error('Event type not found');
    }

    if (!eventType.isActive) {
        throw new Error('Event type is not active');
    }

    const bookingStart = new Date(startTime);
    const bookingEnd = new Date(bookingStart.getTime() + eventType.durationMinutes * 60 * 1000);

    // Check for double booking
    const existingBooking = await prisma.booking.findFirst({
        where: {
            eventTypeId,
            status: 'confirmed',
            OR: [
                {
                    AND: [
                        { startTime: { lte: bookingStart } },
                        { endTime: { gt: bookingStart } },
                    ],
                },
                {
                    AND: [
                        { startTime: { lt: bookingEnd } },
                        { endTime: { gte: bookingEnd } },
                    ],
                },
                {
                    AND: [
                        { startTime: { gte: bookingStart } },
                        { endTime: { lte: bookingEnd } },
                    ],
                },
            ],
        },
    });

    if (existingBooking) {
        throw new Error('This time slot is no longer available');
    }

    // Create booking
    return prisma.booking.create({
        data: {
            eventTypeId,
            startTime: bookingStart,
            endTime: bookingEnd,
            inviteeName,
            inviteeEmail,
            meetingNotes,
            status: 'confirmed',
        },
        include: {
            eventType: {
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true,
                        },
                    },
                },
            },
        },
    });
}

/**
 * Get booking by ID
 */
async function getBookingById(id) {
    return prisma.booking.findUnique({
        where: { id },
        include: {
            eventType: {
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true,
                            timezone: true,
                        },
                    },
                },
            },
        },
    });
}

/**
 * Cancel a booking
 */
async function cancelBooking(id) {
    return prisma.booking.update({
        where: { id },
        data: { status: 'cancelled' },
        include: {
            eventType: true,
        },
    });
}

/**
 * Reschedule a booking
 */
async function rescheduleBooking(id, newStartTime) {
    const booking = await prisma.booking.findUnique({
        where: { id },
        include: { eventType: true },
    });

    if (!booking) {
        throw new Error('Booking not found');
    }

    const newStart = new Date(newStartTime);
    const newEnd = new Date(newStart.getTime() + booking.eventType.durationMinutes * 60 * 1000);

    // Check for conflicts (excluding current booking)
    const conflict = await prisma.booking.findFirst({
        where: {
            id: { not: id },
            eventTypeId: booking.eventTypeId,
            status: 'confirmed',
            OR: [
                {
                    AND: [
                        { startTime: { lte: newStart } },
                        { endTime: { gt: newStart } },
                    ],
                },
                {
                    AND: [
                        { startTime: { lt: newEnd } },
                        { endTime: { gte: newEnd } },
                    ],
                },
            ],
        },
    });

    if (conflict) {
        throw new Error('The new time slot is not available');
    }

    return prisma.booking.update({
        where: { id },
        data: {
            startTime: newStart,
            endTime: newEnd,
            status: 'rescheduled',
        },
        include: {
            eventType: true,
        },
    });
}

module.exports = {
    getAvailableSlots,
    createBooking,
    getBookingById,
    cancelBooking,
    rescheduleBooking,
};
