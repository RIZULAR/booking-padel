import { useState, useEffect, useMemo } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { formatCurrency } from '../lib/utils';
import { 
  Calendar, 
  User, 
  LogOut, 
  CheckCircle, 
  Search, 
  Clock, 
  LayoutDashboard, 
  PlusCircle, 
  CreditCard, 
  ExternalLink,
  XCircle,
  Menu,
  X
} from 'lucide-react';

// Instant Tab-Switching Data Cache (Stale-While-Revalidate pattern)
const staffDataCache: {
  bookings: any[] | null;
  courts: any[] | null;
} = {
  bookings: null,
  courts: null,
};

export default function StaffDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token || (user?.role !== 'staff' && user?.role !== 'admin')) {
      navigate('/login');
    }
  }, [token, user, navigate]);

  if (!token || (user?.role !== 'staff' && user?.role !== 'admin')) return null;

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/bookings')) return 'Reservasi';
    if (path.includes('/manual-booking')) return 'Booking Manual';
    if (path.includes('/schedule')) return 'Jadwal';
    if (path.includes('/payments')) return 'Pembayaran';
    if (path.includes('/profile')) return 'Profil';
    return 'Dashboard';
  };

  const NavItem = ({ to, label, icon: Icon }: { to: string; label: string; icon: any }) => {
    const isActive = location.pathname === to || (to !== '/staff' && location.pathname.startsWith(to));
    return (
      <Link 
        to={to} 
        onClick={() => setMobileOpen(false)}
        className={`flex items-center gap-3 px-3.5 py-2.5 text-xs font-medium rounded-lg transition-colors ${
          isActive 
            ? 'bg-white/15 text-white font-semibold border border-white/20 shadow-2xs' 
            : 'text-brand-100/80 hover:bg-white/10 hover:text-white'
        }`}
      >
        <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-brand-200/80'}`} />
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <div className="fixed inset-0 bg-neutral-50 flex flex-col md:flex-row overflow-hidden z-30 font-sans">
      {/* Staff Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-40 w-64 bg-brand-700 text-white border-r border-brand-800 p-4 flex flex-col justify-between transition-transform duration-200 ease-in-out flex-shrink-0
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2 pt-2 border-b border-brand-600/60 pb-4">
            <div className="flex items-center gap-2.5">
              <img src="/logo.svg" alt="Padel Arena Logo" className="w-7 h-7 rounded-lg bg-white p-1 shadow-2xs flex-shrink-0" />
              <span className="font-semibold text-sm tracking-tight text-white">PADEL STAFF</span>
            </div>
            <span className="text-[10px] font-medium bg-brand-800/60 text-brand-100 px-2 py-0.5 rounded border border-brand-600/50">
              v1.0
            </span>
            <button onClick={() => setMobileOpen(false)} className="md:hidden text-brand-200 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-4">
            <div>
              <div className="px-3 text-[10px] font-medium text-brand-200/80 uppercase tracking-wider mb-1.5">Operasional</div>
              <div className="space-y-0.5">
                <NavItem to="/staff" label="Dashboard" icon={LayoutDashboard} />
                <NavItem to="/staff/bookings" label="Reservasi" icon={Calendar} />
                <NavItem to="/staff/manual-booking" label="Booking Manual" icon={PlusCircle} />
              </div>
            </div>

            <div>
              <div className="px-3 text-[10px] font-medium text-brand-200/80 uppercase tracking-wider mb-1.5">Transaksi</div>
              <div className="space-y-0.5">
                <NavItem to="/staff/schedule" label="Jadwal" icon={Clock} />
                <NavItem to="/staff/payments" label="Pembayaran" icon={CreditCard} />
              </div>
            </div>

            <div>
              <div className="px-3 text-[10px] font-medium text-brand-200/80 uppercase tracking-wider mb-1.5">Akun</div>
              <div className="space-y-0.5">
                <NavItem to="/staff/profile" label="Profil" icon={User} />
              </div>
            </div>
          </nav>
        </div>

        {/* Sidebar Footer Actions */}
        <div className="pt-4 border-t border-brand-600/60 space-y-2">
          <div className="px-3 py-1.5 flex items-center gap-2.5 text-xs rounded-lg bg-brand-800/60 border border-brand-600/50">
            <div className="w-6 h-6 rounded-full bg-white text-brand-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
              {user?.name?.[0]?.toUpperCase() || 'S'}
            </div>
            <div className="truncate">
              <p className="font-medium text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-brand-200">Staf Bertugas</p>
            </div>
          </div>
          
          <Link 
            to="/" 
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-brand-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <ExternalLink className="w-4 h-4" /> Kembali ke Situs Utama
          </Link>
          <button 
            onClick={() => { logout(); navigate('/login'); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-200 hover:bg-red-500/20 hover:text-red-100 rounded-lg transition-colors text-left"
          >
            <LogOut className="w-4 h-4" /> Keluar
          </button>
        </div>
      </aside>

      {/* Main Area Container */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Topbar (Clean Breadcrumb Header) */}
        <header className="bg-white border-b border-neutral-200 px-4 md:px-6 py-3.5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="md:hidden text-neutral-600 hover:text-neutral-900">
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
              <span>Padel Studio</span>
              <span className="text-neutral-300">/</span>
              <span className="font-semibold text-neutral-900">{getPageTitle()}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-600 bg-neutral-100 px-3 py-1 rounded-lg border border-neutral-200 font-medium">
              <Calendar className="w-3.5 h-3.5 text-neutral-500" />
              <span>{new Date().toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Staff On-Duty
            </span>
          </div>
        </header>

        {/* Content Panel Scrollable */}
        <main className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto">
          <Routes>
            <Route path="/" element={<StaffDashboardIndex />} />
            <Route path="/bookings" element={<StaffBookings />} />
            <Route path="/manual-booking" element={<StaffManualBooking />} />
            <Route path="/schedule" element={<StaffSchedule />} />
            <Route path="/payments" element={<StaffPayments />} />
            <Route path="/profile" element={<StaffProfile />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

{/* 1. Staff Dashboard Index */}
function StaffDashboardIndex() {
  const [todayBookings, setTodayBookings] = useState<any[]>(staffDataCache.bookings || []);
  const [activeTab, setActiveTab] = useState<'all' | 'confirmed' | 'checked_in' | 'completed'>('all');
  const token = localStorage.getItem('token');

  const fetchStaffData = () => {
    fetch('http://localhost:5000/api/bookings/admin/all', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        const list = data.data || [];
        staffDataCache.bookings = list;
        setTodayBookings(list);
      })
      .catch(() => {});
  };

  useEffect(() => fetchStaffData(), [token]);

  const handleCheckIn = async (bookingId: string) => {
    await fetch(`http://localhost:5000/api/bookings/admin/${bookingId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status: 'checked_in' })
    });
    fetchStaffData();
  };

  const handleComplete = async (bookingId: string) => {
    await fetch(`http://localhost:5000/api/bookings/admin/${bookingId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status: 'completed' })
    });
    fetchStaffData();
  };

  const nextBooking = todayBookings.find(b => b.status === 'confirmed' || b.status === 'checked_in');

  const filteredBookings = todayBookings.filter(b => {
    if (activeTab === 'all') return true;
    return b.status === activeTab;
  });

  return (
    <div className="space-y-6">
      {/* Single Page Control Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Ringkasan</h1>
        <div className="flex items-center gap-2">
          <Button asChild className="bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs h-9 px-4 rounded-lg transition-colors">
            <Link to="/staff/manual-booking">
              <PlusCircle className="w-4 h-4 mr-1.5" /> Booking Manual
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-neutral-300 text-neutral-700 hover:bg-neutral-50 font-semibold text-xs h-9 px-4 rounded-lg transition-colors">
            <Link to="/staff/schedule">
              <Clock className="w-4 h-4 mr-1.5" /> Jadwal Slot
            </Link>
          </Button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-neutral-200 bg-white rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Total Booking</span>
            <Calendar className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="text-2xl font-extrabold text-neutral-900 mt-2 tracking-tight">{todayBookings.length}</div>
        </Card>

        <Card className="border border-amber-200 bg-amber-50/40 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">Menunggu Check-in</span>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">Perlu Aksi</span>
          </div>
          <div className="text-2xl font-extrabold text-amber-900 mt-2 tracking-tight">
            {todayBookings.filter(b => b.status === 'confirmed').length}
          </div>
        </Card>

        <Card className="border border-sky-200 bg-sky-50/40 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-sky-800 uppercase tracking-wider">Sedang Bermain</span>
            <span className="text-[10px] font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded">Aktif</span>
          </div>
          <div className="text-2xl font-extrabold text-sky-900 mt-2 tracking-tight">
            {todayBookings.filter(b => b.status === 'checked_in').length}
          </div>
        </Card>

        <Card className="border border-neutral-200 bg-white rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Selesai Bermain</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-neutral-900 mt-2 tracking-tight">
            {todayBookings.filter(b => b.status === 'completed').length}
          </div>
        </Card>
      </div>

      {/* Next Booking Queue Banner */}
      {nextBooking && (
        <Card className="border border-brand-300 bg-brand-50/40 rounded-xl">
          <CardContent className="p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-800 bg-brand-100 px-2.5 py-0.5 rounded border border-brand-200">
                  Antrean Berikutnya
                </span>
                <span className="text-xs font-mono text-neutral-500 font-semibold">{nextBooking.bookingCode}</span>
              </div>
              <h3 className="text-base font-bold text-neutral-900 mt-1">
                {nextBooking.user?.name || 'Walk-In Customer'} — <span className="text-brand-700">{nextBooking.court?.name}</span>
              </h3>
              <p className="text-xs text-neutral-600">
                Pukul: <strong>{nextBooking.startTime} - {nextBooking.endTime} WIB</strong> • Kontak: {nextBooking.user?.phone || '-'}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {nextBooking.status === 'confirmed' && (
                <Button onClick={() => handleCheckIn(nextBooking.id)} className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold h-9 px-4 rounded-lg">
                  <CheckCircle className="w-4 h-4 mr-1.5" /> Check-in Sekarang
                </Button>
              )}
              {nextBooking.status === 'checked_in' && (
                <Button onClick={() => handleComplete(nextBooking.id)} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold h-9 px-4 rounded-lg">
                  <Clock className="w-4 h-4 mr-1.5" /> Tandai Selesai
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Today Bookings Table with Filter Tabs */}
      <Card className="border border-neutral-200 bg-white rounded-xl overflow-hidden">
        <CardHeader className="p-4 border-b border-neutral-200 bg-white flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-sm font-bold text-neutral-900">Jadwal Pemesanan Hari Ini</CardTitle>
            <p className="text-xs text-neutral-500 mt-0.5">Daftar lengkap reservasi pemain dan aksi kasir.</p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-lg border border-neutral-200 text-xs">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${
                activeTab === 'all' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Semua ({todayBookings.length})
            </button>
            <button
              onClick={() => setActiveTab('confirmed')}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${
                activeTab === 'confirmed' ? 'bg-white text-amber-700 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Check-in ({todayBookings.filter(b => b.status === 'confirmed').length})
            </button>
            <button
              onClick={() => setActiveTab('checked_in')}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${
                activeTab === 'checked_in' ? 'bg-white text-sky-700 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Bermain ({todayBookings.filter(b => b.status === 'checked_in').length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${
                activeTab === 'completed' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Selesai ({todayBookings.filter(b => b.status === 'completed').length})
            </button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-neutral-50 text-neutral-600 font-semibold border-b border-neutral-200">
                <tr>
                  <th className="p-3.5">Kode</th>
                  <th className="p-3.5">Nama Customer</th>
                  <th className="p-3.5">Lapangan</th>
                  <th className="p-3.5">Jam Bermain</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Aksi Kasir</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {filteredBookings.map(b => (
                  <tr key={b.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-brand-600">{b.bookingCode}</td>
                    <td className="p-3.5">
                      <div className="font-semibold text-neutral-900">{b.user?.name || 'Customer'}</div>
                      <div className="text-[10px] text-neutral-500">{b.user?.phone || '-'}</div>
                    </td>
                    <td className="p-3.5 font-medium text-neutral-800">{b.court?.name}</td>
                    <td className="p-3.5 text-neutral-700 font-medium">{b.startTime} - {b.endTime} WIB</td>
                    <td className="p-3.5">
                      <Badge variant={
                        b.status === 'confirmed' ? 'success' :
                        b.status === 'checked_in' ? 'info' :
                        b.status === 'completed' ? 'secondary' : 'warning'
                      }>
                        {b.status === 'confirmed' ? 'Confirmed' :
                         b.status === 'checked_in' ? 'Checked-in' :
                         b.status === 'completed' ? 'Done' : 'Pending'}
                      </Badge>
                    </td>
                    <td className="p-3.5 text-right space-x-1">
                      {b.status === 'confirmed' && (
                        <Button size="sm" onClick={() => handleCheckIn(b.id)} className="bg-brand-600 hover:bg-brand-700 text-white text-[11px] h-7 px-3 rounded-lg">
                          Check-in
                        </Button>
                      )}
                      {b.status === 'checked_in' && (
                        <Button size="sm" onClick={() => handleComplete(b.id)} className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] h-7 px-3 rounded-lg">
                          Selesai
                        </Button>
                      )}
                      {b.status === 'completed' && (
                        <span className="text-[11px] text-neutral-400 font-medium px-2">—</span>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredBookings.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-neutral-400 font-medium">
                      Tidak ada data reservasi pada kategori ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

{/* 2. Staff Bookings List */}
function StaffBookings() {
  const [bookings, setBookings] = useState<any[]>(staffDataCache.bookings || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const token = localStorage.getItem('token');

  const fetchBookings = () => {
    fetch('http://localhost:5000/api/bookings/admin/all', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        const list = data.data || [];
        staffDataCache.bookings = list;
        setBookings(list);
      })
      .catch(() => {});
  };

  useEffect(() => fetchBookings(), [token]);

  const handleUpdateStatus = async (id: string, status: string) => {
    await fetch(`http://localhost:5000/api/bookings/admin/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status })
    });
    fetchBookings();
  };

  const filtered = bookings.filter(b => {
    const matchSearch = b.bookingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-1">
        <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Reservasi</h1>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Cari kode / nama..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
              className="w-full pl-9 pr-3 py-1.5 border border-neutral-300 rounded-lg text-xs bg-white font-medium focus:outline-none focus:border-brand-600"
            />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-1.5 border border-neutral-300 rounded-lg text-xs bg-white font-medium text-neutral-800">
            <option value="all">Semua Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="checked_in">Checked In</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <Card className="border border-neutral-200 bg-white shadow-xs rounded-xl">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-neutral-50 text-neutral-600 font-semibold border-b border-neutral-200">
                <tr>
                  <th className="p-3.5">Kode</th>
                  <th className="p-3.5">Customer</th>
                  <th className="p-3.5">Lapangan</th>
                  <th className="p-3.5">Tanggal & Jam</th>
                  <th className="p-3.5">Total</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filtered.map(b => (
                  <tr key={b.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-neutral-900">{b.bookingCode}</td>
                    <td className="p-3.5 font-medium text-neutral-900">{b.user?.name}</td>
                    <td className="p-3.5 text-neutral-700">{b.court?.name}</td>
                    <td className="p-3.5 text-neutral-600">
                      {new Date(b.bookingDate).toLocaleDateString()}<br/>
                      <span className="font-semibold">{b.startTime} - {b.endTime} WIB</span>
                    </td>
                    <td className="p-3.5 font-semibold text-neutral-900">{formatCurrency(b.total)}</td>
                    <td className="p-3.5">
                      <Badge variant={
                        b.status === 'confirmed' ? 'success' :
                        b.status === 'checked_in' ? 'info' :
                        b.status === 'completed' ? 'secondary' : 'warning'
                      }>
                        {b.status}
                      </Badge>
                    </td>
                    <td className="p-3.5 text-right space-x-1">
                      {b.status === 'confirmed' && (
                        <Button size="sm" onClick={() => handleUpdateStatus(b.id, 'checked_in')} className="bg-brand-600 hover:bg-brand-700 text-white text-[11px] h-7 px-2.5 rounded-lg">
                          Check-in
                        </Button>
                      )}
                      {b.status === 'checked_in' && (
                        <Button size="sm" onClick={() => handleUpdateStatus(b.id, 'completed')} className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] h-7 px-2.5 rounded-lg">
                          Selesai
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="p-8 text-center text-neutral-400">Tidak ada pemesanan ditemukan.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

{/* 3. Staff Manual Booking */}
function StaffManualBooking() {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [courtId, setCourtId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('09:00');
  const [duration, setDuration] = useState('1');
  const [courts, setCourts] = useState<any[]>(staffDataCache.courts || []);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/courts')
      .then(res => res.json())
      .then(data => {
        const list = data.data || [];
        staffDataCache.courts = list;
        setCourts(list);
        if (list.length > 0 && !courtId) setCourtId(list[0].id);
      })
      .catch(() => {});
  }, []);

  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/bookings/admin/manual', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          customerName,
          customerPhone,
          courtId,
          date,
          startTime,
          duration
        })
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`Reservasi manual walk-in berhasil dibuat! Kode: ${data.data?.bookingCode || 'WALK-SUCCESS'}`);
        setCustomerName('');
        setCustomerPhone('');
        setTimeout(() => setSuccessMsg(''), 6000);
      } else {
        alert(data.message || 'Gagal membuat manual booking');
      }
    } catch (err) {
      alert('Terjadi kesalahan jaringan/server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div className="pb-1">
        <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Booking Manual</h1>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-lg">
          ✓ {successMsg}
        </div>
      )}

      <Card className="border border-neutral-200 bg-white shadow-xs rounded-xl">
        <CardContent className="p-5 space-y-4 text-xs">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block font-medium text-neutral-700 mb-1">Nama Customer Walk-In</label>
              <input type="text" required value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Contoh: Budi Santoso" className="w-full p-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-brand-600" />
            </div>

            <div>
              <label className="block font-medium text-neutral-700 mb-1">Nomor Telepon / WhatsApp</label>
              <input type="text" required value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} placeholder="08123456789" className="w-full p-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-brand-600" />
            </div>

            <div>
              <label className="block font-medium text-neutral-700 mb-1">Pilih Lapangan</label>
              <select value={courtId} onChange={e => setCourtId(e.target.value)} className="w-full p-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-brand-600">
                {courts.map(c => <option key={c.id} value={c.id}>{c.name} ({c.indoor ? 'Indoor' : 'Outdoor'})</option>)}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Tanggal</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-brand-600" />
              </div>
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Jam Mulai</label>
                <select value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full p-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-brand-600">
                  {['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'].map(t => (
                    <option key={t} value={t}>{t} WIB</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Durasi (Jam)</label>
                <select value={duration} onChange={e => setDuration(e.target.value)} className="w-full p-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-brand-600">
                  <option value="1">1 Jam</option>
                  <option value="2">2 Jam</option>
                  <option value="3">3 Jam</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-100 flex justify-between items-center">
              <div>
                <span className="text-neutral-500">Est. Total Tarif:</span>
                <div className="text-base font-bold text-neutral-900">{formatCurrency(150000 * Number(duration))}</div>
              </div>
              <Button type="submit" disabled={loading} className="bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs h-10 px-5 rounded-lg disabled:opacity-50">
                {loading ? 'Memproses...' : 'Konfirmasi Manual Booking'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

{/* 4. Staff Schedule Calendar Timetable Matrix (Styleguide Compliant) */}
function StaffSchedule() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [courts, setCourts] = useState<any[]>(staffDataCache.courts || []);
  const [bookings, setBookings] = useState<any[]>(staffDataCache.bookings || []);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [selectedEmptySlot, setSelectedEmptySlot] = useState<{ courtName: string; courtId: string; time: string } | null>(null);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const loadScheduleData = () => {
    fetch('http://localhost:5000/api/courts')
      .then(res => res.json())
      .then(data => {
        const courtList = data.data || [];
        staffDataCache.courts = courtList;
        setCourts(courtList);
      })
      .catch(() => {});

    fetch('http://localhost:5000/api/bookings/admin/all', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        const bookingList = data.data || [];
        staffDataCache.bookings = bookingList;
        setBookings(bookingList);
      })
      .catch(() => {});
  };

  useEffect(() => loadScheduleData(), [token, selectedDate]);

  const changeDate = (days: number) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + days);
    setSelectedDate(current.toISOString().split('T')[0]);
  };

  const setToday = () => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  const handleCheckIn = async (bookingId: string) => {
    await fetch(`http://localhost:5000/api/bookings/admin/${bookingId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status: 'checked_in' })
    });
    setSelectedBooking(null);
    loadScheduleData();
  };

  const handleComplete = async (bookingId: string) => {
    await fetch(`http://localhost:5000/api/bookings/admin/${bookingId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status: 'completed' })
    });
    setSelectedBooking(null);
    loadScheduleData();
  };

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
  ];

  const dateFormatted = new Date(selectedDate).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Memoize filtered bookings for selectedDate to prevent CPU lag on every scroll render
  const dayBookings = useMemo(() => {
    return bookings.filter(b => {
      if (b.status === 'cancelled') return false;
      const bDate = b.bookingDate ? String(b.bookingDate).split('T')[0] : '';
      return !bDate || bDate === selectedDate;
    });
  }, [bookings, selectedDate]);

  // Create O(1) instant lookup map for start times
  const startBookingMap = useMemo(() => {
    const map: Record<string, any> = {};
    dayBookings.forEach(b => {
      map[`${b.courtId}_${b.startTime}`] = b;
    });
    return map;
  }, [dayBookings]);

  const [viewMode, setViewMode] = useState<'vertical' | 'horizontal'>('vertical');

  return (
    <div className="space-y-6">
      {/* Calendar Control Header Bar */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-neutral-900">Jadwal Lapangan</h2>
          <p className="text-xs text-brand-600 font-semibold mt-0.5">{dateFormatted}</p>
        </div>

        {/* Date Navigator & View Mode Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center rounded-lg border border-neutral-200 bg-neutral-100 p-0.5 text-xs font-semibold">
            <button 
              onClick={() => setViewMode('vertical')} 
              className={`px-3 py-1 rounded transition-colors ${viewMode === 'vertical' ? 'bg-white text-brand-700 shadow-2xs font-bold' : 'text-neutral-600 hover:text-neutral-900'}`}
            >
              Vertikal (Kebawah)
            </button>
            <button 
              onClick={() => setViewMode('horizontal')} 
              className={`px-3 py-1 rounded transition-colors ${viewMode === 'horizontal' ? 'bg-white text-brand-700 shadow-2xs font-bold' : 'text-neutral-600 hover:text-neutral-900'}`}
            >
              Horizontal
            </button>
          </div>

          <div className="flex items-center rounded-lg border border-neutral-300 bg-neutral-50 p-0.5">
            <button onClick={() => changeDate(-1)} className="px-2.5 py-1 text-xs font-bold text-neutral-700 hover:bg-white rounded transition-colors">
              ‹ Prev
            </button>
            <button onClick={setToday} className="px-3 py-1 text-xs font-bold text-brand-700 hover:bg-white rounded transition-colors">
              Hari Ini
            </button>
            <button onClick={() => changeDate(1)} className="px-2.5 py-1 text-xs font-bold text-neutral-700 hover:bg-white rounded transition-colors">
              Next ›
            </button>
          </div>

          <input 
            type="date" 
            value={selectedDate} 
            onChange={e => setSelectedDate(e.target.value)} 
            className="px-3 py-1.5 border border-neutral-300 rounded-lg text-xs bg-white focus:outline-none focus:border-brand-600 font-medium" 
          />
        </div>
      </div>

      {viewMode === 'vertical' ? (
        /* Vertical Agenda Grid Layout (Vertikal Kebawah) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {courts.map(court => {
            let skipCount = 0;

            return (
              <Card key={court.id} className="border border-neutral-200 bg-white shadow-xs rounded-xl overflow-hidden flex flex-col">
                <CardHeader className="bg-neutral-100/90 border-b border-neutral-200 py-3 px-4 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xs font-bold text-neutral-900">{court.name}</CardTitle>
                    <p className="text-[10px] text-neutral-500 font-medium">{court.indoor ? 'Indoor Court' : 'Outdoor Court'}</p>
                  </div>
                  <span className="text-[10px] font-bold bg-brand-50 text-brand-700 px-2 py-0.5 rounded border border-brand-200">
                    {court.indoor ? 'INDOOR' : 'OUTDOOR'}
                  </span>
                </CardHeader>

                <CardContent className="p-3 space-y-2 flex-1">
                  {timeSlots.map((time, idx) => {
                    if (skipCount > 0) {
                      skipCount--;
                      return null;
                    }

                    const startingBooking = startBookingMap[`${court.id}_${time}`];
                    const ongoingBooking = !startingBooking ? dayBookings.find(b => 
                      b.courtId === court.id && b.startTime <= time && b.endTime > time
                    ) : null;

                    const booking = startingBooking || ongoingBooking;

                    if (booking) {
                      const parseHour = (t: string) => parseInt(t.split(':')[0], 10);
                      const startH = startingBooking ? parseHour(time) : parseHour(booking.startTime);
                      const endH = parseHour(booking.endTime);
                      const totalDurationHours = endH - startH;

                      const currentHour = parseHour(time);
                      const spanHours = Math.max(1, Math.min(endH - currentHour, timeSlots.length - idx));
                      skipCount = spanHours - 1;

                      return (
                        <div 
                          key={time}
                          onClick={() => setSelectedBooking(booking)}
                          className={`p-3 rounded-lg border text-left cursor-pointer transition-colors shadow-2xs flex flex-col justify-between gap-1.5 ${
                            booking.status === 'confirmed'
                              ? 'bg-brand-50/90 border-brand-300 hover:bg-brand-100/90'
                              : booking.status === 'checked_in'
                              ? 'bg-sky-50/90 border-sky-300 hover:bg-sky-100/90'
                              : booking.status === 'completed'
                              ? 'bg-neutral-100 border-neutral-300 hover:bg-neutral-200/90'
                              : 'bg-amber-50/90 border-amber-300 hover:bg-amber-100/90'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <Clock className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                              <span className="font-mono text-xs font-bold text-neutral-900 truncate">
                                {booking.startTime} - {booking.endTime} ({totalDurationHours} Jam)
                              </span>
                            </div>
                            <Badge variant={
                              booking.status === 'confirmed' ? 'success' :
                              booking.status === 'checked_in' ? 'info' :
                              booking.status === 'completed' ? 'secondary' : 'warning'
                            } className="px-1.5 py-0.5 text-[9px] shrink-0">
                              {booking.status === 'confirmed' ? 'Confirmed' :
                               booking.status === 'checked_in' ? 'Checked-in' :
                               booking.status === 'completed' ? 'Done' : 'Pending'}
                            </Badge>
                          </div>

                          <div className="flex items-center justify-between text-xs pt-1 border-t border-neutral-200/50">
                            <span className="font-bold text-neutral-900 truncate">{booking.user?.name || 'Customer'}</span>
                            <span className="font-mono text-[10px] text-neutral-500">{booking.bookingCode}</span>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div key={time} className="flex items-center justify-between p-2 rounded-lg border border-dashed border-neutral-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition-colors text-xs">
                        <span className="font-mono font-medium text-neutral-600 text-[11px]">{time} WIB</span>
                        <button 
                          onClick={() => setSelectedEmptySlot({ courtName: court.name, courtId: court.id, time })}
                          className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1"
                        >
                          <span>+</span> Kosong
                        </button>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        /* Horizontal Timetable Timeline Matrix */
        <div className="flex border border-neutral-200 bg-white shadow-xs rounded-xl overflow-hidden text-xs">
          <div className="w-44 flex-shrink-0 border-r border-neutral-200 bg-neutral-50/70 z-10">
            <div className="h-12 px-3 font-bold uppercase tracking-wider text-[11px] text-neutral-700 border-b border-neutral-200 flex items-center bg-neutral-100/90">
              Lapangan / Court
            </div>
            {courts.map(court => (
              <div key={court.id} className="h-20 p-3 flex flex-col justify-center border-b border-neutral-200 last:border-b-0 bg-white">
                <div className="text-xs font-bold text-neutral-900 truncate">{court.name}</div>
                <span className="text-[10px] font-semibold text-neutral-500">
                  {court.indoor ? 'Indoor' : 'Outdoor'}
                </span>
              </div>
            ))}
          </div>

          <div className="flex-1 overflow-x-auto contain-paint scroll-smooth">
            <div className="min-w-[1540px]">
              <div className="flex h-12 border-b border-neutral-200 bg-neutral-100/90">
                {timeSlots.map(time => (
                  <div key={time} className="w-28 flex-shrink-0 p-2.5 text-center border-r border-neutral-200 font-mono font-bold text-neutral-800 flex items-center justify-center">
                    {time} WIB
                  </div>
                ))}
              </div>

              {courts.map(court => {
                let skipCount = 0;

                return (
                  <div key={court.id} className="flex h-20 border-b border-neutral-200 last:border-b-0 hover:bg-neutral-50/40 transition-colors">
                    {timeSlots.map((time, idx) => {
                      if (skipCount > 0) {
                        skipCount--;
                        return null;
                      }

                      const startingBooking = startBookingMap[`${court.id}_${time}`];
                      const ongoingBooking = !startingBooking ? dayBookings.find(b => 
                        b.courtId === court.id && b.startTime <= time && b.endTime > time
                      ) : null;

                      const booking = startingBooking || ongoingBooking;

                      if (booking) {
                        const parseHour = (t: string) => parseInt(t.split(':')[0], 10);
                        const startH = startingBooking ? parseHour(time) : parseHour(booking.startTime);
                        const endH = parseHour(booking.endTime);
                        const totalDurationHours = endH - startH;

                        const currentHour = parseHour(time);
                        const spanHours = Math.max(1, Math.min(endH - currentHour, timeSlots.length - idx));
                        skipCount = spanHours - 1;

                        const widthPx = spanHours * 112;

                        return (
                          <div 
                            key={time} 
                            style={{ width: `${widthPx}px` }} 
                            className="flex-shrink-0 p-1.5 border-r border-neutral-200 h-full"
                          >
                            <div 
                              onClick={() => setSelectedBooking(booking)}
                              className={`p-2 rounded-lg border text-left cursor-pointer transition-colors shadow-2xs h-full flex flex-col justify-between ${
                                booking.status === 'confirmed'
                                  ? 'bg-brand-50 border-brand-300 hover:bg-brand-100/80'
                                  : booking.status === 'checked_in'
                                  ? 'bg-sky-50 border-sky-300 hover:bg-sky-100/80'
                                  : booking.status === 'completed'
                                  ? 'bg-neutral-100 border-neutral-300 hover:bg-neutral-200/80'
                                  : 'bg-amber-50 border-amber-300 hover:bg-amber-100/80'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-1">
                                <div className="font-bold text-neutral-900 text-xs truncate">
                                  {booking.user?.name || 'Customer'}
                                </div>
                                <Badge variant={
                                  booking.status === 'confirmed' ? 'success' :
                                  booking.status === 'checked_in' ? 'info' :
                                  booking.status === 'completed' ? 'secondary' : 'warning'
                                } className="px-1.5 py-0.5 text-[9px] shrink-0">
                                  {booking.status === 'confirmed' ? 'Confirmed' :
                                   booking.status === 'checked_in' ? 'Checked-in' :
                                   booking.status === 'completed' ? 'Done' : 'Pending'}
                                </Badge>
                              </div>

                              <div className="flex items-center justify-between text-[10px] text-neutral-600 font-mono mt-1">
                                <span>{booking.bookingCode}</span>
                                <span className="font-sans font-medium text-brand-700 bg-white/80 px-1.5 py-0.5 rounded border border-neutral-200/80">
                                  {booking.startTime} - {booking.endTime} ({totalDurationHours} Jam)
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div key={time} className="w-28 flex-shrink-0 p-1.5 border-r border-neutral-200 h-full">
                          <button 
                            onClick={() => setSelectedEmptySlot({ courtName: court.name, courtId: court.id, time })}
                            className="w-full h-full rounded-lg border border-dashed border-neutral-300 hover:border-emerald-500 hover:bg-emerald-50/50 flex items-center justify-center text-neutral-400 hover:text-emerald-700 transition-colors text-[11px] font-medium"
                          >
                            <span>+</span> Kosong
                          </button>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Modal Detail Booking Slot Jam */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md bg-white border border-neutral-200 shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="bg-brand-600 text-white p-4 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold">Detail Pemesan Slot Kalender</CardTitle>
                <p className="text-[11px] text-brand-100 mt-0.5">Kode: {selectedBooking.bookingCode}</p>
              </div>
              <button onClick={() => setSelectedBooking(null)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </CardHeader>
            <CardContent className="p-5 space-y-4 text-xs">
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Nama Pelanggan:</span>
                  <strong className="text-neutral-900">{selectedBooking.user?.name || 'Walk-In Customer'}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Kontak WhatsApp:</span>
                  <strong className="text-neutral-900">{selectedBooking.user?.phone || '0812-3456-7890'}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Lapangan:</span>
                  <strong className="text-brand-700">{selectedBooking.court?.name}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Waktu Bermain:</span>
                  <strong className="text-neutral-900">{selectedBooking.startTime} - {selectedBooking.endTime} WIB</strong>
                </div>
                <div className="flex justify-between border-t border-neutral-200 pt-2">
                  <span className="text-neutral-500">Total Pembayaran:</span>
                  <strong className="text-neutral-900 font-mono">{formatCurrency(selectedBooking.total)}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Status Reservasi:</span>
                  <Badge variant={selectedBooking.status === 'confirmed' ? 'success' : 'info'}>
                    {selectedBooking.status}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                {selectedBooking.status === 'confirmed' && (
                  <Button 
                    onClick={() => handleCheckIn(selectedBooking.id)} 
                    className="flex-1 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs h-10 rounded-lg"
                  >
                    <CheckCircle className="w-4 h-4 mr-1.5" /> Proses Check-in
                  </Button>
                )}
                {selectedBooking.status === 'checked_in' && (
                  <Button 
                    onClick={() => handleComplete(selectedBooking.id)} 
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-10 rounded-lg"
                  >
                    <Clock className="w-4 h-4 mr-1.5" /> Tandai Selesai
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedBooking(null)} 
                  className="px-4 border-neutral-300 text-xs h-10 rounded-lg"
                >
                  Tutup
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal Slot Kosong */}
      {selectedEmptySlot && (
        <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-sm bg-white border border-neutral-200 shadow-xl rounded-2xl p-5 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900">Slot Jam Tersedia</h3>
              <p className="text-xs text-neutral-500 mt-1">
                {selectedEmptySlot.courtName} • Pukul <strong>{selectedEmptySlot.time} WIB</strong>
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <Button 
                onClick={() => {
                  setSelectedEmptySlot(null);
                  navigate('/staff/manual-booking');
                }} 
                className="flex-1 bg-brand-600 hover:bg-brand-700 text-white text-xs h-9 rounded-lg"
              >
                Buat Walk-in Booking
              </Button>
              <Button variant="outline" onClick={() => setSelectedEmptySlot(null)} className="text-xs h-9 rounded-lg">
                Tutup
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

{/* 5. Staff Payment Verification */}
function StaffPayments() {
  const [payments, setPayments] = useState<any[]>([]);
  const token = localStorage.getItem('token');

  const fetchPayments = () => {
    fetch('http://localhost:5000/api/payments/admin/pending', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setPayments(data.data || []))
      .catch(() => {});
  };

  useEffect(() => fetchPayments(), [token]);

  const handleVerify = async (id: string, action: 'approve' | 'reject') => {
    await fetch(`http://localhost:5000/api/payments/admin/verify/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ action, reason: action === 'reject' ? 'Bukti transfer tidak terbaca' : undefined })
    });
    fetchPayments();
  };

  return (
    <div className="space-y-6">
      <div className="pb-1">
        <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Pembayaran</h1>
      </div>

      <Card className="border border-neutral-200 bg-white shadow-xs rounded-xl">
        <CardContent className="p-0">
          <table className="w-full text-xs text-left">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-semibold">
              <tr>
                <th className="p-3.5">Kode Booking</th>
                <th className="p-3.5">Nominal</th>
                <th className="p-3.5">Bukti Transfer</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Aksi Verifikasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {payments.map(p => (
                <tr key={p.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-neutral-900">{p.booking?.bookingCode}</td>
                  <td className="p-3.5 font-semibold text-neutral-900">{formatCurrency(p.amount)}</td>
                  <td className="p-3.5">
                    {p.proofUrl ? (
                      <a href={p.proofUrl} target="_blank" rel="noreferrer" className="text-brand-600 font-semibold hover:underline">Lihat Bukti</a>
                    ) : <span className="text-neutral-400">Tidak ada</span>}
                  </td>
                  <td className="p-3.5"><Badge variant="warning">{p.status}</Badge></td>
                  <td className="p-3.5 text-right space-x-2">
                    <Button size="sm" onClick={() => handleVerify(p.id, 'approve')} className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] h-7 px-2.5 rounded-lg">
                      <CheckCircle className="w-3.5 h-3.5 mr-1" /> Approve
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleVerify(p.id, 'reject')} className="text-red-600 border-red-200 hover:bg-red-50 text-[11px] h-7 px-2.5 rounded-lg">
                      <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                    </Button>
                  </td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr><td colSpan={5} className="p-8 text-center text-neutral-400">Tidak ada bukti pembayaran menunggu verifikasi.</td></tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

{/* 6. Staff Profile */}
function StaffProfile() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-md">
      <div className="pb-1">
        <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Profil Staf</h1>
      </div>

      <Card className="border border-neutral-200 bg-white shadow-xs rounded-xl">
        <CardContent className="p-5 space-y-3 text-xs">
          <div>
            <span className="text-neutral-500">Nama Petugas:</span>
            <p className="text-sm font-bold text-neutral-900 mt-0.5">{user?.name || 'Staff On-Duty'}</p>
          </div>
          <div>
            <span className="text-neutral-500">Email Login:</span>
            <p className="font-semibold text-neutral-800 mt-0.5">{user?.email || 'staff@padel.com'}</p>
          </div>
          <div>
            <span className="text-neutral-500">Role Akses:</span>
            <div className="mt-1"><Badge variant="info">Staff Operasional</Badge></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
