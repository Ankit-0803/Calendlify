const prisma = require('../config/database');
const { getDefaultUser } = require('./eventTypeService');

/**
 * Get all meetings (bookings) with filter
 */
async function getMeetings(filter = 'all') {
    const user = await getDefaultUser();
    const now = new Date();

    let whereClause = {
        eventType: {
            userId: user.id,
        },
    };

    if (filter === 'upcoming') {
        whereClause.startTime = { gte: now };
        whereClause.status = { in: ['confirmed', 'rescheduled'] };
    } else if (filter === 'past') {
        whereClause.startTime = { lt: now };
    } else if (filter === 'cancelled') {
        whereClause.status = 'cancelled';
    }

    return prisma.booking.findMany({
        where: whereClause,
        include: {
            eventType: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    durationMinutes: true,
                    color: true,
                },
            },
        },
        orderBy: {
            startTime: filter === 'past' ? 'desc' : 'asc',
        },
    });
}

/**
 * Get meeting by ID
 */
async function getMeetingById(id) {
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
 * Get meeting counts for dashboard
 */
async function getMeetingCounts() {
    const user = await getDefaultUser();
    const now = new Date();

    const [upcoming, past, cancelled] = await Promise.all([
        prisma.booking.count({
            where: {
                eventType: { userId: user.id },
                startTime: { gte: now },
                status: { in: ['confirmed', 'rescheduled'] },
            },
        }),
        prisma.booking.count({
            where: {
                eventType: { userId: user.id },
                startTime: { lt: now },
            },
        }),
        prisma.booking.count({
            where: {
                eventType: { userId: user.id },
                status: 'cancelled',
            },
        }),
    ]);

    return { upcoming, past, cancelled };
}

module.exports = {
    getMeetings,
    getMeetingById,
    getMeetingCounts,
};
