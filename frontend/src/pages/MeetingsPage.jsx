import { useState, useEffect } from 'react';
import { ExternalLink, ChevronDown, Filter, Download, Calendar, ArrowRight, Play } from 'lucide-react';
import { meetingService } from '../services/api';
import { format, isToday, isTomorrow, parseISO, startOfDay } from 'date-fns';
import LoadingSpinner from '../components/common/LoadingSpinner';

const MeetingsPage = () => {
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('upcoming');

    useEffect(() => {
        fetchMeetings();
    }, [activeTab]);

    const fetchMeetings = async () => {
        setLoading(true);
        try {
            const response = await meetingService.getAll(activeTab);
            setMeetings(response.data.data);
        } catch (error) {
            console.error('Failed to fetch meetings', error);
            setMeetings([]);
        } finally {
            setLoading(false);
        }
    };

    // Group meetings by date
    const groupedMeetings = meetings.reduce((acc, meeting) => {
        const dateKey = format(parseISO(meeting.startTime), 'yyyy-MM-dd');
        if (!acc[dateKey]) {
            acc[dateKey] = [];
        }
        acc[dateKey].push(meeting);
        return acc;
    }, {});

    const sortedDates = Object.keys(groupedMeetings).sort();

    const formatDateHeader = (dateStr) => {
        const date = parseISO(dateStr);
        const formattedDate = format(date, 'EEEE, d MMMM yyyy');

        let suffix = '';
        if (isToday(date)) suffix = ' TODAY';
        else if (isTomorrow(date)) suffix = ' TOMORROW';

        return (
            <span className="text-gray-500 font-medium text-xs uppercase tracking-wide">
                {formattedDate} <span className="text-gray-900 font-bold ml-1">{suffix}</span>
            </span>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900">Meetings</h1>
                <button className="text-gray-400 hover:text-gray-600"><div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center text-[10px] font-serif italic">i</div></button>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button className="border border-gray-300 bg-white text-gray-700 font-medium text-sm px-3 py-1.5 rounded-md flex items-center gap-2 hover:border-gray-400">
                        My Calendly <ChevronDown size={14} />
                    </button>
                    <div className="flex items-center gap-2 ml-4">
                        <span className="text-sm text-gray-700">Show buffers</span>
                        <button className="w-8 h-4 bg-gray-300 rounded-full relative transition-colors cursor-pointer">
                            <div className="w-4 h-4 bg-white rounded-full shadow-sm absolute left-0 top-0 border border-gray-200"></div>
                        </button>
                    </div>
                </div>
                <div className="text-xs text-gray-500 text-right w-full">Displaying {meetings.length} of {meetings.length} Events</div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                {/* Tabs */}
                <div className="border-b border-gray-200 px-6 flex items-center justify-between">
                    <nav className="flex space-x-6">
                        {['upcoming', 'past'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`py-4 px-1 text-sm font-medium border-b-2 capitalize transition-colors ${activeTab === tab
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                        <button className="py-4 px-1 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 flex items-center gap-1">
                            Date Range <ChevronDown size={14} />
                        </button>
                    </nav>

                    <div className="flex items-center gap-2 py-2">
                        <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors shadow-sm">
                            <Download size={14} /> Export
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors shadow-sm">
                            <Filter size={14} /> Filter
                        </button>
                    </div>
                </div>

                {/* List */}
                <div className="min-h-[400px]">
                    {loading ? (
                        <LoadingSpinner />
                    ) : meetings.length > 0 ? (
                        <div className="pb-8">
                            {sortedDates.map(dateKey => (
                                <div key={dateKey}>
                                    {/* Date Header */}
                                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 border-t first:border-t-0">
                                        {formatDateHeader(dateKey)}
                                    </div>

                                    {/* Meetings for this date */}
                                    <div className="divide-y divide-gray-100">
                                        {groupedMeetings[dateKey].map(meeting => (
                                            <div key={meeting.id} className="p-6 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group cursor-pointer">
                                                <div className="flex items-start gap-12 w-1/3">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-3 h-3 rounded-full flex-shrink-0 ${meeting.eventTypeId.includes('30min') ? 'bg-purple-600' : 'bg-blue-600'}`} />
                                                        <div className="text-gray-900 font-medium text-sm">
                                                            {format(parseISO(meeting.startTime), 'h:mm aa').toLowerCase()} - {format(parseISO(meeting.endTime), 'h:mm aa').toLowerCase()}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex-1">
                                                    <div className="font-bold text-gray-900 text-sm mb-1">{meeting.inviteeName}</div>
                                                    <div className="text-sm text-gray-500 font-medium">Event type <span className="text-gray-900 font-bold">{meeting.eventType?.name}</span></div>
                                                </div>

                                                <div className="flex items-center gap-12 w-1/3 justify-end">
                                                    <div className="text-xs text-gray-400 font-medium">1 host | 0 non-hosts</div>
                                                    <button className="text-xs font-bold text-gray-500 group-hover:text-gray-900 flex items-center gap-1 transition-colors pl-4 border-l border-transparent group-hover:border-gray-200">
                                                        <Play size={10} fill="currentColor" className="rotate-90" /> Details
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-16 text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                                <Calendar size={32} className="text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">No events yet</h3>
                            <p className="text-gray-500 mt-1">Share your event type links to schedule events.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MeetingsPage;
