import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import LandingPage from './pages/LandingPage';
import EventTypesPage from './pages/EventTypesPage';
import AvailabilityPage from './pages/AvailabilityPage';
import MeetingsPage from './pages/MeetingsPage';
import PublicBookingPage from './pages/PublicBookingPage';
import EventPreviewPage from './pages/EventPreviewPage';
import BookingFormPage from './pages/BookingFormPage';

// Placeholder Pages
const NotFound = () => <div className="p-8 text-center">Page Not Found</div>;

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Public Routes */}
        <Route path="/booking/:slug/*" element={<PublicBookingPage />} />
        <Route path="/booking/preview/form" element={<BookingFormPage />} />

        {/* Event Preview Page (before saving) */}
        <Route path="/event-types/preview" element={<EventPreviewPage />} />

        {/* Dashboard Routes (Protected in real app, open here) */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<EventTypesPage />} />
          <Route path="/availability" element={<AvailabilityPage />} />
          <Route path="/scheduled_events" element={<MeetingsPage />} />
        </Route>

        {/* Catch all - redirect to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
