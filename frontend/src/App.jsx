import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import EventTypesPage from './pages/EventTypesPage';
import AvailabilityPage from './pages/AvailabilityPage';
import MeetingsPage from './pages/MeetingsPage';
import PublicBookingPage from './pages/PublicBookingPage';

// Placeholder Pages
const NotFound = () => <div className="p-8 text-center">Page Not Found</div>;

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/booking/:slug/*" element={<PublicBookingPage />} />

        {/* Dashboard Routes (Protected in real app, open here) */}
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<EventTypesPage />} />
          <Route path="/availability" element={<AvailabilityPage />} />
          <Route path="/scheduled_events" element={<MeetingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
