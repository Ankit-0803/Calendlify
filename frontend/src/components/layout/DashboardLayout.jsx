import Sidebar from './Sidebar';
import { ChevronDown } from 'lucide-react';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
    // Assume a logged-in user for the admin side
    const user = { name: "Ankit Kushwaha", avatar: "A" };

    return (
        <div className="min-h-screen bg-white flex">
            <Sidebar />

            <div className="flex-1 ml-[240px] flex flex-col min-w-0">
                {/* Top Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-end px-8 sticky top-0 z-20">
                    <div className="flex items-center gap-6">
                        <button className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                            Help
                        </button>

                        <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded-full pr-2 transition-colors border border-transparent hover:border-gray-200 group">
                            <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold text-sm group-hover:bg-gray-300 transition-colors border-2 border-white shadow-sm">
                                {user.avatar}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-700 leading-none group-hover:text-gray-900">Account</span>
                            </div>
                            <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600" />
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 p-8 overflow-y-auto bg-gray-50/50">
                    <div className="max-w-6xl mx-auto animate-fade-in">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
