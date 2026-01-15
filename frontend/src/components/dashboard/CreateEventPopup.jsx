import React from 'react';
import { ChevronDown, ChevronRight, User, Users, RefreshCw } from 'lucide-react';

const CreateEventPopup = ({ isOpen, onClose, onSelectType }) => {
    if (!isOpen) return null;

    const options = [
        {
            title: 'One-on-one',
            icon: User,
            description: '1 host → 1 invitee',
            subtext: 'Good for coffee chats, 1:1 interviews, etc.',
            type: 'one-on-one'
        },
        {
            title: 'Group',
            icon: Users,
            description: '1 host → Multiple invitees',
            subtext: 'Webinars, online classes, etc.',
            type: 'group'
        },
        {
            title: 'Round robin',
            icon: RefreshCw,
            description: 'Rotating hosts → 1 invitee',
            subtext: 'Distribute meetings between team members',
            type: 'round-robin'
        }
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-[400px] overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="p-6 pb-2">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Event Types</h2>

                    <div className="space-y-6">
                        {options.map((option) => (
                            <div
                                key={option.title}
                                className="group cursor-pointer hover:bg-blue-50/50 -mx-6 px-6 py-2 transition-colors relative"
                                onClick={() => onSelectType(option.type)}
                            >
                                <div className="flex items-start justify-between mb-1">
                                    <h3 className="text-blue-600 font-bold group-hover:text-blue-700">{option.title}</h3>
                                </div>
                                <div className="text-sm text-gray-700 mb-1 flex items-center gap-2">
                                    {option.description}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {option.subtext}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="border-t border-gray-100 mt-2">
                    <button className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <span className="font-bold text-gray-900">Admin Templates</span>
                        <ChevronDown size={20} className="text-gray-400" />
                    </button>
                    <button className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-t border-gray-100">
                        <span className="font-bold text-gray-900">More ways to meet</span>
                        <ChevronDown size={20} className="text-gray-400" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateEventPopup;
