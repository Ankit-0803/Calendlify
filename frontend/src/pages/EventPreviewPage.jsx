import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isBefore, startOfToday } from 'date-fns';
import { ChevronLeft, ChevronRight, Clock, Video, Phone, MapPin, Globe, Calendar as CalendarIcon, ExternalLink, Link2, ChevronDown, ChevronUp, MoreVertical, Eye } from 'lucide-react';
import { eventTypeService, bookingService } from '../services/api';

const EventPreviewPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const eventData = location.state?.eventData;

    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [createdEventType, setCreatedEventType] = useState(null);
    const [saving, setSaving] = useState(false);
    const [generatedSlug, setGeneratedSlug] = useState(null);
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);

    // Sidebar section expansion states
    const [expandedSections, setExpandedSections] = useState({
        duration: false,
        location: false,
        availability: false,
        host: false,
    });

    // If no event data, redirect back
    useEffect(() => {
        if (!eventData) {
            navigate('/');
        }
    }, [eventData, navigate]);

    if (!eventData) return null;

    // Generate a unique slug from the event name
    const generateSlug = (name) => {
        const baseSlug = name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
        const uniqueId = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
        return `${baseSlug}-${uniqueId}`;
    };

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const handleDateSelect = async (date) => {
        if (isBefore(date, startOfToday())) return;
        setSelectedDate(date);
        setSelectedSlot(null);

        // For preview, we'll show mock slots
        setLoadingSlots(true);
        setTimeout(() => {
            const mockSlots = [
                { startTime: new Date(date.setHours(9, 0)).toISOString(), endTime: new Date(date.setHours(9, eventData.duration)).toISOString() },
                { startTime: new Date(date.setHours(10, 0)).toISOString(), endTime: new Date(date.setHours(10, eventData.duration)).toISOString() },
                { startTime: new Date(date.setHours(11, 0)).toISOString(), endTime: new Date(date.setHours(11, eventData.duration)).toISOString() },
                { startTime: new Date(date.setHours(14, 0)).toISOString(), endTime: new Date(date.setHours(14, eventData.duration)).toISOString() },
                { startTime: new Date(date.setHours(15, 0)).toISOString(), endTime: new Date(date.setHours(15, eventData.duration)).toISOString() },
            ];
            setAvailableSlots(mockSlots);
            setLoadingSlots(false);
        }, 500);
    };

    const handleSlotSelect = (slot) => {
        setSelectedSlot(slot);
    };

    const handleSaveChanges = async () => {
        setSaving(true);
        try {
            // Generate a unique slug
            const slug = generateSlug(eventData.name);

            // Create the event type via API with slug
            const response = await eventTypeService.create({
                name: eventData.name,
                slug: slug,
                durationMinutes: eventData.duration,
                location: eventData.location,
                color: '#8247f5',
            });

            const createdEvent = response.data.data;
            setCreatedEventType(createdEvent);
            setGeneratedSlug(createdEvent.slug || slug);

            // Show the link modal with copy functionality
            setShowLinkModal(true);
        } catch (error) {
            console.error('Failed to create event type:', error);
            const errorMsg = error.response?.data?.details
                ? error.response.data.details.map(d => d.msg).join(', ')
                : (error.response?.data?.error || 'Failed to create event type. Please try again.');
            alert(errorMsg);
        } finally {
            setSaving(false);
        }
    };

    const handleCopyLink = () => {
        const slug = generatedSlug || generateSlug(eventData.name);
        const url = `${window.location.origin}/booking/${slug}`;
        navigator.clipboard.writeText(url);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
    };

    const getBookingLink = () => {
        const slug = generatedSlug || createdEventType?.slug;
        return slug ? `${window.location.origin}/booking/${slug}` : '';
    };

    // Calendar Logic
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const getLocationIcon = () => {
        switch (eventData.location) {
            case 'zoom': return <Video size={16} />;
            case 'phone': return <Phone size={16} />;
            case 'in-person': return <MapPin size={16} />;
            default: return <Video size={16} />;
        }
    };

    const getLocationLabel = () => {
        switch (eventData.location) {
            case 'zoom': return 'Zoom';
            case 'phone': return 'Phone call';
            case 'in-person': return 'In-person';
            default: return 'Zoom';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <h1 className="text-xl font-semibold text-gray-900">Preview of {eventData.name}</h1>
                    <div className="flex items-center gap-3">
                        <button className="p-2 hover:bg-gray-100 rounded">
                            <CalendarIcon size={18} className="text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded">
                            <ExternalLink size={18} className="text-gray-600" />
                        </button>
                        <button
                            onClick={handleCopyLink}
                            className={`flex items-center gap-2 px-4 py-2 border rounded-full text-sm font-medium transition-colors ${linkCopied
                                    ? 'border-green-500 bg-green-50 text-green-700'
                                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <Link2 size={16} />
                            {linkCopied ? 'Copied!' : 'Copy link'}
                        </button>
                        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-gray-600">
                            ✕
                        </button>
                    </div>
                </div>
            </div>

            {/* Link Success Modal */}
            {showLinkModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowLinkModal(false)}>
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6" onClick={e => e.stopPropagation()}>
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Event Type Created!</h3>
                            <p className="text-gray-600">Your booking link is ready to share</p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <label className="block text-xs font-medium text-gray-500 mb-2">Booking Link</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={getBookingLink()}
                                    readOnly
                                    className="flex-1 bg-white border border-gray-300 rounded px-3 py-2 text-sm text-gray-700"
                                />
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(getBookingLink());
                                        setLinkCopied(true);
                                        setTimeout(() => setLinkCopied(false), 2000);
                                    }}
                                    className={`px-4 py-2 rounded font-medium text-sm transition-colors ${linkCopied
                                            ? 'bg-green-600 text-white'
                                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                                        }`}
                                >
                                    {linkCopied ? 'Copied!' : 'Copy'}
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowLinkModal(false);
                                    navigate('/');
                                }}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-gray-700 font-medium hover:bg-gray-50"
                            >
                                Go to Dashboard
                            </button>
                            <button
                                onClick={() => {
                                    setShowLinkModal(false);
                                    navigate(`/booking/${generatedSlug}`);
                                }}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700"
                            >
                                View Booking Page
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-6 py-6">
                <div className="flex gap-6">
                    {/* Main Content - Calendar Preview */}
                    <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        {/* Preview Banner */}
                        <div className="bg-gray-800 text-white px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
                            <span className="text-sm">
                                <strong>This is a preview.</strong> To book an event, share the link with your invitees.
                            </span>
                            <ExternalLink size={16} className="cursor-pointer" />
                        </div>

                        {/* Event Info */}
                        <div className="text-center mb-8">
                            <div className="text-gray-500 mb-1">{eventData.host?.name || 'Ankit Kushwaha'}</div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">{eventData.name}</h2>
                            <div className="flex items-center justify-center gap-6 text-gray-500 text-sm">
                                <div className="flex items-center gap-2">
                                    <Clock size={16} />
                                    <span>{eventData.duration} min</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin size={16} />
                                    <span>Add a location for it to show here</span>
                                </div>
                            </div>
                        </div>

                        {/* Calendar */}
                        <div className="max-w-md mx-auto">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select a Date & Time</h3>

                            <div className="flex items-center justify-between mb-4">
                                <button
                                    onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                                    className="w-8 h-8 flex items-center justify-center hover:bg-blue-50 rounded-full text-blue-600 transition-colors"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <span className="font-bold text-gray-900">{format(currentMonth, 'MMMM yyyy')}</span>
                                <button
                                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                                    className="w-8 h-8 flex items-center justify-center hover:bg-blue-50 rounded-full text-blue-600 transition-colors"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>

                            <div className="grid grid-cols-7 gap-1 text-center mb-2">
                                {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(d => (
                                    <div key={d} className="text-xs font-medium text-gray-500 py-2">{d}</div>
                                ))}
                            </div>

                            <div className="grid grid-cols-7 gap-1 mb-6">
                                {calendarDays.map((day) => {
                                    const isSelected = selectedDate && isSameDay(day, selectedDate);
                                    const isPast = isBefore(day, startOfToday());
                                    const isWeekend = day.getDay() === 0 || day.getDay() === 6;

                                    return (
                                        <button
                                            key={day.toString()}
                                            disabled={isPast}
                                            onClick={() => handleDateSelect(day)}
                                            className={`
                                                h-10 w-10 mx-auto rounded-full flex items-center justify-center text-sm font-medium transition-all
                                                ${isSelected ? 'bg-blue-600 text-white shadow-md' : ''}
                                                ${!isSelected && !isPast && !isWeekend ? 'text-blue-600 bg-blue-50 hover:bg-blue-100 font-bold' : ''}
                                                ${!isSelected && isPast ? 'text-gray-300 cursor-not-allowed bg-transparent' : ''}
                                                ${!isSelected && !isPast && isWeekend ? 'text-gray-400 bg-transparent' : ''}
                                            `}
                                        >
                                            {format(day, 'd')}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Time Slots */}
                            {selectedDate && (
                                <div className="border-t border-gray-200 pt-4">
                                    <div className="text-gray-900 font-medium mb-3">
                                        {format(selectedDate, 'EEEE, MMMM d')}
                                    </div>

                                    {loadingSlots ? (
                                        <div className="text-center py-4">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                                            <span className="text-gray-500 text-sm">Loading slots...</span>
                                        </div>
                                    ) : (
                                        <div className="space-y-2 max-h-60 overflow-y-auto">
                                            {availableSlots.map((slot, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleSlotSelect(slot)}
                                                    className={`w-full py-3 text-sm font-bold border rounded-md transition-all ${selectedSlot === slot
                                                        ? 'bg-blue-600 text-white border-blue-600'
                                                        : 'text-blue-600 border-blue-200 hover:border-blue-600 hover:bg-blue-50'
                                                        }`}
                                                >
                                                    {format(new Date(slot.startTime), 'h:mm a')}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {selectedSlot && (
                                        <button
                                            onClick={() => navigate('/booking/preview/form', {
                                                state: { eventData, selectedDate, selectedSlot }
                                            })}
                                            className="w-full mt-4 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-colors"
                                        >
                                            Next
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Sidebar - Event Settings */}
                    <div className="w-80 bg-white rounded-lg shadow-sm border border-gray-200 h-fit">
                        {/* Event Type Header */}
                        <div className="p-4 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-xs text-gray-500 mb-1">Event type</div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-purple-600"></div>
                                        <span className="font-semibold text-gray-900">{eventData.name}</span>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-0.5">One on One</div>
                                </div>
                                <button className="text-gray-400 hover:text-gray-600">
                                    <MoreVertical size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Duration */}
                        <div className="p-4 border-b border-gray-100">
                            <button
                                onClick={() => toggleSection('duration')}
                                className="w-full flex items-center justify-between"
                            >
                                <span className="font-semibold text-gray-900">Duration</span>
                                {expandedSections.duration ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                            <div className="flex items-center gap-2 text-gray-500 text-sm mt-2">
                                <Clock size={14} />
                                <span>{eventData.duration} min</span>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="p-4 border-b border-gray-100">
                            <button
                                onClick={() => toggleSection('location')}
                                className="w-full flex items-center justify-between"
                            >
                                <span className="font-semibold text-gray-900">Location</span>
                                {expandedSections.location ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                            <div className="flex items-center gap-4 mt-3">
                                <div className={`flex flex-col items-center justify-center p-2 rounded border ${eventData.location === 'zoom' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}>
                                    <Video size={16} className={eventData.location === 'zoom' ? 'text-blue-600' : 'text-gray-400'} />
                                    <span className="text-xs mt-1">Zoom</span>
                                </div>
                                <div className={`flex flex-col items-center justify-center p-2 rounded border ${eventData.location === 'phone' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}>
                                    <Phone size={16} className={eventData.location === 'phone' ? 'text-blue-600' : 'text-gray-400'} />
                                    <span className="text-xs mt-1">Phone</span>
                                </div>
                                <div className={`flex flex-col items-center justify-center p-2 rounded border ${eventData.location === 'in-person' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}>
                                    <MapPin size={16} className={eventData.location === 'in-person' ? 'text-blue-600' : 'text-gray-400'} />
                                    <span className="text-xs mt-1">In-person</span>
                                </div>
                            </div>
                        </div>

                        {/* Availability */}
                        <div className="p-4 border-b border-gray-100">
                            <button
                                onClick={() => toggleSection('availability')}
                                className="w-full flex items-center justify-between"
                            >
                                <span className="font-semibold text-gray-900">Availability</span>
                                {expandedSections.availability ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                            <div className="text-sm text-gray-500 mt-2">
                                {eventData.availability?.label || 'Weekdays, hours vary'}
                            </div>
                            <div className="text-xs text-gray-400 mt-0.5">
                                {eventData.availability?.extra || '+1 date-specific time'}
                            </div>
                        </div>

                        {/* Host */}
                        <div className="p-4 border-b border-gray-100">
                            <button
                                onClick={() => toggleSection('host')}
                                className="w-full flex items-center justify-between"
                            >
                                <span className="font-semibold text-gray-900">Host</span>
                                {expandedSections.host ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                            <div className="flex items-center gap-2 mt-2">
                                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                    {eventData.host?.initial || 'A'}
                                </div>
                                <span className="text-sm text-gray-600">
                                    {eventData.host?.name || 'Ankit Kushwaha'} ({eventData.host?.email || 'you'})
                                </span>
                            </div>
                        </div>

                        {/* Footer Buttons */}
                        <div className="p-4 flex items-center justify-between gap-2">
                            <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
                                <Eye size={14} />
                                Preview
                            </button>
                            <button className="text-sm text-gray-600 hover:text-gray-900">
                                More options
                            </button>
                            <button
                                onClick={handleSaveChanges}
                                disabled={saving}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors disabled:opacity-50"
                            >
                                {saving ? 'Saving...' : 'Save changes'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventPreviewPage;
