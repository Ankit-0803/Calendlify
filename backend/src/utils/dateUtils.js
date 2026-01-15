const { format, parse, addMinutes, startOfDay, endOfDay, isWithinInterval, isBefore, isAfter, parseISO, setHours, setMinutes } = require('date-fns');
const { toZonedTime, fromZonedTime } = require('date-fns-tz');

/**
 * Parse time string (HH:mm) to hours and minutes
 */
function parseTimeString(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return { hours, minutes };
}

/**
 * Set time on a date
 */
function setTimeOnDate(date, timeString) {
    const { hours, minutes } = parseTimeString(timeString);
    const newDate = new Date(date);
    newDate.setHours(hours, minutes, 0, 0);
    return newDate;
}

/**
 * Generate time slots between start and end time with given duration
 */
function generateTimeSlots(date, startTime, endTime, durationMinutes, timezone = 'UTC') {
    const slots = [];

    const dayStart = setTimeOnDate(date, startTime);
    const dayEnd = setTimeOnDate(date, endTime);

    let current = dayStart;

    while (addMinutes(current, durationMinutes) <= dayEnd) {
        slots.push({
            startTime: new Date(current),
            endTime: addMinutes(current, durationMinutes),
            formatted: format(current, 'HH:mm'),
        });
        current = addMinutes(current, durationMinutes);
    }

    return slots;
}

/**
 * Check if two time ranges overlap
 */
function doTimesOverlap(start1, end1, start2, end2) {
    return isBefore(start1, end2) && isAfter(end1, start2);
}

/**
 * Filter out booked slots from available slots
 */
function filterBookedSlots(availableSlots, bookedSlots) {
    return availableSlots.filter(slot => {
        const slotStart = new Date(slot.startTime);
        const slotEnd = new Date(slot.endTime);

        return !bookedSlots.some(booked => {
            const bookedStart = new Date(booked.startTime);
            const bookedEnd = new Date(booked.endTime);
            return doTimesOverlap(slotStart, slotEnd, bookedStart, bookedEnd);
        });
    });
}

/**
 * Get day of week (0 = Sunday, 6 = Saturday)
 */
function getDayOfWeek(date) {
    return new Date(date).getDay();
}

/**
 * Format date for display
 */
function formatDate(date, formatString = 'yyyy-MM-dd') {
    return format(new Date(date), formatString);
}

/**
 * Format time for display
 */
function formatTime(date, formatString = 'HH:mm') {
    return format(new Date(date), formatString);
}

/**
 * Check if date is in the past
 */
function isDateInPast(date) {
    return isBefore(new Date(date), new Date());
}

/**
 * Get start and end of day
 */
function getDayBounds(date) {
    const d = new Date(date);
    return {
        start: startOfDay(d),
        end: endOfDay(d),
    };
}

module.exports = {
    parseTimeString,
    setTimeOnDate,
    generateTimeSlots,
    doTimesOverlap,
    filterBookedSlots,
    getDayOfWeek,
    formatDate,
    formatTime,
    isDateInPast,
    getDayBounds,
};
