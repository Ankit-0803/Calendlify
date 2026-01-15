import { useState, useEffect } from 'react';
import { Plus, Trash2, Copy, Calendar, List, ChevronDown, Check } from 'lucide-react';
import { availabilityService } from '../services/api';
import { Button } from '../components/common/UIComponents';
import { format, parse } from 'date-fns';

const DAYS_MAP = [
    { label: 'S', name: 'Sunday', index: 0 },
    { label: 'M', name: 'Monday', index: 1 },
    { label: 'T', name: 'Tuesday', index: 2 },
    { label: 'W', name: 'Wednesday', index: 3 },
    { label: 'T', name: 'Thursday', index: 4 },
    { label: 'F', name: 'Friday', index: 5 },
    { label: 'S', name: 'Saturday', index: 6 },
];

const AvailabilityPage = () => {
    const [loading, setLoading] = useState(true);
    const [schedule, setSchedule] = useState(null);

    useEffect(() => {
        fetchAvailability();
    }, []);

    const fetchAvailability = async () => {
        try {
            const response = await availabilityService.getDefault();
            setSchedule(response.data.data);
        } catch (error) {
            console.error('Failed to fetch availability', error);
            // Fallback for demo
            setSchedule({
                name: 'Working hours (default)',
                rules: [
                    { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' },
                    { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' },
                    { dayOfWeek: 3, startTime: '09:00', endTime: '17:00' },
                    { dayOfWeek: 4, startTime: '09:00', endTime: '17:00' },
                    { dayOfWeek: 5, startTime: '09:00', endTime: '17:00' },
                ],
                overrides: []
            });
        } finally {
            setLoading(false);
        }
    };

    const getRulesForDay = (dayIndex) => {
        return schedule?.rules.filter(r => r.dayOfWeek === dayIndex) || [];
    };

    const formatTimeDisplay = (timeStr) => {
        // timeStr is HH:mm
        const date = parse(timeStr, 'HH:mm', new Date());
        return format(date, 'h:mma').toLowerCase();
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-8 max-w-6xl">
            {/* Header Section */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">Availability</h1>
                </div>
            </div>

            {/* Tab Navigation (Visual Only) */}
            <div className="border-b border-gray-200 mb-8">
                <nav className="flex gap-8">
                    <button className="border-b-2 border-blue-600 pb-4 text-sm font-medium text-blue-600">Schedules</button>
                    <button className="border-b-2 border-transparent pb-4 text-sm font-medium text-gray-500 hover:text-gray-700">Calendar settings</button>
                    <button className="border-b-2 border-transparent pb-4 text-sm font-medium text-gray-500 hover:text-gray-700">Advanced settings</button>
                </nav>
            </div>

            {/* Date Range Settings Section */}
            <div className="space-y-4">
                <h2 className="text-base font-bold text-gray-900">Date-range</h2>
                <div className="text-sm text-gray-600 flex items-center flex-wrap gap-1 leading-relaxed">
                    <span>Invitees can schedule</span>
                    <button className="inline-flex items-center gap-1 text-blue-600 font-medium hover:underline rounded px-1 py-0.5 hover:bg-blue-50">
                        60 days <ChevronDown size={14} />
                    </button>
                    <span>into the future with at least</span>
                    <button className="inline-flex items-center gap-1 text-blue-600 font-medium hover:underline rounded px-1 py-0.5 hover:bg-blue-50">
                        4 hours <ChevronDown size={14} />
                    </button>
                    <span>notice</span>
                </div>
            </div>

            {/* Schedule Section */}
            <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900">Schedule:</span>
                    <button className="inline-flex items-center gap-1 text-blue-600 font-medium hover:underline text-sm">
                        {schedule.name} <ChevronDown size={14} />
                    </button>
                    <span className="text-xs text-gray-400 font-normal ml-2">Active on: <span className="text-blue-600 cursor-pointer hover:underline">6 event types</span></span>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col lg:flex-row min-h-[600px]">

                    {/* Weekly hours - Left Panel */}
                    <div className="flex-1 p-8 border-r border-gray-200">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <span className="text-gray-400 rotate-90 transform">⇄</span> Weekly hours
                            </h3>
                        </div>
                        <p className="text-xs text-gray-500 mb-6">Set when you are typically available for meetings</p>

                        <div className="space-y-1">
                            {DAYS_MAP.map((day) => {
                                const rules = getRulesForDay(day.index);
                                const isAvailable = rules.length > 0;

                                return (
                                    <div key={day.index} className="flex items-start gap-6 py-3 px-2 -mx-2 hover:bg-gray-50 rounded-md group transition-colors min-h-[52px]">
                                        {/* Day Circle */}
                                        <div className="pt-1">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold uppercase transition-colors
                                                ${!isAvailable ? 'bg-white border-2 border-gray-200 text-gray-400' : 'bg-gray-800 text-white'}`}>
                                                {day.label}
                                            </div>
                                        </div>

                                        {/* Hours or Unavailable */}
                                        <div className="flex-1 pt-2">
                                            {!isAvailable ? (
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm text-gray-400">Unavailable</span>
                                                    <button className="opacity-0 group-hover:opacity-100 text-blue-600 hover:bg-blue-100 p-1 rounded-full transition-all">
                                                        <Plus size={16} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="space-y-3">
                                                    {rules.map((rule, i) => (
                                                        <div key={i} className="flex items-center gap-3 text-sm text-gray-900 group/rule">
                                                            <div className="w-20 text-right">{formatTimeDisplay(rule.startTime)}</div>
                                                            <span className="text-gray-400">-</span>
                                                            <div className="w-20">{formatTimeDisplay(rule.endTime)}</div>

                                                            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                                                                <button className="text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-200 rounded">
                                                                    <Trash2 size={16} />
                                                                </button>
                                                                {i === 0 && (
                                                                    <>
                                                                        <button className="text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-200 rounded">
                                                                            <Plus size={16} />
                                                                        </button>
                                                                        <button className="text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-200 rounded">
                                                                            <Copy size={16} />
                                                                        </button>
                                                                    </>
                                                                )}

                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <button className="text-gray-500 text-sm hover:text-gray-900 flex items-center gap-1">
                                Eastern Time - US & Canada <ChevronDown size={12} />
                            </button>
                        </div>
                    </div>

                    {/* Date-specific hours - Right Panel */}
                    <div className="w-full lg:w-[400px] p-8 bg-white lg:bg-white">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <Calendar size={16} className="text-gray-500" /> Date-specific hours
                            </h3>
                            <button className="bg-white border border-gray-300 text-xs font-medium px-3 py-1 rounded-full hover:border-gray-400 transition-colors shadow-sm">
                                + Hours
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mb-6">Adjust hours for specific days</p>

                        {/* Example 2026 Override (Static for Pixel Perfect match) */}
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-xs font-bold text-gray-500 mb-4">2026</h4>
                                <div className="flex items-center justify-between text-sm group hover:bg-gray-50 p-2 -mx-2 rounded transition-colors cursor-pointer">
                                    <div className="font-medium text-gray-900">Jan 16</div>
                                    <div className="text-gray-500">9:00am – 2:00pm</div>
                                    <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AvailabilityPage;
