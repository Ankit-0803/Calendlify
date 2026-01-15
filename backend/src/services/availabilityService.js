const prisma = require('../config/database');
const { getDefaultUser } = require('./eventTypeService');

/**
 * Get the default availability for the user
 */
async function getDefaultAvailability() {
    const user = await getDefaultUser();

    let availability = await prisma.availability.findFirst({
        where: {
            userId: user.id,
            isDefault: true,
        },
        include: {
            rules: true,
            overrides: true,
        },
    });

    // Create default availability if not exists
    if (!availability) {
        availability = await prisma.availability.create({
            data: {
                userId: user.id,
                name: 'Working Hours',
                isDefault: true,
                rules: {
                    create: [
                        { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' },
                        { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' },
                        { dayOfWeek: 3, startTime: '09:00', endTime: '17:00' },
                        { dayOfWeek: 4, startTime: '09:00', endTime: '17:00' },
                        { dayOfWeek: 5, startTime: '09:00', endTime: '17:00' },
                    ],
                },
            },
            include: {
                rules: true,
                overrides: true,
            },
        });
    }

    return availability;
}

/**
 * Get all availability schedules
 */
async function getAllAvailabilities() {
    const user = await getDefaultUser();
    return prisma.availability.findMany({
        where: { userId: user.id },
        include: {
            rules: {
                orderBy: { dayOfWeek: 'asc' },
            },
            overrides: {
                orderBy: { date: 'asc' },
            },
        },
    });
}

/**
 * Get availability by ID
 */
async function getAvailabilityById(id) {
    return prisma.availability.findUnique({
        where: { id },
        include: {
            rules: {
                orderBy: { dayOfWeek: 'asc' },
            },
            overrides: {
                orderBy: { date: 'asc' },
            },
        },
    });
}

/**
 * Create availability schedule
 */
async function createAvailability(data) {
    const user = await getDefaultUser();

    const { name, rules, isDefault } = data;

    // If this is set as default, unset other defaults
    if (isDefault) {
        await prisma.availability.updateMany({
            where: { userId: user.id },
            data: { isDefault: false },
        });
    }

    return prisma.availability.create({
        data: {
            userId: user.id,
            name,
            isDefault: isDefault || false,
            rules: {
                create: rules.map(rule => ({
                    dayOfWeek: rule.dayOfWeek,
                    startTime: rule.startTime,
                    endTime: rule.endTime,
                })),
            },
        },
        include: {
            rules: true,
            overrides: true,
        },
    });
}

/**
 * Update availability schedule
 */
async function updateAvailability(id, data) {
    const { name, rules, isDefault } = data;
    const user = await getDefaultUser();

    // If setting as default, unset others
    if (isDefault) {
        await prisma.availability.updateMany({
            where: { userId: user.id, NOT: { id } },
            data: { isDefault: false },
        });
    }

    // Delete existing rules if new rules provided
    if (rules) {
        await prisma.availabilityRule.deleteMany({
            where: { availabilityId: id },
        });
    }

    return prisma.availability.update({
        where: { id },
        data: {
            name,
            isDefault,
            ...(rules && {
                rules: {
                    create: rules.map(rule => ({
                        dayOfWeek: rule.dayOfWeek,
                        startTime: rule.startTime,
                        endTime: rule.endTime,
                    })),
                },
            }),
        },
        include: {
            rules: true,
            overrides: true,
        },
    });
}

/**
 * Add date override
 */
async function addDateOverride(availabilityId, override) {
    const { date, startTime, endTime, isUnavailable } = override;

    // Remove existing override for this date
    await prisma.dateOverride.deleteMany({
        where: {
            availabilityId,
            date: new Date(date),
        },
    });

    return prisma.dateOverride.create({
        data: {
            availabilityId,
            date: new Date(date),
            startTime: isUnavailable ? null : startTime,
            endTime: isUnavailable ? null : endTime,
            isUnavailable: isUnavailable || false,
        },
    });
}

/**
 * Remove date override
 */
async function removeDateOverride(overrideId) {
    return prisma.dateOverride.delete({
        where: { id: overrideId },
    });
}

/**
 * Get availability rules for a specific day
 */
async function getAvailabilityForDay(date) {
    const availability = await getDefaultAvailability();
    const dayOfWeek = new Date(date).getDay();
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    // Check for date override first
    const override = availability.overrides.find(o => {
        const overrideDate = new Date(o.date);
        overrideDate.setHours(0, 0, 0, 0);
        return overrideDate.getTime() === targetDate.getTime();
    });

    if (override) {
        if (override.isUnavailable) {
            return null; // Not available on this day
        }
        return {
            startTime: override.startTime,
            endTime: override.endTime,
        };
    }

    // Find rule for this day of week
    const rule = availability.rules.find(r => r.dayOfWeek === dayOfWeek);

    if (!rule) {
        return null; // Not available on this day
    }

    return {
        startTime: rule.startTime,
        endTime: rule.endTime,
    };
}

module.exports = {
    getDefaultAvailability,
    getAllAvailabilities,
    getAvailabilityById,
    createAvailability,
    updateAvailability,
    addDateOverride,
    removeDateOverride,
    getAvailabilityForDay,
};
