import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, isBefore, startOfToday } from 'date-fns';
import { ChevronLeft, ChevronRight, Clock, Globe, Calendar as CalendarIcon, CheckCircle } from 'lucide-react';
import { eventTypeService, bookingService } from '../services/api';
import { Button, Input } from '../components/common/UIComponents';
import LoadingSpinner from '../components/common/LoadingSpinner';

const PublicBookingPage = () => {
    const { slug } = useParams();
    const [step, setStep] = useState('date'); // date, time, form, success
    const [eventType, setEventType] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [loadingSlots, setLoadingSlots] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        notes: ''
    });
    const [bookingError, setBookingError] = useState('');

    useEffect(() => {
        fetchEventType();
    }, [slug]);

    const fetchEventType = async () => {
        try {
            const response = await eventTypeService.getBySlug(slug);
            setEventType(response.data.data);
        } catch (error) {
            console.error('Failed to fetch event type', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDateSelect = async (date) => {
        // Prevent selecting past dates
        if (isBefore(date, startOfToday())) return;

        setSelectedDate(date);
        setSelectedSlot(null);
        setStep('date'); // Stay on date view but show slots side panel if on desktop
        fetchSlots(date);
    };

    const fetchSlots = async (date) => {
        setLoadingSlots(true);
        try {
            const formattedDate = format(date, 'yyyy-MM-dd');
            const response = await bookingService.getSlots(slug, formattedDate);
            setAvailableSlots(response.data.data);
        } catch (error) {
            console.error('Failed to fetch slots', error);
            setAvailableSlots([]);
        } finally {
            setLoadingSlots(false);
        }
    };

    const handleSlotConfirm = (slot) => {
        setSelectedSlot(slot);
        setStep('form');
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        setBookingError('');

        try {
            await bookingService.create({
                eventTypeId: eventType.id,
                startTime: selectedSlot.startTime,
                inviteeName: formData.name,
                inviteeEmail: formData.email,
                meetingNotes: formData.notes
            });
            setStep('success');
        } catch (error) {
            console.error("Booking Error Payload:", {
                eventTypeId: eventType.id,
                startTime: selectedSlot.startTime,
                inviteeName: formData.name,
                inviteeEmail: formData.email,
                meetingNotes: formData.notes
            });
            console.error("Booking Error Response:", error.response?.data);

            const errorMessage = error.response?.data?.details
                ? error.response.data.details.map(d => d.msg).join(', ')
                : (error.response?.data?.error || 'Failed to book meeting');

            setBookingError(errorMessage);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (!eventType) return <div className="min-h-screen flex items-center justify-center text-gray-500">Event type not found</div>;

    // Calendar Logic
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Success View
    if (step === 'success') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 max-w-lg w-full p-8 text-center animate-fade-in">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                        <CheckCircle size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirmed</h2>
                    <p className="text-gray-600 mb-6">You are scheduled with {eventType.user?.name}.</p>

                    <div className="border-t border-b border-gray-100 py-6 mb-6 space-y-4 text-left">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                            <div>
                                <div className="font-semibold text-gray-900">{eventType.name}</div>
                                <div className="text-gray-500 text-sm">
                                    {format(new Date(selectedSlot.startTime), 'EEEE, MMMM d, yyyy')} • {format(new Date(selectedSlot.startTime), 'h:mm a')} - {format(new Date(selectedSlot.endTime), 'h:mm a')}
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="text-sm text-gray-500">
                        A calendar invitation has been sent to your email address.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 max-w-5xl w-full flex flex-col md:flex-row min-h-[600px] overflow-hidden fade-in">

                {/* Left Sidebar: Event Details */}
                <div className="w-full md:w-1/3 p-8 border-b md:border-b-0 md:border-r border-gray-200 bg-white">
                    <div className="sticky top-8">
                        <button
                            onClick={() => setStep('date')}
                            className={`mb-6 w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-blue-600 transition-colors ${step === 'date' ? 'invisible' : ''}`}
                        >
                            <ChevronLeft size={20} className="text-blue-600" />
                        </button>

                        <div className="text-gray-500 font-medium mb-1">{eventType.user?.name || "Ankit Kushwaha"}</div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-6">{eventType.name}</h1>

                        <div className="space-y-4 text-gray-600">
                            <div className="flex items-center gap-3">
                                <Clock size={20} className="text-gray-400" />
                                <span>{eventType.durationMinutes} min</span>
                            </div>
                            {step === 'form' && selectedSlot && (
                                <div className="flex items-center gap-3 text-green-600 font-medium">
                                    <CalendarIcon size={20} />
                                    <span>
                                        {format(new Date(selectedSlot.startTime), 'EEEE, MMMM d, yyyy')}
                                        <br />
                                        {format(new Date(selectedSlot.startTime), 'h:mm a')} - {format(new Date(selectedSlot.endTime), 'h:mm a')}
                                    </span>
                                </div>
                            )}
                            <div className="flex items-center gap-3">
                                <Globe size={20} className="text-gray-400" />
                                <span>India Standard Time</span>
                            </div>
                        </div>

                        {eventType.description && (
                            <p className="mt-6 text-gray-600 text-sm leading-relaxed">{eventType.description}</p>
                        )}
                    </div>
                </div>

                {/* Right Content */}
                <div className="flex-1 p-8 relative">
                    {step === 'date' ? (
                        <div className="flex flex-col md:flex-row gap-8 h-full">
                            {/* Calendar */}
                            <div className={`flex-1 transition-all duration-300 ${selectedDate ? 'md:w-2/3' : 'w-full'}`}>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold text-gray-900">Select a Date & Time</h2>
                                </div>

                                <div className="flex items-center justify-between mb-4 px-2">
                                    <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="w-8 h-8 flex items-center justify-center hover:bg-blue-50 rounded-full text-blue-600 transition-colors">
                                        <ChevronLeft size={20} />
                                    </button>
                                    <span className="font-bold text-gray-900">{format(currentMonth, 'MMMM yyyy')}</span>
                                    <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="w-8 h-8 flex items-center justify-center hover:bg-blue-50 rounded-full text-blue-600 transition-colors">
                                        <ChevronRight size={20} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                                    {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(d => (
                                        <div key={d} className="text-xs font-medium text-gray-500 py-2">{d}</div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-7 gap-1">
                                    {calendarDays.map((day) => {
                                        const isSelected = selectedDate && isSameDay(day, selectedDate);
                                        const isPast = isBefore(day, startOfToday());

                                        return (
                                            <button
                                                key={day.toString()}
                                                disabled={isPast}
                                                onClick={() => handleDateSelect(day)}
                                                className={`
                                h-10 w-10 mx-auto rounded-full flex items-center justify-center text-sm font-medium transition-all
                                ${isSelected ? 'bg-blue-600 text-white shadow-md' : ''}
                                ${!isSelected && !isPast ? 'text-blue-600 bg-blue-50 hover:bg-blue-100 font-bold' : ''}
                                ${!isSelected && isPast ? 'text-gray-300 cursor-not-allowed bg-transparent' : ''}
                              `}
                                            >
                                                {format(day, 'd')}
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="mt-auto pt-6">
                                    <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                                        <Globe size={14} />
                                        India Standard Time ({format(new Date(), 'h:mma')})
                                    </div>
                                </div>
                            </div>

                            {/* Time Slots Sidebar */}
                            {selectedDate && (
                                <div className="w-full md:w-1/3 min-w-[240px] animate-fade-in pl-4 border-l border-gray-100">
                                    <div className="text-gray-900 font-medium mb-4 text-center md:text-left">
                                        {format(selectedDate, 'EEEE, MMMM d')}
                                    </div>

                                    <div className="h-[400px] overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                                        {loadingSlots ? (
                                            <div className="text-center text-gray-500 py-4 flex flex-col items-center">
                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mb-2"></div>
                                                Loading...
                                            </div>
                                        ) : availableSlots.length > 0 ? (
                                            availableSlots.map((slot) => (
                                                <div key={slot.startTime} className="flex gap-2 animate-slide-in">
                                                    {selectedSlot?.startTime !== slot.startTime ? (
                                                        <button
                                                            onClick={() => setSelectedSlot(slot)}
                                                            className="w-full py-3 text-blue-600 font-bold border border-blue-200 rounded-md hover:border-blue-600 hover:bg-blue-50 transition-all text-sm"
                                                        >
                                                            {format(new Date(slot.startTime), 'h:mm a')}
                                                        </button>
                                                    ) : (
                                                        <div className="flex gap-2 w-full">
                                                            <button
                                                                className="w-1/2 py-3 bg-gray-500 text-white font-bold rounded-md cursor-default text-sm"
                                                            >
                                                                {format(new Date(slot.startTime), 'h:mm a')}
                                                            </button>
                                                            <button
                                                                onClick={() => handleSlotConfirm(slot)}
                                                                className="w-1/2 py-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition-colors text-sm"
                                                            >
                                                                Next
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center text-gray-500 py-4 border border-gray-100 rounded-lg bg-gray-50">No slots available</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        // Booking Form
                        <div className="max-w-md mx-auto animate-fade-in">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Enter Details</h2>

                            <form onSubmit={handleBookingSubmit} className="space-y-6">
                                <Input
                                    label="Name *"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />

                                <Input
                                    label="Email *"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />

                                <button type="button" className="text-blue-600 text-sm font-bold border border-blue-600 rounded-full px-4 py-2 hover:bg-blue-50 inline-block transition-colors">
                                    Add Guests
                                </button>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">
                                        Please share anything that will help prepare for our meeting.
                                    </label>
                                    <textarea
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 h-24 align-top"
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    />
                                </div>

                                {bookingError && (
                                    <div className="p-3 rounded-md bg-red-50 text-red-600 text-sm border border-red-100">
                                        {bookingError}
                                    </div>
                                )}

                                <p className="text-xs text-gray-500 leading-relaxed">
                                    By proceeding, you confirm that you have read and agree to Calendly's Terms of Use and Privacy Notice.
                                </p>

                                <Button type="submit" size="lg" className="rounded-full !px-8 !font-bold">
                                    Schedule Event
                                </Button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PublicBookingPage;
