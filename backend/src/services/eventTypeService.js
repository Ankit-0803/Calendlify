const prisma = require('../config/database');

/**
 * Get the default user (since no auth is required)
 */
async function getDefaultUser() {
    let user = await prisma.user.findFirst({
        where: { email: 'admin@calendlify.com' },
    });

    // Create default user if not exists
    if (!user) {
        user = await prisma.user.create({
            data: {
                name: 'Admin User',
                email: 'admin@calendlify.com',
                timezone: 'Asia/Kolkata',
            },
        });
    }

    return user;
}

/**
 * Get all event types for the default user
 */
async function getAllEventTypes() {
    const user = await getDefaultUser();
    return prisma.eventType.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
    });
}

/**
 * Get event type by ID
 */
async function getEventTypeById(id) {
    return prisma.eventType.findUnique({
        where: { id },
    });
}

/**
 * Get event type by slug (for public booking)
 */
async function getEventTypeBySlug(slug) {
    return prisma.eventType.findUnique({
        where: { slug },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    timezone: true,
                },
            },
        },
    });
}

/**
 * Create a new event type
 */
async function createEventType(data) {
    const user = await getDefaultUser();
    return prisma.eventType.create({
        data: {
            ...data,
            userId: user.id,
        },
    });
}

/**
 * Update an event type
 */
async function updateEventType(id, data) {
    return prisma.eventType.update({
        where: { id },
        data,
    });
}

/**
 * Delete an event type
 */
async function deleteEventType(id) {
    return prisma.eventType.delete({
        where: { id },
    });
}

/**
 * Check if slug is available
 */
async function isSlugAvailable(slug, excludeId = null) {
    const existing = await prisma.eventType.findUnique({
        where: { slug },
    });

    if (!existing) return true;
    if (excludeId && existing.id === excludeId) return true;
    return false;
}

module.exports = {
    getDefaultUser,
    getAllEventTypes,
    getEventTypeById,
    getEventTypeBySlug,
    createEventType,
    updateEventType,
    deleteEventType,
    isSlugAvailable,
};
