import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Calendar, Clock, Users, Mail, MessageSquare, Check, Play, ArrowRight, Zap, Shield, Globe, Smartphone, X, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';

// CSS for animations - add to your index.css or include here
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.landing-page {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animate-float { animation: float 6s ease-in-out infinite; }
.animate-fadeInUp { animation: fadeInUp 0.8s ease-out forwards; }
.animate-slideInRight { animation: slideInRight 0.8s ease-out forwards; }
.animate-pulse-slow { animation: pulse 3s ease-in-out infinite; }

.gradient-bg {
  background: linear-gradient(-45deg, #0066FF, #00D4FF, #FF00D4, #0066FF);
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
}

.btn-primary {
  background-color: #006BFF;
  transition: all 0.2s ease;
}
.btn-primary:hover {
  background-color: #0055CC;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 107, 255, 0.4);
}

.btn-outline {
  border: 2px solid #E5E7EB;
  transition: all 0.2s ease;
}
.btn-outline:hover {
  border-color: #D1D5DB;
  background-color: #F9FAFB;
}

.card-shadow {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}
.card-shadow:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transform: translateY(-4px);
}

.nav-link {
  position: relative;
}
.nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #006BFF;
  transition: width 0.3s ease;
}
.nav-link:hover::after {
  width: 100%;
}
`;

const LandingPage = () => {
    const navigate = useNavigate();
    const [scrollY, setScrollY] = useState(0);
    const [visibleSections, setVisibleSections] = useState({});
    const sectionRefs = useRef({});

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Intersection Observer for scroll animations
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setVisibleSections((prev) => ({
                            ...prev,
                            [entry.target.id]: true,
                        }));
                    }
                });
            },
            { threshold: 0.1 }
        );

        Object.values(sectionRefs.current).forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, []);

    const handleGetStarted = (e) => {
        e.stopPropagation();
        navigate('/dashboard');
    };

    const trustedCompanies = [
        'Dropbox', 'GONG', 'Carnival', 'Indiana University', 'DOORDASH', 'Lyft', 'COMPASS', "L'ORÉAL"
    ];

    const features = [
        {
            icon: Calendar,
            title: 'Connect your calendars',
            description: 'Link your Google, Outlook, Office 365, or iCloud calendar to automatically check availability and prevent double bookings.'
        },
        {
            icon: Clock,
            title: 'Add your availability',
            description: 'Set your availability preferences and let invitees pick from available times that work for both of you.'
        },
        {
            icon: Zap,
            title: 'Connect conferencing tools',
            description: 'Automatically generate video call links for Zoom, Google Meet, Microsoft Teams, and more.'
        },
        {
            icon: Shield,
            title: 'Customize your event types',
            description: 'Create different meeting types with unique durations, availability, and scheduling rules.'
        }
    ];

    const integrations = [
        { name: 'Google', color: '#4285F4' },
        { name: 'Microsoft', color: '#00A4EF' },
        { name: 'Zoom', color: '#2D8CFF' },
        { name: 'Salesforce', color: '#00A1E0' },
        { name: 'Slack', color: '#4A154B' },
        { name: 'HubSpot', color: '#FF7A59' },
    ];

    return (
        <>
            <style>{styles}</style>
            <div className="landing-page min-h-screen bg-white">
                {/* Top Bar */}
                <div className="bg-white border-b border-gray-100 py-2 px-6 hidden md:block">
                    <div className="max-w-7xl mx-auto flex justify-end items-center gap-4 text-sm">
                        <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
                            <Globe size={14} />
                            English <ChevronDown size={12} />
                        </button>
                        <a href="#" className="text-gray-600 hover:text-gray-900">Talk to sales</a>
                    </div>
                </div>

                {/* Header */}
                <header className="bg-white sticky top-0 z-50 border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-12">
                            {/* Logo */}
                            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                                <div className="w-9 h-9 rounded-full border-[3px] border-[#006BFF] flex items-center justify-center">
                                    <Calendar className="w-4 h-4 text-[#006BFF]" />
                                </div>
                                <span className="text-[22px] font-bold text-[#006BFF]">Calendlify</span>
                            </div>

                            {/* Navigation */}
                            <nav className="hidden lg:flex items-center gap-8">
                                {['Product', 'Solutions', 'Resources'].map((item) => (
                                    <button key={item} className="nav-link flex items-center gap-1 text-[#0B3558] hover:text-[#006BFF] font-medium text-[15px] py-2">
                                        {item} <ChevronDown size={14} className="text-gray-400" />
                                    </button>
                                ))}
                                <button className="nav-link text-[#0B3558] hover:text-[#006BFF] font-medium text-[15px] py-2">
                                    Pricing
                                </button>
                            </nav>
                        </div>

                        <div className="flex items-center gap-4">
                            <button className="text-[#0B3558] hover:text-[#006BFF] font-medium text-[15px] hidden sm:block">
                                Log In
                            </button>
                            <button
                                onClick={handleGetStarted}
                                className="btn-primary text-white px-6 py-2.5 rounded-lg font-semibold text-[15px]"
                            >
                                Get started
                            </button>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="relative overflow-hidden bg-white">
                    {/* Decorative Background */}
                    <div className="absolute top-0 right-0 w-2/3 h-full overflow-hidden pointer-events-none">
                        <div className="absolute top-[-100px] right-[-200px] w-[800px] h-[800px] rounded-bl-[300px] bg-gradient-to-br from-[#00B4FF] via-[#006BFF] to-[#0047AB] opacity-90 animate-float"></div>
                        <div className="absolute bottom-[-200px] right-[100px] w-[500px] h-[500px] rounded-tl-[200px] rounded-tr-[200px] bg-gradient-to-t from-[#FF00FF] via-[#FF66FF] to-[#CC00CC] opacity-80"></div>
                    </div>

                    <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24 relative z-10">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            {/* Left Content */}
                            <div className="animate-fadeInUp">
                                <h1 className="text-[52px] lg:text-[68px] font-extrabold text-[#0B3558] leading-[1.05] mb-6">
                                    Easy<br />
                                    scheduling<br />
                                    ahead
                                </h1>
                                <p className="text-[18px] lg:text-[20px] text-[#476788] mb-10 max-w-[420px] leading-relaxed">
                                    Join 20 million professionals who easily book meetings with the #1 scheduling tool.
                                </p>

                                <div className="space-y-3 mb-6">
                                    <button
                                        onClick={handleGetStarted}
                                        className="w-[280px] flex items-center justify-center gap-3 bg-[#006BFF] hover:bg-[#0055CC] rounded-lg py-4 px-6 font-semibold text-white transition-all shadow-lg hover:shadow-xl"
                                    >
                                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                                            <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                            <path fill="#fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path fill="#fff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                            <path fill="#fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                        </svg>
                                        Sign up with Google
                                    </button>
                                    <button
                                        onClick={handleGetStarted}
                                        className="w-[280px] flex items-center justify-center gap-3 bg-[#0B3558] hover:bg-[#0a2d4a] rounded-lg py-4 px-6 font-semibold text-white transition-all"
                                    >
                                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                                            <path fill="#F25022" d="M1 1h10v10H1z" />
                                            <path fill="#00A4EF" d="M1 13h10v10H1z" />
                                            <path fill="#7FBA00" d="M13 1h10v10H13z" />
                                            <path fill="#FFB900" d="M13 13h10v10H13z" />
                                        </svg>
                                        Sign up with Microsoft
                                    </button>
                                </div>

                                <div className="text-center w-[280px]">
                                    <p className="text-gray-400 text-sm mb-1">OR</p>
                                    <a href="#" className="text-[#006BFF] hover:underline text-sm font-medium">Sign up free with email.</a>
                                    <span className="text-gray-400 text-sm ml-1">No credit card required</span>
                                </div>
                            </div>

                            {/* Right Content - Booking Preview Card */}
                            <div className="relative z-20 animate-slideInRight hidden lg:block">
                                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-[480px] ml-auto border border-gray-100 card-shadow">
                                    <h3 className="text-[20px] font-bold text-[#0B3558] mb-6">Share your booking page</h3>

                                    {/* Mini Booking Preview */}
                                    <div className="bg-[#F8F9FB] rounded-xl p-5 mb-5">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 bg-[#006BFF] rounded-lg flex items-center justify-center">
                                                <Calendar className="w-5 h-5 text-white" />
                                            </div>
                                            <span className="font-semibold text-[#0B3558]">ACME Inc.</span>
                                        </div>

                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400"></div>
                                            <div>
                                                <div className="text-sm text-gray-500">Fatima Sy</div>
                                                <div className="font-semibold text-[#0B3558]">Client Check-in</div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <span className="flex items-center gap-1.5">
                                                <Clock size={14} /> 30 min
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Users size={14} /> Zoom
                                            </span>
                                        </div>
                                    </div>

                                    {/* Calendar Grid */}
                                    <div className="flex gap-6">
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-sm font-semibold text-gray-400">Select a Date & Time</span>
                                            </div>
                                            <div className="text-center mb-2">
                                                <span className="text-sm font-semibold text-[#0B3558]">July 2026</span>
                                            </div>
                                            <div className="grid grid-cols-7 gap-1 text-center text-[11px] mb-2">
                                                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
                                                    <div key={day} className="text-gray-400 font-medium py-1">{day}</div>
                                                ))}
                                            </div>
                                            <div className="grid grid-cols-7 gap-1 text-center text-xs">
                                                {[...Array(35)].map((_, i) => {
                                                    const day = i - 3; // Offset for month start
                                                    const isHighlighted = [16, 17, 18, 19, 23, 24, 25].includes(i);
                                                    const isSelected = i === 22;
                                                    return (
                                                        <div
                                                            key={i}
                                                            className={`py-1.5 rounded-full ${isSelected
                                                                    ? 'bg-[#006BFF] text-white font-bold'
                                                                    : isHighlighted
                                                                        ? 'text-[#006BFF] font-semibold cursor-pointer hover:bg-blue-50'
                                                                        : day < 1 || day > 31
                                                                            ? 'text-gray-200'
                                                                            : 'text-gray-400'
                                                                }`}
                                                        >
                                                            {day > 0 && day <= 31 ? day : ''}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className="w-[140px]">
                                            <div className="text-sm font-semibold text-[#0B3558] mb-3">Monday, July 22</div>
                                            <div className="space-y-2">
                                                {['10:00am', '11:00am', '1:00pm', '2:30pm', '4:00pm'].map((time, i) => (
                                                    <button
                                                        key={time}
                                                        className={`w-full py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${i === 1
                                                                ? 'bg-[#006BFF] text-white border-[#006BFF] flex items-center justify-between'
                                                                : 'border-[#006BFF] text-[#006BFF] hover:bg-blue-50'
                                                            }`}
                                                    >
                                                        {time}
                                                        {i === 1 && <span className="bg-[#0B3558] text-white px-2 py-0.5 rounded text-[10px]">Confirm</span>}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Trusted By Section */}
                <section
                    id="trusted"
                    ref={(el) => (sectionRefs.current.trusted = el)}
                    className={`py-12 bg-[#F8F9FB] border-y border-gray-100 ${visibleSections.trusted ? 'animate-fadeInUp' : 'opacity-0'}`}
                >
                    <div className="max-w-7xl mx-auto px-6">
                        <p className="text-center text-[#476788] text-[15px] mb-8">
                            Trusted by more than <strong className="text-[#0B3558]">100,000</strong> of the world's leading organizations
                        </p>
                        <div className="flex items-center justify-center gap-8 lg:gap-12 flex-wrap">
                            {trustedCompanies.map((company) => (
                                <span key={company} className="text-[15px] font-bold text-gray-300 hover:text-gray-400 transition-colors cursor-default">
                                    {company}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Main Features Section */}
                <section
                    id="features"
                    ref={(el) => (sectionRefs.current.features = el)}
                    className={`py-24 bg-white ${visibleSections.features ? 'animate-fadeInUp' : 'opacity-0'}`}
                >
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-[40px] lg:text-[52px] font-extrabold text-[#0B3558] leading-tight mb-6">
                                Calendlify makes<br />scheduling simple
                            </h2>
                            <p className="text-[18px] text-[#476788] max-w-3xl mx-auto leading-relaxed">
                                Calendlify's easy enough for individual users, and powerful enough to meet the needs of
                                enterprise organizations — including 86% of the Fortune 500 companies.
                            </p>
                        </div>

                        <div className="flex justify-center mb-16">
                            <button
                                onClick={handleGetStarted}
                                className="bg-[#0B3558] hover:bg-[#0a2d4a] text-white px-10 py-4 rounded-lg font-semibold text-[16px] transition-all shadow-lg hover:shadow-xl"
                            >
                                Sign up for free
                            </button>
                        </div>

                        {/* Feature Cards */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {features.map((feature, i) => (
                                <div
                                    key={i}
                                    className="p-6 rounded-xl border border-gray-100 hover:border-gray-200 transition-all group cursor-pointer"
                                    style={{ animationDelay: `${i * 0.1}s` }}
                                >
                                    <div className="w-14 h-14 bg-[#E8F4FE] group-hover:bg-[#006BFF] rounded-xl flex items-center justify-center mb-5 transition-colors">
                                        <feature.icon className="w-7 h-7 text-[#006BFF] group-hover:text-white transition-colors" />
                                    </div>
                                    <h3 className="font-bold text-[#0B3558] text-[17px] mb-2">{feature.title}</h3>
                                    <p className="text-[#476788] text-[14px] leading-relaxed">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Workflow Cards Section */}
                <section
                    id="workflows"
                    ref={(el) => (sectionRefs.current.workflows = el)}
                    className={`py-24 bg-[#F8F9FB] ${visibleSections.workflows ? 'animate-fadeInUp' : 'opacity-0'}`}
                >
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-[36px] lg:text-[44px] font-extrabold text-[#0B3558] mb-4">
                                Reduce no-shows and stay on track
                            </h2>
                            <p className="text-[18px] text-[#476788]">
                                Automate reminders and follow-ups to keep everyone informed
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {/* Text Reminder Card */}
                            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 card-shadow">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="bg-[#E8F4FE] text-[#006BFF] text-xs font-bold px-3 py-1.5 rounded-full">Workflow</span>
                                    <div className="w-8 h-8 bg-[#E8F4FE] rounded-lg flex items-center justify-center">
                                        <MessageSquare className="w-4 h-4 text-[#006BFF]" />
                                    </div>
                                </div>
                                <h3 className="text-[22px] font-bold text-[#0B3558] mb-6">Send text reminder</h3>
                                <div className="space-y-4">
                                    <div className="bg-[#F8F9FB] rounded-lg px-5 py-3 text-[14px] text-[#476788] border border-gray-200">
                                        24 hours before event starts
                                    </div>
                                    <div className="flex justify-center">
                                        <div className="w-px h-8 border-l-2 border-dashed border-gray-300"></div>
                                    </div>
                                    <div className="flex items-center gap-3 bg-[#F8F9FB] rounded-lg px-5 py-3 text-[14px] text-[#006BFF] border border-gray-200">
                                        <MessageSquare size={16} />
                                        Send text to invitees
                                    </div>
                                </div>
                            </div>

                            {/* Email Follow-up Card */}
                            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 card-shadow">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="bg-[#E8F4FE] text-[#006BFF] text-xs font-bold px-3 py-1.5 rounded-full">Workflow</span>
                                    <div className="w-8 h-8 bg-[#E8F4FE] rounded-lg flex items-center justify-center">
                                        <Mail className="w-4 h-4 text-[#006BFF]" />
                                    </div>
                                </div>
                                <h3 className="text-[22px] font-bold text-[#0B3558] mb-6">Send follow-up email</h3>
                                <div className="space-y-4">
                                    <div className="bg-[#F8F9FB] rounded-lg px-5 py-3 text-[14px] text-[#476788] border border-gray-200">
                                        2 hours after event ends
                                    </div>
                                    <div className="flex justify-center">
                                        <div className="w-px h-8 border-l-2 border-dashed border-gray-300"></div>
                                    </div>
                                    <div className="flex items-center gap-3 bg-[#F8F9FB] rounded-lg px-5 py-3 text-[14px] text-[#006BFF] border border-gray-200">
                                        <Mail size={16} />
                                        Send email to invitees
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Integrations Section */}
                <section
                    id="integrations"
                    ref={(el) => (sectionRefs.current.integrations = el)}
                    className={`py-24 bg-white ${visibleSections.integrations ? 'animate-fadeInUp' : 'opacity-0'}`}
                >
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-[36px] lg:text-[44px] font-extrabold text-[#0B3558] mb-4">
                                Boost productivity with 100+ integrations
                            </h2>
                            <p className="text-[18px] text-[#476788]">
                                Connect with the tools you already use every day
                            </p>
                        </div>

                        <div className="flex flex-wrap justify-center gap-6 max-w-3xl mx-auto">
                            {integrations.map((integration, i) => (
                                <div
                                    key={i}
                                    className="w-24 h-24 bg-white rounded-2xl shadow-md border border-gray-100 flex items-center justify-center card-shadow"
                                    style={{ animationDelay: `${i * 0.05}s` }}
                                >
                                    <div
                                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                                        style={{ backgroundColor: integration.color }}
                                    >
                                        {integration.name[0]}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="text-center mt-10">
                            <a href="#" className="text-[#006BFF] font-semibold hover:underline inline-flex items-center gap-2">
                                See all integrations <ArrowRight size={16} />
                            </a>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 bg-gradient-to-br from-[#006BFF] to-[#0047AB] text-white">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <h2 className="text-[36px] lg:text-[48px] font-extrabold mb-6">
                            Ready to simplify your scheduling?
                        </h2>
                        <p className="text-[18px] opacity-90 mb-10 max-w-2xl mx-auto">
                            Join millions of professionals who trust Calendlify to handle their scheduling needs.
                        </p>
                        <button
                            onClick={handleGetStarted}
                            className="bg-white text-[#006BFF] px-10 py-4 rounded-lg font-bold text-[16px] hover:bg-gray-100 transition-all shadow-lg"
                        >
                            Get started for free
                        </button>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-[#F8F9FB] py-16 border-t border-gray-200">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid md:grid-cols-5 gap-8 mb-12">
                            <div>
                                <h4 className="font-bold text-[#0B3558] mb-4 text-[14px]">Product</h4>
                                <ul className="space-y-2.5 text-[13px] text-[#476788]">
                                    <li><a href="#" className="hover:text-[#006BFF]">Scheduling automation</a></li>
                                    <li><a href="#" className="hover:text-[#006BFF]">Meeting Notetaker</a></li>
                                    <li><a href="#" className="hover:text-[#006BFF]">Customizable availability</a></li>
                                    <li><a href="#" className="hover:text-[#006BFF]">Mobile apps</a></li>
                                    <li><a href="#" className="hover:text-[#006BFF]">Browser extensions</a></li>
                                    <li><a href="#" className="hover:text-[#006BFF]">Meeting routing</a></li>
                                    <li><a href="#" className="hover:text-[#006BFF]">Event Types</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-[#0B3558] mb-4 text-[14px]">Integrations</h4>
                                <ul className="space-y-2.5 text-[13px] text-[#476788]">
                                    <li><a href="#" className="hover:text-[#006BFF]">Google ecosystem</a></li>
                                    <li><a href="#" className="hover:text-[#006BFF]">Microsoft ecosystem</a></li>
                                    <li><a href="#" className="hover:text-[#006BFF]">Calendars</a></li>
                                    <li><a href="#" className="hover:text-[#006BFF]">Video conferencing</a></li>
                                    <li><a href="#" className="hover:text-[#006BFF]">Payments</a></li>
                                    <li><a href="#" className="hover:text-[#006BFF]">Sales & CRM</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-[#0B3558] mb-4 text-[14px]">Calendlify</h4>
                                <ul className="space-y-2.5 text-[13px] text-[#476788]">
                                    <li><a href="#" className="hover:text-[#006BFF]">Pricing</a></li>
                                    <li><a href="#" className="hover:text-[#006BFF]">Product overview</a></li>
                                    <li><a href="#" className="hover:text-[#006BFF]">Solutions</a></li>
                                    <li><a href="#" className="hover:text-[#006BFF]">For individuals</a></li>
                                    <li><a href="#" className="hover:text-[#006BFF]">For small businesses</a></li>
                                    <li><a href="#" className="hover:text-[#006BFF]">Security</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-[#0B3558] mb-4 text-[14px]">Resources</h4>
                                <ul className="space-y-2.5 text-[13px] text-[#476788]">
                                    <li><a href="#" className="hover:text-[#006BFF]">Help center</a></li>
                                    <li><a href="#" className="hover:text-[#006BFF]">Resource center</a></li>
                                    <li><a href="#" className="hover:text-[#006BFF]">Blog</a></li>
                                    <li><a href="#" className="hover:text-[#006BFF]">Customer stories</a></li>
                                    <li><a href="#" className="hover:text-[#006BFF]">Developer tools</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-[#0B3558] mb-4 text-[14px]">Company</h4>
                                <ul className="space-y-2.5 text-[13px] text-[#476788]">
                                    <li><a href="#" className="hover:text-[#006BFF]">About us</a></li>
                                    <li><a href="#" className="hover:text-[#006BFF]">Leadership</a></li>
                                    <li><a href="#" className="hover:text-[#006BFF]">Careers <span className="text-green-500 text-[11px] font-medium ml-1">We're hiring!</span></a></li>
                                    <li><a href="#" className="hover:text-[#006BFF]">Newsroom</a></li>
                                    <li><a href="#" className="hover:text-[#006BFF]">Contact us</a></li>
                                </ul>
                            </div>
                        </div>

                        {/* Downloads */}
                        <div className="mb-10">
                            <h4 className="font-bold text-[#0B3558] mb-4 text-[14px]">Downloads</h4>
                            <div className="flex flex-wrap gap-3">
                                {['App Store', 'Google Play', 'Chrome extension', 'Edge extension', 'Firefox extension', 'Safari extension', 'Outlook add-in'].map((item) => (
                                    <button key={item} className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-[12px] font-medium text-[#0B3558] hover:border-gray-300 transition-colors">
                                        <Smartphone size={14} />
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Bottom Footer */}
                        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-2 text-[13px] text-[#476788]">
                                <Globe size={14} />
                                English <ChevronDown size={12} />
                            </div>
                            <div className="flex items-center gap-6 text-[13px] text-[#476788]">
                                <a href="#" className="hover:text-[#0B3558]">Privacy Policy</a>
                                <a href="#" className="hover:text-[#0B3558]">Legal</a>
                                <a href="#" className="hover:text-[#0B3558]">Status</a>
                                <a href="#" className="hover:text-[#0B3558]">Cookie Settings</a>
                            </div>
                            <div className="flex items-center gap-4">
                                {[X, Facebook, Instagram, Linkedin, Youtube].map((Icon, i) => (
                                    <a key={i} href="#" className="text-[#476788] hover:text-[#006BFF] transition-colors">
                                        <Icon size={18} />
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div className="text-center mt-8 text-[12px] text-gray-400">
                            Copyright Calendlify 2026
                        </div>
                    </div>
                </footer>

                {/* Floating Chat Button */}
                <div className="fixed bottom-6 right-6 w-14 h-14 bg-[#006BFF] rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-[#0055CC] transition-colors z-50">
                    <MessageSquare className="w-6 h-6 text-white" />
                </div>
            </div>
        </>
    );
};

export default LandingPage;
