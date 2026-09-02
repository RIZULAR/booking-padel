import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { 
  User, 
  Calendar, 
  LogOut, 
  Menu, 
  X, 
  ChevronDown, 
  ShieldAlert, 
  LayoutDashboard 
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, role, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // If user is Admin or Staff on dashboard route, Navbar is hidden (they use sidebar layout)
  if ((role === 'admin' && location.pathname.startsWith('/admin')) ||
      (role === 'staff' && location.pathname.startsWith('/staff'))) {
    return null;
  }

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-neutral-900">
          <img src="/logo.svg" alt="Padel Arena Logo" className="w-8 h-8 rounded-lg shadow-2xs flex-shrink-0" />
          <span className="font-semibold text-lg text-neutral-900">PADEL<span className="text-brand-600">ARENA</span></span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            to="/" 
            className={`text-sm font-medium transition-colors ${
              location.pathname === '/' ? 'text-brand-600 font-semibold' : 'text-neutral-600 hover:text-brand-600'
            }`}
          >
            Home
          </Link>
          <Link 
            to="/courts" 
            className={`text-sm font-medium transition-colors ${
              location.pathname.startsWith('/courts') ? 'text-brand-600 font-semibold' : 'text-neutral-600 hover:text-brand-600'
            }`}
          >
            Courts
          </Link>
          {isAuthenticated && role === 'customer' && (
            <Link 
              to="/my-bookings" 
              className={`text-sm font-medium transition-colors ${
                location.pathname.startsWith('/my-bookings') ? 'text-brand-600 font-semibold' : 'text-neutral-600 hover:text-brand-600'
              }`}
            >
              My Booking
            </Link>
          )}
        </nav>

        {/* Desktop CTA & Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Button 
            onClick={() => navigate('/courts')}
            className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-all"
          >
            Book Now
          </Button>

          {!isAuthenticated ? (
            <Button 
              variant="outline" 
              onClick={() => navigate('/login')}
              className="text-sm font-medium border-neutral-300 hover:bg-neutral-50"
            >
              Login
            </Button>
          ) : (
            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-neutral-200 hover:bg-neutral-50 transition-colors text-sm font-medium text-neutral-800"
              >
                <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <span>{user?.name?.split(' ')[0]}</span>
                <ChevronDown className="w-4 h-4 text-neutral-500" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-neutral-200 rounded-xl shadow-lg py-1 z-50">
                  <div className="px-4 py-2 border-b border-neutral-100">
                    <p className="text-xs text-neutral-500">Signed in as</p>
                    <p className="text-sm font-semibold text-neutral-900 truncate">{user?.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded bg-brand-50 text-brand-700">
                      {role}
                    </span>
                  </div>

                  {role === 'customer' && (
                    <>
                      <Link 
                        to="/profile" 
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                      >
                        <User className="w-4 h-4 text-neutral-500" />
                        Profile
                      </Link>
                      <Link 
                        to="/my-bookings" 
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                      >
                        <Calendar className="w-4 h-4 text-neutral-500" />
                        My Booking
                      </Link>
                    </>
                  )}

                  {role === 'admin' && (
                    <Link 
                      to="/admin" 
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                    >
                      <LayoutDashboard className="w-4 h-4 text-brand-600" />
                      Admin Dashboard
                    </Link>
                  )}

                  {role === 'staff' && (
                    <Link 
                      to="/staff" 
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                    >
                      <ShieldAlert className="w-4 h-4 text-amber-600" />
                      Staff Panel
                    </Link>
                  )}

                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-neutral-100 text-left"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button 
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-lg text-neutral-600 hover:bg-neutral-100"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="md:hidden border-b border-neutral-200 bg-white px-4 pt-2 pb-6 space-y-3">
          <Link 
            to="/" 
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-base font-medium text-neutral-700 hover:text-brand-600"
          >
            Home
          </Link>
          <Link 
            to="/courts" 
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-base font-medium text-neutral-700 hover:text-brand-600"
          >
            Courts
          </Link>

          {isAuthenticated ? (
            <>
              {role === 'customer' && (
                <>
                  <Link 
                    to="/my-bookings" 
                    onClick={() => setMobileOpen(false)}
                    className="block py-2 text-base font-medium text-neutral-700 hover:text-brand-600"
                  >
                    My Booking
                  </Link>
                  <Link 
                    to="/profile" 
                    onClick={() => setMobileOpen(false)}
                    className="block py-2 text-base font-medium text-neutral-700 hover:text-brand-600"
                  >
                    Profile
                  </Link>
                </>
              )}
              {role === 'admin' && (
                <Link 
                  to="/admin" 
                  onClick={() => setMobileOpen(false)}
                  className="block py-2 text-base font-medium text-brand-600 font-semibold"
                >
                  Admin Dashboard
                </Link>
              )}
              {role === 'staff' && (
                <Link 
                  to="/staff" 
                  onClick={() => setMobileOpen(false)}
                  className="block py-2 text-base font-medium text-amber-600 font-semibold"
                >
                  Staff Dashboard
                </Link>
              )}
              <div className="pt-2 border-t border-neutral-100 flex flex-col gap-2">
                <Button onClick={() => { setMobileOpen(false); navigate('/courts'); }} className="w-full bg-brand-600">
                  Book Now
                </Button>
                <Button variant="outline" onClick={handleLogout} className="w-full text-red-600 border-red-200">
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <div className="pt-2 border-t border-neutral-100 flex flex-col gap-2">
              <Button onClick={() => { setMobileOpen(false); navigate('/courts'); }} className="w-full bg-brand-600">
                Book Now
              </Button>
              <Button variant="outline" onClick={() => { setMobileOpen(false); navigate('/login'); }} className="w-full">
                Login
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
