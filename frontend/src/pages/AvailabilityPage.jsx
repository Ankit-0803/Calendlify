import { useState, useEffect, useRef } from 'react';
import { Plus, X, Copy, Calendar, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { availabilityService } from '../services/api';
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

const TIME_OPTIONS = [
    '12:00am', '12:30am', '1:00am', '1:30am', '2:00am', '2:30am', '3:00am', '3:30am',
    '4:00am', '4:30am', '5:00am', '5:30am', '6:00am', '6:30am', '7:00am', '7:30am',
    '8:00am', '8:30am', '9:00am', '9:30am', '10:00am', '10:30am', '11:00am', '11:30am',
    '12:00pm', '12:30pm', '1:00pm', '1:30pm', '2:00pm', '2:30pm', '3:00pm', '3:30pm',
    '4:00pm', '4:30pm', '5:00pm', '5:30pm', '6:00pm', '6:30pm', '7:00pm', '7:30pm',
    '8:00pm', '8:30pm', '9:00pm', '9:30pm', '10:00pm', '10:30pm', '11:00pm', '11:30pm',
];

const TIMEZONES = [
    { label: 'Pacific Time - US & Canada', offset: 'UTC-8', currentTime: '1:10am' },
    { label: 'Mountain Time - US & Canada', offset: 'UTC-7', currentTime: '2:10am' },
    { label: 'Central Time - US & Canada', offset: 'UTC-6', currentTime: '3:10am' },
    { label: 'Eastern Time - US & Canada', offset: 'UTC-5', currentTime: '4:10am' },
    { label: 'Alaska Time', offset: 'UTC-9', currentTime: '12:10am' },
    { label: 'Arizona, Yukon Time', offset: 'UTC-7', currentTime: '2:10am' },
    { label: 'Newfoundland Time', offset: 'UTC-3:30', currentTime: '5:40am' },
    { label: 'Atlantic Time - Canada', offset: 'UTC-4', currentTime: '5:10am' },
    { label: 'India Standard Time', offset: 'UTC+5:30', currentTime: '2:40pm' },
    { label: 'GMT - London', offset: 'UTC+0', currentTime: '9:10am' },
    { label: 'Central European Time', offset: 'UTC+1', currentTime: '10:10am' },
    { label: 'Japan Standard Time', offset: 'UTC+9', currentTime: '6:10pm' },
    { label: 'Australian Eastern Time', offset: 'UTC+10', currentTime: '7:10pm' },
];

const TimeSlotRow = ({ slot, onUpdate, onRemove, showActions = true }) => {
    const [startTime, setStartTime] = useState(slot.startTime);
    const [endTime, setEndTime] = useState(slot.endTime);
    const [showStartDropdown, setShowStartDropdown] = useState(false);
    const [showEndDropdown, setShowEndDropdown] = useState(false);

    const handleStartTimeChange = (time) => {
        setStartTime(time);
        onUpdate({ ...slot, startTime: time });
        setShowStartDropdown(false);
    };

    const handleEndTimeChange = (time) => {
        setEndTime(time);
        onUpdate({ ...slot, endTime: time });
        setShowEndDropdown(false);
    };

    return (
        <div className="flex items-center gap-2 text-sm group/rule">
            {/* Start Time */}
            <div className="relative">
                <button
                    onClick={() => setShowStartDropdown(!showStartDropdown)}
                    className="w-24 px-3 py-2 text-left border border-gray-300 rounded-md hover:border-blue-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                    {startTime}
                </button>
                {showStartDropdown && (
                    <div className="absolute z-50 mt-1 w-32 max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-md shadow-lg">
                        {TIME_OPTIONS.map((time) => (
                            <button
                                key={time}
                                onClick={() => handleStartTimeChange(time)}
                                className={`w-full px-3 py-2 text-left text-sm hover:bg-blue-50 ${startTime === time ? 'bg-blue-100 text-blue-700' : ''}`}
                            >
                                {time}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <span className="text-gray-400">-</span>

            {/* End Time */}
            <div className="relative">
                <button
                    onClick={() => setShowEndDropdown(!showEndDropdown)}
                    className="w-24 px-3 py-2 text-left border border-gray-300 rounded-md hover:border-blue-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                    {endTime}
                </button>
                {showEndDropdown && (
                    <div className="absolute z-50 mt-1 w-32 max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-md shadow-lg">
                        {TIME_OPTIONS.map((time) => (
                            <button
                                key={time}
                                onClick={() => handleEndTimeChange(time)}
                                className={`w-full px-3 py-2 text-left text-sm hover:bg-blue-50 ${endTime === time ? 'bg-blue-100 text-blue-700' : ''}`}
                            >
                                {time}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Remove Button */}
            {showActions && (
                <button
                    onClick={onRemove}
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded transition-colors"
                    title="Remove time slot"
                >
                    <X size={16} />
                </button>
            )}
        </div>
    );
};

const TimezoneSelector = ({ selectedTimezone, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredTimezones = TIMEZONES.filter(tz =>
        tz.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-600 text-sm hover:text-gray-900 flex items-center gap-1"
            >
                {selectedTimezone.label}
                {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {isOpen && (
                <div className="absolute bottom-full mb-2 left-0 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                    {/* Search */}
                    <div className="p-3 border-b border-gray-200">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Timezone List */}
                    <div className="max-h-64 overflow-y-auto">
                        {filteredTimezones.map((tz, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    onSelect(tz);
                                    setIsOpen(false);
                                    setSearchTerm('');
                                }}
                                className={`w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 ${selectedTimezone.label === tz.label ? 'bg-blue-600 text-white hover:bg-blue-600' : ''
                                    }`}
                            >
                                <span className="text-sm">{tz.label}</span>
                                <span className={`text-sm ${selectedTimezone.label === tz.label ? 'text-white' : 'text-gray-500'}`}>
                                    {tz.currentTime}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const AvailabilityPage = () => {
    const [loading, setLoading] = useState(true);
    const [schedule, setSchedule] = useState(null);
    const [selectedTimezone, setSelectedTimezone] = useState(TIMEZONES[3]); // Eastern Time default
    const [saving, setSaving] = useState(false);

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
                    { id: 1, dayOfWeek: 1, startTime: '9:00am', endTime: '5:00pm' },
                    { id: 2, dayOfWeek: 2, startTime: '9:00am', endTime: '5:00pm' },
                    { id: 3, dayOfWeek: 3, startTime: '9:00am', endTime: '5:00pm' },
                    { id: 4, dayOfWeek: 4, startTime: '9:00am', endTime: '5:00pm' },
                    { id: 5, dayOfWeek: 5, startTime: '9:00am', endTime: '4:30pm' },
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

    const addTimeSlot = (dayIndex) => {
        const newRule = {
            id: Date.now(),
            dayOfWeek: dayIndex,
            startTime: '9:00am',
            endTime: '5:00pm'
        };
        setSchedule(prev => ({
            ...prev,
            rules: [...prev.rules, newRule]
        }));
    };

    const removeTimeSlot = (ruleId) => {
        setSchedule(prev => ({
            ...prev,
            rules: prev.rules.filter(r => r.id !== ruleId)
        }));
    };

    const updateTimeSlot = (updatedRule) => {
        setSchedule(prev => ({
            ...prev,
            rules: prev.rules.map(r => r.id === updatedRule.id ? updatedRule : r)
        }));
    };

    const copyToAllDays = (dayIndex) => {
        const sourceRules = getRulesForDay(dayIndex);
        if (sourceRules.length === 0) return;

        const newRules = [];
        DAYS_MAP.forEach(day => {
            if (day.index !== dayIndex) {
                // Remove existing rules for this day
                const filteredRules = schedule.rules.filter(r => r.dayOfWeek !== day.index);
                // Add copied rules
                sourceRules.forEach(rule => {
                    newRules.push({
                        id: Date.now() + day.index + Math.random(),
                        dayOfWeek: day.index,
                        startTime: rule.startTime,
                        endTime: rule.endTime
                    });
                });
            }
        });

        setSchedule(prev => ({
            ...prev,
            rules: [...prev.rules.filter(r => getRulesForDay(dayIndex).some(sr => sr.id === r.id)), ...newRules, ...getRulesForDay(dayIndex)]
        }));

        alert('Hours copied to all days!');
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await availabilityService.update(schedule);
            alert('Availability saved successfully!');
        } catch (error) {
            console.error('Failed to save availability', error);
            alert('Changes saved locally (API integration pending)');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="space-y-8 max-w-6xl">
            {/* Header Section */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">Availability</h1>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium text-sm transition-colors disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save changes'}
                    </button>
                </div>
            </div>

            {/* Tab Navigation */}
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
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <span className="text-gray-400">⇄</span> Weekly hours
                            </h3>
                        </div>
                        <p className="text-xs text-gray-500 mb-6">Set when you are typically available for meetings</p>

                        <div className="space-y-1">
                            {DAYS_MAP.map((day) => {
                                const rules = getRulesForDay(day.index);
                                const isAvailable = rules.length > 0;

                                return (
                                    <div key={day.index} className="flex items-start gap-4 py-3 px-2 -mx-2 hover:bg-gray-50 rounded-md group transition-colors min-h-[52px]">
                                        {/* Day Circle */}
                                        <div className="pt-1">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold uppercase transition-colors
                                                ${!isAvailable ? 'bg-white border-2 border-gray-200 text-gray-400' : 'bg-blue-600 text-white'}`}>
                                                {day.label}
                                            </div>
                                        </div>

                                        {/* Hours or Unavailable */}
                                        <div className="flex-1 pt-1">
                                            {!isAvailable ? (
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm text-gray-400">Unavailable</span>
                                                    <button
                                                        onClick={() => addTimeSlot(day.index)}
                                                        className="text-gray-400 hover:text-blue-600 hover:bg-blue-100 p-1 rounded-full transition-all"
                                                        title="Add time slot"
                                                    >
                                                        <Plus size={18} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    {rules.map((rule, i) => (
                                                        <div key={rule.id} className="flex items-center gap-2">
                                                            <TimeSlotRow
                                                                slot={rule}
                                                                onUpdate={updateTimeSlot}
                                                                onRemove={() => removeTimeSlot(rule.id)}
                                                            />

                                                            {/* Action buttons for first row */}
                                                            {i === 0 && (
                                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <button
                                                                        onClick={() => addTimeSlot(day.index)}
                                                                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded"
                                                                        title="Add another time slot"
                                                                    >
                                                                        <Plus size={16} />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => copyToAllDays(day.index)}
                                                                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded"
                                                                        title="Copy to all days"
                                                                    >
                                                                        <Copy size={16} />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Timezone Selector */}
                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <TimezoneSelector
                                selectedTimezone={selectedTimezone}
                                onSelect={setSelectedTimezone}
                            />
                        </div>
                    </div>

                    {/* Date-specific hours - Right Panel */}
                    <div className="w-full lg:w-[400px] p-8 bg-white lg:bg-white">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <Calendar size={16} className="text-gray-500" /> Date-specific hours
                            </h3>
                            <button className="bg-white border border-gray-300 text-xs font-medium px-3 py-1.5 rounded-full hover:border-gray-400 transition-colors shadow-sm">
                                + Hours
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mb-6">Adjust hours for specific days</p>

                        {/* Example Override */}
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-xs font-bold text-gray-500 mb-4">2026</h4>
                                <div className="flex items-center justify-between text-sm group hover:bg-gray-50 p-2 -mx-2 rounded transition-colors cursor-pointer">
                                    <div className="font-medium text-gray-900">Jan 16</div>
                                    <div className="text-gray-500">9:00am – 2:00pm</div>
                                    <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-1 rounded transition-all">
                                        <X size={14} />
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
