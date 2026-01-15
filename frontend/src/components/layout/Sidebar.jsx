import { Link, useLocation } from 'react-router-dom';
import { Link as LinkIcon, Clock, Users, Plus, Calendar } from 'lucide-react';

const Sidebar = () => {
    const location = useLocation();

    return (
        <aside className="w-[240px] bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col z-10 text-left">
            {/* Logo */}
            <div className="h-16 flex items-center px-6 border-b border-transparent">
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-sm">C</div>
                    <span className="text-lg font-bold text-gray-800 tracking-tight">Calendlify</span>
                </Link>
            </div>

            {/* Create Button */}
            <div className="px-6 mb-2 mt-6">
                <button className="w-full flex items-center justify-center gap-2 text-white bg-blue-600 rounded-full py-3 px-4 hover:bg-blue-700 transition-colors font-semibold shadow-sm text-sm">
                    <Plus size={20} strokeWidth={2.5} />
                    Create
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                <Link
                    to="/dashboard"
                    className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${location.pathname === '/dashboard' || location.pathname === '/' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-600 hover:bg-gray-100 font-medium'}`}
                >
                    <LinkIcon size={20} />
                    <span>Scheduling</span>
                </Link>
                <Link
                    to="/scheduled_events"
                    className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${location.pathname.includes('/scheduled_events') ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-600 hover:bg-gray-100 font-medium'}`}
                >
                    <Calendar size={20} />
                    <span>Meetings</span>
                </Link>
                <Link
                    to="/availability"
                    className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${location.pathname.includes('/availability') ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-600 hover:bg-gray-100 font-medium'}`}
                >
                    <Clock size={20} />
                    <span>Availability</span>
                </Link>
                <Link
                    to="/contacts"
                    className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${location.pathname.includes('/contacts') ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-600 hover:bg-gray-100 font-medium'}`}
                >
                    <Users size={20} />
                    <span>Contacts</span>
                </Link>
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-gray-100 space-y-1">
                <button className="flex items-center justify-start w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-900 whitespace-nowrap rounded-md hover:bg-gray-50 transition-colors">
                    Admin center
                </button>
                <div className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-900 whitespace-nowrap rounded-md hover:bg-gray-50 transition-colors cursor-pointer">
                    <span>Account</span>
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
