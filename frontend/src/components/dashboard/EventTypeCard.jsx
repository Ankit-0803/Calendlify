import { useState, useEffect, useRef } from 'react';
import { Copy, MoreVertical, ExternalLink, Link as LinkIcon, Edit2, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const EventTypeCard = ({ eventType, onDelete }) => {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const copyLink = (e) => {
        e.preventDefault();
        const url = `${window.location.origin}/booking/${eventType.slug}`;
        navigator.clipboard.writeText(url);
        alert('Booking link copied to clipboard!');
    };

    const handleDelete = () => {
        if (window.confirm(`Are you sure you want to delete "${eventType.name}"?`)) {
            onDelete && onDelete(eventType.id);
        }
        setShowMenu(false);
    };

    return (
        <div className="bg-white rounded-md border border-gray-200 shadow-sm hover:shadow-md transition-all relative overflow-visible flex group min-h-[120px]">
            {/* Left Color Strip */}
            <div
                className="w-1.5 absolute top-0 bottom-0 left-0 rounded-l-md"
                style={{ backgroundColor: eventType.color || '#8247f5' }}
            />

            <div className="flex-1 p-6 pl-8 flex flex-col justify-center">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                        <input type="checkbox" className="mt-1.5 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />

                        <div>
                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors cursor-pointer">
                                {eventType.name}
                            </h3>
                            <div className="flex flex-col gap-1 mt-1">
                                <span className="text-gray-500 text-sm">{eventType.durationMinutes} min • Google Meet • One-on-One</span>
                                <span className="text-gray-500 text-sm">Weekdays, hours vary</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-3 relative">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={copyLink}
                                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 hover:border-blue-600 hover:bg-blue-50 border border-gray-300 rounded-full text-sm font-medium transition-all shadow-sm"
                            >
                                <LinkIcon size={16} />
                                Copy link
                            </button>

                            <div className="relative" ref={menuRef}>
                                <button
                                    onClick={() => setShowMenu(!showMenu)}
                                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <MoreVertical size={20} />
                                </button>

                                {showMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50 py-1 origin-top-right">
                                        <button
                                            onClick={() => { alert('Edit functionality coming soon'); setShowMenu(false); }}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                        >
                                            <Edit2 size={14} /> Edit
                                        </button>
                                        <button
                                            onClick={handleDelete}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                        >
                                            <Trash2 size={14} /> Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventTypeCard;
