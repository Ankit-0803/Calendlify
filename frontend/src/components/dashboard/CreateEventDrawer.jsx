import React, { useState } from 'react';
import { X, Clock, Video, MapPin, Phone, Check, ChevronDown } from 'lucide-react';

const CreateEventDrawer = ({ isOpen, onClose, onCreate }) => {
    const [title, setTitle] = useState('New Meeting');
    const [duration, setDuration] = useState('30');
    const [location, setLocation] = useState('zoom');

    if (!isOpen) return null;

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
                            <div className="w-3 h-3 rounded-full bg-purple-600"></div>
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
                        <div className="flex items-center justify-between mb-4 cursor-pointer group">
                            <h3 className="font-bold text-gray-900">Duration</h3>
                            <ChevronDown size={16} className="text-gray-400" />
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                            <Clock size={16} />
                            <span>30 min</span>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center justify-between mb-4 cursor-pointer group">
                            <h3 className="font-bold text-gray-900">Location</h3>
                            <ChevronDown size={16} className="text-gray-400" />
                        </div>

                        <div className="grid grid-cols-4 gap-2">
                            <button className={`flex flex-col items-center justify-center p-3 rounded border ${location === 'zoom' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300 text-gray-600'} transition-all`}>
                                <Video size={20} className="mb-1" />
                                <span className="text-xs">Zoom</span>
                            </button>
                            <button className="flex flex-col items-center justify-center p-3 rounded border border-gray-200 hover:border-gray-300 text-gray-600 transition-all">
                                <Phone size={20} className="mb-1" />
                                <span className="text-xs">Phone</span>
                            </button>
                            <button className="flex flex-col items-center justify-center p-3 rounded border border-gray-200 hover:border-gray-300 text-gray-600 transition-all">
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
                        <div className="flex items-center justify-between mb-4 cursor-pointer group">
                            <h3 className="font-bold text-gray-900">Availability</h3>
                            <ChevronDown size={16} className="text-gray-400" />
                        </div>
                        <div className="text-sm text-gray-600">
                            Weekdays, hours vary
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                            +1 date-specific time
                        </div>
                    </div>

                    {/* Host */}
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center justify-between mb-4 cursor-pointer group">
                            <h3 className="font-bold text-gray-900">Host</h3>
                            <ChevronDown size={16} className="text-gray-400" />
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">A</div>
                            <span className="text-sm text-gray-600">Ankit Kushwaha (you)</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                    <button className="text-sm font-bold text-gray-700 hover:text-gray-900">
                        More options
                    </button>
                    <button
                        onClick={() => onCreate({ name: title, duration, location })}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-bold text-sm transition-colors"
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateEventDrawer;
