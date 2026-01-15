const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...');

    // Create default user
    const user = await prisma.user.upsert({
        where: { email: 'admin@calendlify.com' },
        update: {},
        create: {
            name: 'Admin User',
            email: 'admin@calendlify.com',
            timezone: 'Asia/Kolkata',
        },
    });

    console.log('✅ Created user:', user.name);

    // Create default availability schedule
    const availability = await prisma.availability.upsert({
        where: { id: 'default-availability' },
        update: {},
        create: {
            id: 'default-availability',
            userId: user.id,
            name: 'Working Hours',
            isDefault: true,
        },
    });

    // Create availability rules (Monday to Friday, 9 AM - 5 PM)
    const weekdays = [1, 2, 3, 4, 5]; // Monday to Friday

    for (const day of weekdays) {
        await prisma.availabilityRule.upsert({
            where: { id: `rule-day-${day}` },
            update: {},
            create: {
                id: `rule-day-${day}`,
                availabilityId: availability.id,
                dayOfWeek: day,
                startTime: '09:00',
                endTime: '17:00',
            },
        });
    }

    console.log('✅ Created availability schedule with weekday rules');

    // Create sample event types
    const eventTypes = [
        {
            id: 'event-15min',
            name: '15 Minute Meeting',
            slug: '15min',
            durationMinutes: 15,
            description: 'Quick sync call',
            color: '#0069ff',
        },
        {
            id: 'event-30min',
            name: '30 Minute Meeting',
            slug: '30min',
            durationMinutes: 30,
            description: 'Standard meeting',
            color: '#7c3aed',
        },
        {
            id: 'event-60min',
            name: '60 Minute Meeting',
            slug: '60min',
            durationMinutes: 60,
            description: 'In-depth discussion',
            color: '#059669',
        },
    ];

    for (const eventType of eventTypes) {
        await prisma.eventType.upsert({
            where: { id: eventType.id },
            update: {},
            create: {
                ...eventType,
                userId: user.id,
                isActive: true,
            },
        });
    }

    console.log('✅ Created sample event types');

    // Create sample bookings
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);

    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 2);
    dayAfter.setHours(14, 0, 0, 0);

    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 3);
    pastDate.setHours(11, 0, 0, 0);

    const sampleBookings = [
        {
            id: 'booking-1',
            eventTypeId: 'event-30min',
            inviteeName: 'John Doe',
            inviteeEmail: 'john@example.com',
            startTime: tomorrow,
            endTime: new Date(tomorrow.getTime() + 30 * 60 * 1000),
            status: 'confirmed',
            meetingNotes: 'Discuss project requirements',
        },
        {
            id: 'booking-2',
            eventTypeId: 'event-60min',
            inviteeName: 'Jane Smith',
            inviteeEmail: 'jane@example.com',
            startTime: dayAfter,
            endTime: new Date(dayAfter.getTime() + 60 * 60 * 1000),
            status: 'confirmed',
            meetingNotes: 'Technical discussion',
        },
        {
            id: 'booking-3',
            eventTypeId: 'event-15min',
            inviteeName: 'Bob Wilson',
            inviteeEmail: 'bob@example.com',
            startTime: pastDate,
            endTime: new Date(pastDate.getTime() + 15 * 60 * 1000),
            status: 'confirmed',
            meetingNotes: 'Quick follow-up',
        },
    ];

    for (const booking of sampleBookings) {
        await prisma.booking.upsert({
            where: { id: booking.id },
            update: {},
            create: booking,
        });
    }

    console.log('✅ Created sample bookings');
    console.log('🎉 Seed completed successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
