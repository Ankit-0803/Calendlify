import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ChevronLeft, Clock, Calendar as CalendarIcon, Globe, Link2 } from 'lucide-react';
import { bookingService, eventTypeService } from '../services/api';

const BookingFormPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { eventData, selectedDate, selectedSlot } = location.state || {};

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        guests: '',
        notes: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // If no data, redirect back
    if (!eventData || !selectedSlot) {
        navigate('/');
        return null;
    }

    const handleBack = () => {
        navigate(-1);
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            // First create the event type if it doesn't exist
            let eventTypeId = eventData.id;

            if (!eventTypeId) {
                const slug = generateSlug(eventData.name);
                const createResponse = await eventTypeService.create({
                    name: eventData.name,
                    slug: slug,
                    durationMinutes: eventData.duration,
                    location: eventData.location,
                    color: '#8247f5',
                });
                eventTypeId = createResponse.data.data.id;
            }

            // Then create the booking
            await bookingService.create({
                eventTypeId: eventTypeId,
                startTime: selectedSlot.startTime,
                inviteeName: formData.name,
                inviteeEmail: formData.email,
                meetingNotes: formData.notes,
            });

            setSuccess(true);
        } catch (err) {
            console.error('Booking error:', err);
            const errorMessage = err.response?.data?.details
                ? err.response.data.details.map(d => d.msg).join(', ')
                : (err.response?.data?.error || 'Failed to schedule event. Please try again.');
            setError(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied!');
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 max-w-lg w-full p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirmed</h2>
                    <p className="text-gray-600 mb-6">You are scheduled with {eventData.host?.name || 'Ankit Kushwaha'}.</p>

                    <div className="border-t border-b border-gray-100 py-6 mb-6 text-left">
                        <div className="flex items-start gap-3">
                            <div className="w-3 h-3 rounded-full bg-purple-600 mt-1.5"></div>
                            <div>
                                <div className="font-semibold text-gray-900">{eventData.name}</div>
                                <div className="text-gray-500 text-sm mt-1">
                                    {format(new Date(selectedSlot.startTime), 'EEEE, MMMM d, yyyy')}
                                </div>
                                <div className="text-gray-500 text-sm">
                                    {format(new Date(selectedSlot.startTime), 'h:mm a')} - {format(new Date(selectedSlot.endTime), 'h:mm a')}
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="text-sm text-gray-500 mb-6">
                        A calendar invitation has been sent to your email address.
                    </p>

                    <button
                        onClick={() => navigate('/')}
                        className="text-blue-600 font-medium hover:underline"
                    >
                        Return to home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div></div>
                    <div className="flex items-center gap-3">
                        <span className="text-gray-600 text-sm">Menu</span>
                        <button
                            onClick={handleCopyLink}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            <Link2 size={16} />
                            Copy link
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                        {/* Left Side - Event Details */}
                        <div className="w-full md:w-2/5 p-8 border-b md:border-b-0 md:border-r border-gray-200">
                            <button
                                onClick={handleBack}
                                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-blue-600 transition-colors mb-6"
                            >
                                <ChevronLeft size={20} className="text-blue-600" />
                            </button>

                            <div className="text-gray-500 mb-1">{eventData.host?.name || 'Ankit Kushwaha'}</div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-6">{eventData.name}</h1>

                            <div className="space-y-4 text-gray-600">
                                <div className="flex items-center gap-3">
                                    <Clock size={18} className="text-gray-400" />
                                    <span>{eventData.duration} min</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CalendarIcon size={18} className="text-gray-400" />
                                    <div>
                                        <div>{format(new Date(selectedSlot.startTime), 'h:mma')} - {format(new Date(selectedSlot.endTime), 'h:mma')}, {format(new Date(selectedSlot.startTime), 'EEEE, MMMM d, yyyy')}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Globe size={18} className="text-gray-400" />
                                    <span>India Standard Time</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Form */}
                        <div className="w-full md:w-3/5 p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Enter Details</h2>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>

                                <button
                                    type="button"
                                    className="text-blue-600 text-sm font-semibold border border-blue-600 rounded-full px-4 py-2 hover:bg-blue-50 transition-colors"
                                >
                                    Add Guests
                                </button>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Please share anything that will help prepare for our meeting.
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                                    />
                                </div>

                                {error && (
                                    <div className="p-3 rounded-md bg-red-50 text-red-600 text-sm border border-red-100">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? 'Scheduling...' : 'Schedule Event'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Footer Links */}
                <div className="mt-6 text-center">
                    <a href="#" className="text-blue-600 text-sm hover:underline">Cookie settings</a>
                </div>
            </div>

            {/* Calendly Badge (decorative) */}
            <div className="fixed top-20 right-0 bg-gray-800 text-white text-xs px-2 py-8 transform rotate-0 origin-right" style={{ writingMode: 'vertical-rl' }}>
                powered by Calendlify
            </div>
        </div>
    );
};

export default BookingFormPage;
