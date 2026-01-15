import { useState, useEffect } from 'react';
import { Search, Plus, Info, ChevronDown, ExternalLink, MoreHorizontal, MoreVertical } from 'lucide-react';
import EventTypeCard from '../components/dashboard/EventTypeCard';
import { eventTypeService } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import CreateEventPopup from '../components/dashboard/CreateEventPopup';
import CreateEventDrawer from '../components/dashboard/CreateEventDrawer';

const EventTypesPage = () => {
    const [eventTypes, setEventTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // UI State for Create Flow
    const [showCreatePopup, setShowCreatePopup] = useState(false);
    const [showCreateDrawer, setShowCreateDrawer] = useState(false);

    // Sample data fallback if API fails
    const sampleEventTypes = [
        { id: '1', name: '30 Minute Meeting', durationMinutes: 30, slug: '30min', color: '#8247f5' },
        { id: '2', name: 'Discovery Call', durationMinutes: 15, slug: 'discovery', color: '#f59e0b' },
        { id: '3', name: 'Software Demo', durationMinutes: 60, slug: 'demo', color: '#0069ff' },
    ];

    useEffect(() => {
        fetchEventTypes();
    }, []);

    const fetchEventTypes = async () => {
        try {
            const response = await eventTypeService.getAll();
            setEventTypes(response.data.data);
        } catch (error) {
            console.error('Failed to fetch event types', error);
            setEventTypes(sampleEventTypes);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSelect = (type) => {
        setShowCreatePopup(false);
        // In a real app we might pass the 'type' to the drawer
        setShowCreateDrawer(true);
    };

    const handleCreateSubmit = (eventData) => {
        console.log("Creating event:", eventData);
        alert(`Creating event: ${eventData.name}`);
        setShowCreateDrawer(false);
        // Here we would call API to create event
    };

    const filteredEventTypes = eventTypes.filter(et =>
        et.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-4">
            <CreateEventPopup
                isOpen={showCreatePopup}
                onClose={() => setShowCreatePopup(false)}
                onSelectType={handleCreateSelect}
            />

            <CreateEventDrawer
                isOpen={showCreateDrawer}
                onClose={() => setShowCreateDrawer(false)}
                onCreate={handleCreateSubmit}
            />

            {/* Main Header */}
            <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-gray-900">Scheduling</h1>
                    <button className="text-gray-400 hover:text-gray-600">
                        <Info size={18} className="text-gray-400" />
                    </button>
                </div>
                <button
                    onClick={() => setShowCreatePopup(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-medium text-sm flex items-center gap-2 transition-colors relative"
                >
                    <Plus size={18} />
                    Create
                    <ChevronDown size={18} className="ml-1 opacity-80" />
                </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <div className="flex gap-8">
                    <button className="pb-3 border-b-2 border-blue-600 text-blue-600 font-semibold text-sm">Event types</button>
                    <button className="pb-3 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium text-sm">Single-use links</button>
                    <button className="pb-3 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium text-sm">Meeting polls</button>
                </div>
            </div>

            {/* Filter Search */}
            <div className="pt-4">
                <div className="relative max-w-lg">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm"
                        placeholder="Search event types"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* User Row */}
            <div className="flex items-center justify-between py-2 pt-4 group">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                        A
                    </div>
                    <div className="text-sm font-semibold text-gray-900">Ankit Kushwaha</div>
                </div>
                <div className="flex items-center gap-4">
                    <a href={`/booking/${eventTypes[0]?.slug}`} target="_blank" className="text-sm text-blue-600 hover:underline flex items-center gap-1 font-medium">
                        <ExternalLink size={16} /> View landing page
                    </a>
                    <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md">
                        <MoreHorizontal size={20} />
                    </button>
                </div>
            </div>

            {/* Event Types List */}
            {loading ? (
                <LoadingSpinner />
            ) : (
                <div className="flex flex-col gap-4">
                    {filteredEventTypes.length > 0 ? (
                        filteredEventTypes.map(type => (
                            <EventTypeCard key={type.id} eventType={type} onDelete={() => {
                                // Optimistic update or refetch
                                setEventTypes(prev => prev.filter(et => et.id !== type.id));
                            }} />
                        ))
                    ) : (
                        <div className="col-span-full p-12 text-center bg-white rounded-lg border border-gray-200 border-dashed">
                            <p className="text-gray-500">No event types found.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default EventTypesPage;
