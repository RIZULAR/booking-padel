import { Link, useLocation } from 'react-router-dom';

export default function Footer() {
  const location = useLocation();

  if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/staff')) {
    return null;
  }
  return (
    <footer className="bg-white border-t border-neutral-200 mt-12 py-8 text-neutral-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2.5 font-semibold text-xs tracking-tight text-neutral-900">
          <img src="/logo.svg" alt="Padel Arena Logo" className="w-6 h-6 rounded-lg flex-shrink-0" />
          <span>PADEL ARENA SYSTEM</span>
        </div>

        <div className="flex items-center gap-6">
          <Link to="/" className="hover:text-brand-600">Home</Link>
          <Link to="/courts" className="hover:text-brand-600">Courts</Link>
          <Link to="/my-bookings" className="hover:text-brand-600">My Booking</Link>
        </div>

        <p className="text-neutral-400">
          © {new Date().getFullYear()} Padel Booking System. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
