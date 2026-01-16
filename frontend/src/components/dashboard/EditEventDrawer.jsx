import React, { useState, useEffect } from 'react';
import { X, Clock, Video, MapPin, Phone, Check, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { eventTypeService } from '../../services/api';

const EditEventDrawer = ({ isOpen, onClose, eventType, onSave }) => {
    const [title, setTitle] = useState('');
    const [duration, setDuration] = useState(30);
    const [location, setLocation] = useState('zoom');
    const [saving, setSaving] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);

    // Dropdown states
    const [showDurationDropdown, setShowDurationDropdown] = useState(false);
    const [showAvailabilityDropdown, setShowAvailabilityDropdown] = useState(false);
    const [showHostDropdown, setShowHostDropdown] = useState(false);

    // Availability options
    const [selectedAvailability, setSelectedAvailability] = useState({
        label: 'Weekdays, hours vary',
        extra: '+1 date-specific time'
    });

    // Host options
    const [selectedHost, setSelectedHost] = useState({
        name: 'Ankit Kushwaha',
        email: 'you',
        initial: 'A'
    });

    const durationOptions = [15, 30, 45, 60];

    const availabilityOptions = [
        { label: 'Weekdays, hours vary', extra: '+1 date-specific time' },
        { label: 'Working hours', extra: '9am - 5pm' },
        { label: 'Custom schedule', extra: 'Set your own' },
    ];

    const hostOptions = [
        { name: 'Ankit Kushwaha', email: 'you', initial: 'A' },
    ];

    // Load event type data when drawer opens
    useEffect(() => {
        if (isOpen && eventType) {
            setTitle(eventType.name || 'New Meeting');
            setDuration(eventType.durationMinutes || 30);
            setLocation(eventType.location || 'zoom');
        }
    }, [isOpen, eventType]);

    if (!isOpen) return null;

    const handleSaveChanges = async () => {
        setSaving(true);
        try {
            const response = await eventTypeService.update(eventType.id, {
                name: title,
                durationMinutes: duration,
                location: location,
            });

            if (onSave) {
                onSave(response.data.data);
            }
            onClose();
        } catch (error) {
            console.error('Failed to update event type:', error);
            const errorMsg = error.response?.data?.details
                ? error.response.data.details.map(d => d.msg).join(', ')
                : (error.response?.data?.error || 'Failed to update event type. Please try again.');
            alert(errorMsg);
        } finally {
            setSaving(false);
        }
    };

    const handleCopyLink = () => {
        const url = `${window.location.origin}/booking/${eventType.slug}`;
        navigator.clipboard.writeText(url);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
    };

    const handlePreview = () => {
        window.open(`/booking/${eventType.slug}`, '_blank');
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/20" onClick={onClose}>
            <div
                className="w-[400px] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-200 flex items-start justify-between">
                    <div>
                        <div className="text-xs font-semibold text-gray-500 mb-1">Event type</div>
                        <div className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: eventType?.color || '#8247f5' }}
                            ></div>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="font-bold text-gray-900 text-lg border-b border-transparent hover:border-gray-300 focus:border-blue-600 focus:outline-none w-full"
                            />
                        </div>
                        <div className="text-xs text-gray-500 mt-1">One-on-One</div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    {/* Duration */}
                    <div className="p-6 border-b border-gray-100">
                        <div
                            className="flex items-center justify-between mb-4 cursor-pointer group"
                            onClick={() => setShowDurationDropdown(!showDurationDropdown)}
                        >
                            <h3 className="font-bold text-gray-900">Duration</h3>
                            {showDurationDropdown ? (
                                <ChevronUp size={16} className="text-gray-400" />
                            ) : (
                                <ChevronDown size={16} className="text-gray-400" />
                            )}
                        </div>

                        {showDurationDropdown ? (
                            <div className="space-y-2">
                                {durationOptions.map((opt) => (
                                    <button
                                        key={opt}
                                        onClick={() => {
                                            setDuration(opt);
                                            setShowDurationDropdown(false);
                                        }}
                                        className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${duration === opt
                                                ? 'border-blue-600 bg-blue-50 text-blue-700'
                                                : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Clock size={16} />
                                            <span>{opt} min</span>
                                        </div>
                                        {duration === opt && <Check size={16} className="text-blue-600" />}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-gray-600 text-sm">
                                <Clock size={16} />
                                <span>{duration} min</span>
                            </div>
                        )}
                    </div>

                    {/* Location */}
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center justify-between mb-4 cursor-pointer group">
                            <h3 className="font-bold text-gray-900">Location</h3>
                            <ChevronDown size={16} className="text-gray-400" />
                        </div>

                        <div className="grid grid-cols-4 gap-2">
                            <button
                                onClick={() => setLocation('zoom')}
                                className={`flex flex-col items-center justify-center p-3 rounded border ${location === 'zoom'
                                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                    } transition-all`}
                            >
                                <Video size={20} className="mb-1" />
                                <span className="text-xs">Zoom</span>
                            </button>
                            <button
                                onClick={() => setLocation('phone')}
                                className={`flex flex-col items-center justify-center p-3 rounded border ${location === 'phone'
                                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                    } transition-all`}
                            >
                                <Phone size={20} className="mb-1" />
                                <span className="text-xs">Phone call</span>
                            </button>
                            <button
                                onClick={() => setLocation('in-person')}
                                className={`flex flex-col items-center justify-center p-3 rounded border ${location === 'in-person'
                                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                    } transition-all`}
                            >
                                <MapPin size={20} className="mb-1" />
                                <span className="text-xs">In-person</span>
                            </button>
                            <button className="flex flex-col items-center justify-center p-3 rounded border border-gray-200 hover:border-gray-300 text-gray-600 transition-all">
                                <span className="text-xs font-medium">All options</span>
                                <ChevronDown size={14} className="mt-1" />
                            </button>
                        </div>
                    </div>

                    {/* Availability */}
                    <div className="p-6 border-b border-gray-100">
                        <div
                            className="flex items-center justify-between mb-4 cursor-pointer group"
                            onClick={() => setShowAvailabilityDropdown(!showAvailabilityDropdown)}
                        >
                            <h3 className="font-bold text-gray-900">Availability</h3>
                            {showAvailabilityDropdown ? (
                                <ChevronUp size={16} className="text-gray-400" />
                            ) : (
                                <ChevronDown size={16} className="text-gray-400" />
                            )}
                        </div>

                        {showAvailabilityDropdown ? (
                            <div className="space-y-2">
                                {availabilityOptions.map((opt, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            setSelectedAvailability(opt);
                                            setShowAvailabilityDropdown(false);
                                        }}
                                        className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${selectedAvailability.label === opt.label
                                                ? 'border-blue-600 bg-blue-50 text-blue-700'
                                                : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                            }`}
                                    >
                                        <div>
                                            <div className="text-sm font-medium">{opt.label}</div>
                                            <div className="text-xs text-gray-500">{opt.extra}</div>
                                        </div>
                                        {selectedAvailability.label === opt.label && (
                                            <Check size={16} className="text-blue-600" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <>
                                <div className="text-sm text-gray-600">
                                    {selectedAvailability.label}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    {selectedAvailability.extra}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Host */}
                    <div className="p-6 border-b border-gray-100">
                        <div
                            className="flex items-center justify-between mb-4 cursor-pointer group"
                            onClick={() => setShowHostDropdown(!showHostDropdown)}
                        >
                            <h3 className="font-bold text-gray-900">Host</h3>
                            {showHostDropdown ? (
                                <ChevronUp size={16} className="text-gray-400" />
                            ) : (
                                <ChevronDown size={16} className="text-gray-400" />
                            )}
                        </div>

                        {showHostDropdown ? (
                            <div className="space-y-2">
                                {hostOptions.map((host, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            setSelectedHost(host);
                                            setShowHostDropdown(false);
                                        }}
                                        className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${selectedHost.name === host.name
                                                ? 'border-blue-600 bg-blue-50 text-blue-700'
                                                : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                                {host.initial}
                                            </div>
                                            <span className="text-sm">{host.name} ({host.email})</span>
                                        </div>
                                        {selectedHost.name === host.name && (
                                            <Check size={16} className="text-blue-600" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                    {selectedHost.initial}
                                </div>
                                <span className="text-sm text-gray-600">{selectedHost.name} ({selectedHost.email})</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                    <button
                        onClick={handlePreview}
                        className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900"
                    >
                        <Eye size={14} />
                        Preview
                    </button>
                    <div className="flex items-center gap-3">
                        <button className="text-sm font-medium text-gray-700 hover:text-gray-900">
                            More options
                        </button>
                        <button
                            onClick={handleSaveChanges}
                            disabled={saving}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-bold text-sm transition-colors disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Save changes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditEventDrawer;
