import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { formatCurrency } from '../lib/utils';
import { 
  LayoutDashboard, 
  Calendar, 
  Shield, 
  Clock, 
  DollarSign, 
  Users, 
  UserCheck, 
  CreditCard, 
  BarChart3, 
  Settings as SettingsIcon,
  LogOut,
  ExternalLink,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  FileSpreadsheet,
  Loader2,
  Search
} from 'lucide-react';

// In-memory data cache for instant menu switching without repeated loading screens
const adminDataCache = new Map<string, any>();

export const LoadingSkeleton = ({ label = "Memuat data..." }: { label?: string }) => (
  <div className="p-8 text-center flex flex-col items-center justify-center gap-2.5 text-neutral-400 py-16 animate-pulse">
    <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
    <span className="text-xs font-semibold text-neutral-500">{label}</span>
  </div>
);

export const renderStatusBadge = (status: string) => {
  switch (status) {
    case 'confirmed':
      return <Badge variant="success">Confirmed</Badge>;
    case 'checked_in':
      return <Badge variant="info">Checked In</Badge>;
    case 'completed':
      return <Badge variant="secondary">Completed</Badge>;
    case 'waiting_payment':
      return <Badge variant="warning">Waiting Payment</Badge>;
    case 'cancelled':
      return <Badge variant="destructive">Cancelled</Badge>;
    case 'active':
      return <Badge variant="success">Active</Badge>;
    case 'maintenance':
      return <Badge variant="warning">Maintenance</Badge>;
    case 'inactive':
      return <Badge variant="secondary">Inactive</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!token || user.role !== 'admin') {
      navigate('/login');
    }
  }, [token, user, navigate]);

  if (!token || user.role !== 'admin') return null;

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/bookings')) return 'Reservasi';
    if (path.includes('/courts')) return 'Lapangan';
    if (path.includes('/schedules')) return 'Jadwal';
    if (path.includes('/pricing')) return 'Tarif';
    if (path.includes('/customers')) return 'Pelanggan';
    if (path.includes('/staff')) return 'Staf';
    if (path.includes('/payments')) return 'Pembayaran';
    if (path.includes('/reports')) return 'Laporan';
    if (path.includes('/settings')) return 'Pengaturan';
    return 'Dashboard';
  };

  const NavItem = ({ to, label, icon: Icon }: { to: string; label: string; icon: any }) => {
    const isActive = location.pathname === to || (to !== '/admin' && location.pathname.startsWith(to));
    return (
      <Link 
        to={to} 
        className={`flex items-center gap-3 px-3.5 py-2.5 text-xs font-medium rounded-lg transition-colors ${
          isActive 
            ? 'bg-white text-brand-700 font-semibold border border-neutral-200 shadow-2xs' 
            : 'text-neutral-600 hover:bg-neutral-200/60 hover:text-neutral-900'
        }`}
      >
        <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-brand-600' : 'text-neutral-400'}`} />
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <div className="fixed inset-0 bg-neutral-50 flex flex-col md:flex-row overflow-hidden z-30 font-sans">
      {/* Sidebar Navigation (Admin Flow Section 3 - Pinned Fixed Sidebar) */}
      <aside className="w-full md:w-64 h-full bg-neutral-50 border-r border-neutral-200 flex-shrink-0 flex flex-col justify-between p-4 overflow-y-auto">
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2 pt-2">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 bg-brand-600 text-white rounded-lg flex items-center justify-center font-semibold text-xs">P</span>
              <span className="font-semibold text-sm tracking-tight text-neutral-900">PADEL ADMIN</span>
            </div>
            <span className="text-[10px] font-medium bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded border border-neutral-200">
              v1.0
            </span>
          </div>

          <nav className="space-y-4">
            <div>
              <div className="px-3 text-[10px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">Utama</div>
              <div className="space-y-0.5">
                <NavItem to="/admin" label="Dashboard" icon={LayoutDashboard} />
                <NavItem to="/admin/bookings" label="Reservasi" icon={Calendar} />
              </div>
            </div>

            <div>
              <div className="px-3 text-[10px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">Venue</div>
              <div className="space-y-0.5">
                <NavItem to="/admin/courts" label="Lapangan" icon={Shield} />
                <NavItem to="/admin/schedules" label="Jadwal" icon={Clock} />
                <NavItem to="/admin/pricing" label="Tarif" icon={DollarSign} />
              </div>
            </div>

            <div>
              <div className="px-3 text-[10px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">Pengguna</div>
              <div className="space-y-0.5">
                <NavItem to="/admin/customers" label="Pelanggan" icon={Users} />
                <NavItem to="/admin/staff" label="Staf" icon={UserCheck} />
              </div>
            </div>

            <div>
              <div className="px-3 text-[10px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">Keuangan</div>
              <div className="space-y-0.5">
                <NavItem to="/admin/payments" label="Pembayaran" icon={CreditCard} />
                <NavItem to="/admin/reports" label="Laporan" icon={BarChart3} />
              </div>
            </div>

            <div>
              <div className="px-3 text-[10px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">Pengaturan</div>
              <div className="space-y-0.5">
                <NavItem to="/admin/settings" label="Pengaturan" icon={SettingsIcon} />
              </div>
            </div>
          </nav>
        </div>

        {/* Sidebar Footer Actions */}
        <div className="pt-4 border-t border-neutral-200 space-y-2">
          <Link 
            to="/" 
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-neutral-600 hover:text-brand-600 hover:bg-neutral-50 rounded-lg transition-colors"
          >
            <ExternalLink className="w-4 h-4" /> Kembali ke Situs Utama
          </Link>
          <button 
            onClick={() => { localStorage.clear(); navigate('/login'); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Keluar
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Topbar Clean Breadcrumb (Styleguide Section 25) */}
        <header className="bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-medium text-neutral-400">Admin</span>
            <span className="text-neutral-300">/</span>
            <h1 className="text-sm font-semibold text-neutral-900">{getPageTitle()}</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-neutral-500 font-medium">Masuk sebagai <strong className="text-neutral-900">{user.name || 'Admin'}</strong></span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
        </header>

        {/* Main Content View */}
        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
          <Routes>
            <Route path="/" element={<DashboardIndex />} />
            <Route path="/bookings" element={<AdminBookings />} />
            <Route path="/courts" element={<AdminCourts />} />
            <Route path="/schedules" element={<AdminSchedules />} />
            <Route path="/pricing" element={<AdminPricing />} />
            <Route path="/customers" element={<AdminCustomers />} />
            <Route path="/staff" element={<AdminStaff />} />
            <Route path="/payments" element={<AdminPayments />} />
            <Route path="/reports" element={<AdminReports />} />
            <Route path="/settings" element={<AdminSettings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

{/* 1. Dashboard Index (Admin Flow Section 4) */}
function DashboardIndex() {
  const cachedStats = adminDataCache.get('admin_stats');
  const cachedBookings = adminDataCache.get('admin_bookings');

  const [stats, setStats] = useState<any>(cachedStats || null);
  const [recentBookings, setRecentBookings] = useState<any[]>(cachedBookings ? cachedBookings.slice(0, 5) : []);
  const [loading, setLoading] = useState(!cachedStats && !cachedBookings);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!cachedStats && !cachedBookings) setLoading(true);
    Promise.all([
      fetch('http://localhost:5000/api/bookings/admin/stats', { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()),
      fetch('http://localhost:5000/api/bookings/admin/all', { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json())
    ]).then(([statsRes, bookingsRes]) => {
      if (statsRes.data) {
        adminDataCache.set('admin_stats', statsRes.data);
        setStats(statsRes.data);
      }
      if (bookingsRes.data) {
        adminDataCache.set('admin_bookings', bookingsRes.data);
        setRecentBookings(bookingsRes.data.slice(0, 5));
      }
    }).catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  if (loading && !stats) {
    return <LoadingSkeleton label="Memuat ringkasan dashboard..." />;
  }

  return (
    <div className="space-y-6">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/admin/reports" className="block">
          <Card className="border border-neutral-200 bg-white rounded-xl p-4 hover:border-brand-500 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Revenue Hari Ini</span>
              <DollarSign className="w-4 h-4 text-neutral-400" />
            </div>
            <div className="text-2xl font-extrabold text-neutral-900 mt-2 tracking-tight">
              {formatCurrency(stats?.totalRevenue || 0)}
            </div>
          </Card>
        </Link>

        <Link to="/admin/bookings" className="block">
          <Card className="border border-neutral-200 bg-white rounded-xl p-4 hover:border-brand-500 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Booking Hari Ini</span>
              <Calendar className="w-4 h-4 text-neutral-400" />
            </div>
            <div className="text-2xl font-extrabold text-neutral-900 mt-2 tracking-tight">
              {stats?.todayBookings || 0} <span className="text-xs font-semibold text-neutral-500 font-sans">Slot</span>
            </div>
          </Card>
        </Link>

        <Link to="/admin/courts" className="block">
          <Card className="border border-neutral-200 bg-white rounded-xl p-4 hover:border-brand-500 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Court Aktif</span>
              <Shield className="w-4 h-4 text-neutral-400" />
            </div>
            <div className="text-2xl font-extrabold text-neutral-900 mt-2 tracking-tight">
              {stats?.activeCourts || 0} <span className="text-xs font-semibold text-neutral-500 font-sans">Court</span>
            </div>
          </Card>
        </Link>

        <Link to="/admin/payments" className="block">
          <Card className="border border-neutral-200 bg-white rounded-xl p-4 hover:border-brand-500 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Pending Payment</span>
              <CreditCard className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-extrabold text-amber-600 mt-2 tracking-tight">
              {stats?.pendingPayments || 0} <span className="text-xs font-semibold text-neutral-500 font-sans">Perlu Verifikasi</span>
            </div>
          </Card>
        </Link>
      </div>

      {/* Recent Bookings Section */}
      <Card className="border border-neutral-200">
        <CardHeader className="flex flex-row items-center justify-between border-b border-neutral-100 pb-4">
          <CardTitle className="text-sm font-bold text-neutral-900">Reservasi Terbaru</CardTitle>
          <Button asChild variant="outline" size="sm" className="text-xs">
            <Link to="/admin/bookings">Lihat Semua</Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-neutral-50 text-neutral-600 font-semibold border-b border-neutral-200">
                <tr>
                  <th className="px-4 py-3">Kode</th>
                  <th className="px-4 py-3">Pelanggan</th>
                  <th className="px-4 py-3">Lapangan</th>
                  <th className="px-4 py-3">Jadwal</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {recentBookings.map(b => (
                  <tr key={b.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3 font-mono font-semibold text-neutral-900">{b.bookingCode}</td>
                    <td className="px-4 py-3 font-medium text-neutral-900">{b.user?.name}</td>
                    <td className="px-4 py-3 text-neutral-600">{b.court?.name}</td>
                    <td className="px-4 py-3 text-neutral-600">{b.startTime} – {b.endTime} WIB</td>
                    <td className="px-4 py-3 font-semibold text-neutral-900">{formatCurrency(b.total)}</td>
                    <td className="px-4 py-3">
                      {renderStatusBadge(b.status)}
                    </td>
                  </tr>
                ))}
                {recentBookings.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-neutral-400">Belum ada reservasi terbaru.</td>
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

{/* 2. Admin Bookings (Admin Flow Section 5) */}
function AdminBookings() {
  const cachedBookings = adminDataCache.get('admin_bookings');
  const [bookings, setBookings] = useState<any[]>(cachedBookings || []);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(!cachedBookings);
  const token = localStorage.getItem('token');

  const fetchBookings = (isSilent = false) => {
    if (!isSilent && !adminDataCache.has('admin_bookings')) setLoading(true);
    fetch('http://localhost:5000/api/bookings/admin/all', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        const list = data.data || [];
        adminDataCache.set('admin_bookings', list);
        setBookings(list);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => fetchBookings(!!cachedBookings), [token]);

  const handleUpdateStatus = async (id: string, status: string) => {
    await fetch(`http://localhost:5000/api/bookings/admin/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status })
    });
    fetchBookings();
  };

  const filtered = bookings.filter(b => {
    const matchesStatus = filterStatus === 'all' || b.status === filterStatus;
    const matchesSearch = b.bookingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Reservasi</h1>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            <input 
              type="text" 
              placeholder="Cari kode / nama..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
              className="w-full h-9 pl-9 pr-3 border border-neutral-300 rounded-lg text-xs bg-white font-medium focus:outline-none focus:border-brand-600 transition-all"
            />
          </div>
          <select 
            value={filterStatus} 
            onChange={e => setFilterStatus(e.target.value)}
            className="h-9 px-3 border border-neutral-300 rounded-lg text-xs bg-white font-medium text-neutral-800 focus:outline-none focus:border-brand-600"
          >
            <option value="all">Semua Status</option>
            <option value="waiting_payment">Waiting Payment</option>
            <option value="confirmed">Confirmed</option>
            <option value="checked_in">Checked In</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <Card className="border border-neutral-200 rounded-xl overflow-hidden bg-white">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-neutral-50/80 text-neutral-500 uppercase tracking-wider text-[11px] font-semibold border-b border-neutral-200/80">
                <tr>
                  <th className="px-4 py-3.5">Kode Booking</th>
                  <th className="px-4 py-3.5">Pelanggan</th>
                  <th className="px-4 py-3.5">Lapangan</th>
                  <th className="px-4 py-3.5">Tanggal & Waktu</th>
                  <th className="px-4 py-3.5">Total Harga</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5 text-right">Aksi Operasional</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-4">
                      <LoadingSkeleton label="Memuat data reservasi..." />
                    </td>
                  </tr>
                ) : (
                  filtered.map(b => (
                    <tr key={b.id} className="hover:bg-neutral-50/60 transition-colors">
                      <td className="px-4 py-3.5">
                        <span className="font-mono font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded text-[11px] border border-brand-200/50">
                          {b.bookingCode}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-neutral-900">{b.user?.name}</div>
                        <div className="text-[11px] text-neutral-400">{b.user?.email}</div>
                      </td>
                      <td className="px-4 py-3.5 text-neutral-700 font-medium">{b.court?.name}</td>
                      <td className="px-4 py-3.5 text-neutral-600">
                        <div className="font-medium text-neutral-900">{new Date(b.bookingDate).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })}</div>
                        <div className="text-[11px] text-neutral-500 font-mono">{b.startTime} – {b.endTime} WIB</div>
                      </td>
                      <td className="px-4 py-3.5 font-bold text-neutral-900">{formatCurrency(b.total)}</td>
                      <td className="px-4 py-3.5">
                        {renderStatusBadge(b.status)}
                      </td>
                      <td className="px-4 py-3.5 text-right space-x-1.5">
                        {b.status === 'confirmed' && (
                          <Button size="sm" onClick={() => handleUpdateStatus(b.id, 'checked_in')} className="bg-brand-600 hover:bg-brand-700 text-white text-[11px] h-7 px-3 rounded-md font-medium">Check-in</Button>
                        )}
                        {b.status === 'checked_in' && (
                          <Button size="sm" onClick={() => handleUpdateStatus(b.id, 'completed')} className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] h-7 px-3 rounded-md font-medium">Selesai</Button>
                        )}
                        {b.status !== 'cancelled' && b.status !== 'completed' && (
                          <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(b.id, 'cancelled')} className="text-red-600 border-red-200 hover:bg-red-50 text-[11px] h-7 px-2.5 rounded-md">Batal</Button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-10 text-center text-neutral-400">Tidak ada reservasi ditemukan.</td>
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

{/* 3. Admin Courts (Admin Flow Section 8) */}
function AdminCourts() {
  const cachedCourts = adminDataCache.get('admin_courts');
  const [courts, setCourts] = useState<any[]>(cachedCourts || []);
  const [loading, setLoading] = useState<boolean>(!cachedCourts);
  const [showModal, setShowModal] = useState(false);
  const [editingCourt, setEditingCourt] = useState<any>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('Standard');
  const [indoor, setIndoor] = useState(true);
  const [capacity, setCapacity] = useState(4);
  const [status, setStatus] = useState('active');
  const [errorMsg, setErrorMsg] = useState('');

  const token = localStorage.getItem('token');

  const fetchCourts = (isSilent = false) => {
    if (!isSilent && !adminDataCache.has('admin_courts')) setLoading(true);
    fetch('http://localhost:5000/api/courts/admin/list', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        const list = data.data || [];
        adminDataCache.set('admin_courts', list);
        setCourts(list);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => fetchCourts(!!cachedCourts), [token]);

  const openAddModal = () => {
    setEditingCourt(null);
    setName('');
    setDescription('');
    setType('Standard');
    setIndoor(true);
    setCapacity(4);
    setStatus('active');
    setErrorMsg('');
    setShowModal(true);
  };

  const openEditModal = (court: any) => {
    setEditingCourt(court);
    setName(court.name);
    setDescription(court.description || '');
    setType(court.type || 'Standard');
    setIndoor(court.indoor);
    setCapacity(court.capacity || 4);
    setStatus(court.status || 'active');
    setErrorMsg('');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const url = editingCourt 
      ? `http://localhost:5000/api/courts/admin/${editingCourt.id}` 
      : 'http://localhost:5000/api/courts/admin';
    const method = editingCourt ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, description, type, indoor, capacity: Number(capacity), status })
      });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        fetchCourts();
      } else {
        setErrorMsg(data.message || 'Gagal menyimpan data lapangan');
      }
    } catch {
      setErrorMsg('Terjadi kesalahan koneksi server');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menonaktifkan lapangan ini?')) return;
    try {
      await fetch(`http://localhost:5000/api/courts/admin/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCourts();
    } catch {}
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Lapangan</h1>
        <Button onClick={openAddModal} className="bg-brand-600 hover:bg-brand-700 text-white text-xs h-9 px-4 font-semibold rounded-lg transition-colors">
          <Plus className="w-4 h-4 mr-1.5" /> Tambah Lapangan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3">
            <LoadingSkeleton label="Memuat lapangan padel..." />
          </div>
        ) : (
          courts.map(c => (
            <Card key={c.id} className="border border-neutral-200 overflow-hidden bg-white shadow-xs rounded-xl hover:border-neutral-300 transition-all">
              <div className="h-40 bg-neutral-900 relative">
                <img 
                  src={c.images && c.images[0] ? c.images[0].imageUrl : 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=600&q=80'} 
                  alt={c.name} 
                  className="w-full h-full object-cover opacity-85" 
                />
                <span className="absolute top-3 left-3 bg-neutral-900/80 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold">
                  {c.indoor ? 'Indoor' : 'Outdoor'}
                </span>
                <span className="absolute top-3 right-3 bg-neutral-900/80 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold">
                  {c.type}
                </span>
              </div>
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-neutral-900 text-sm">{c.name}</h3>
                  {renderStatusBadge(c.status)}
                </div>
                <p className="text-xs text-neutral-500 line-clamp-2">{c.description || 'Tidak ada deskripsi'}</p>
                <div className="pt-2.5 border-t border-neutral-100 flex justify-between items-center text-xs">
                  <span className="font-semibold text-neutral-700">Kapasitas: {c.capacity || 4} orang</span>
                  <div className="flex gap-1.5">
                    <Button variant="outline" size="sm" onClick={() => openEditModal(c)} className="h-7 text-[11px] px-2.5 rounded-md border-neutral-300">
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(c.id)} className="h-7 text-[11px] px-2 text-red-600 hover:bg-red-50 rounded-md">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modal Add / Edit Court (Styleguide Section 21 & Section 11) */}
      {showModal && (
        <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md bg-white shadow-xl rounded-xl border border-neutral-200">
            <CardHeader className="flex flex-row justify-between items-center border-b border-neutral-100 pb-3">
              <CardTitle className="text-sm font-bold text-neutral-900">
                {editingCourt ? 'Edit Detail Lapangan' : 'Tambah Lapangan Padel Baru'}
              </CardTitle>
              <button onClick={() => setShowModal(false)} className="text-neutral-400 hover:text-neutral-600 text-sm p-1 rounded">✕</button>
            </CardHeader>
            <CardContent className="p-5">
              {errorMsg && <div className="mb-3 p-2.5 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">{errorMsg}</div>}
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">Nama Lapangan</label>
                  <input 
                    type="text" 
                    required 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    placeholder="Contoh: Court 4 - Panoramic VIP" 
                    className="w-full h-10 px-3 border border-neutral-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 transition-all" 
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">Deskripsi Lapangan</label>
                  <textarea 
                    rows={2} 
                    value={description} 
                    onChange={e => setDescription(e.target.value)} 
                    placeholder="Deskripsi spesifikasi karpet, pencahayaan, dll." 
                    className="w-full p-3 border border-neutral-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 transition-all" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-neutral-800 mb-1">Tipe Lapangan</label>
                    <select value={type} onChange={e => setType(e.target.value)} className="w-full h-10 px-2.5 border border-neutral-300 rounded-lg text-xs focus:outline-none focus:border-brand-600">
                      <option value="Standard">Standard Court</option>
                      <option value="Panoramic">Panoramic Court</option>
                      <option value="VIP Center">VIP Center Court</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-neutral-800 mb-1">Lokasi Court</label>
                    <select value={indoor ? 'true' : 'false'} onChange={e => setIndoor(e.target.value === 'true')} className="w-full h-10 px-2.5 border border-neutral-300 rounded-lg text-xs focus:outline-none focus:border-brand-600">
                      <option value="true">Indoor (Beratap)</option>
                      <option value="false">Outdoor (Terbuka)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-neutral-800 mb-1">Kapasitas Maksimal</label>
                    <input 
                      type="number" 
                      value={capacity} 
                      onChange={e => setCapacity(Number(e.target.value))} 
                      className="w-full h-10 px-3 border border-neutral-300 rounded-lg text-xs focus:outline-none focus:border-brand-600" 
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-neutral-800 mb-1">Status Operasional</label>
                    <select value={status} onChange={e => setStatus(e.target.value)} className="w-full h-10 px-2.5 border border-neutral-300 rounded-lg text-xs focus:outline-none focus:border-brand-600">
                      <option value="active">Active (Siap Dibooking)</option>
                      <option value="maintenance">Maintenance / Perbaikan</option>
                      <option value="inactive">Inactive (Nonaktif)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-100 flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="h-9 px-4 text-xs font-medium border-neutral-300">Batal</Button>
                  <Button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white h-9 px-4 text-xs font-semibold rounded-lg">
                    {editingCourt ? 'Update Lapangan' : 'Simpan Lapangan Baru'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

{/* 4. Admin Schedules (Admin Flow Section 9) */}
function AdminSchedules() {
  const cachedBlocks = adminDataCache.get('admin_blocks');
  const cachedCourts = adminDataCache.get('admin_courts');

  const [blocks, setBlocks] = useState<any[]>(cachedBlocks || []);
  const [courtId, setCourtId] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState<string>('08:00');
  const [endTime, setEndTime] = useState<string>('10:00');
  const [reason, setReason] = useState<string>('Maintenance');
  const [courts, setCourts] = useState<any[]>(cachedCourts || []);
  const [loading, setLoading] = useState<boolean>(!cachedBlocks);
  const token = localStorage.getItem('token');

  const fetchBlocks = (isSilent = false) => {
    if (!isSilent && !adminDataCache.has('admin_blocks')) setLoading(true);
    fetch('http://localhost:5000/api/schedule/admin/blocked-schedules', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        const list = data.data || [];
        adminDataCache.set('admin_blocks', list);
        setBlocks(list);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBlocks(!!cachedBlocks);
    fetch('http://localhost:5000/api/courts/admin/list', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        const list = data.data || [];
        adminDataCache.set('admin_courts', list);
        setCourts(list);
        if (list.length > 0 && !courtId) setCourtId(list[0].id);
      })
      .catch(() => {});
  }, [token]);

  const handleAddBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courtId) return;

    await fetch('http://localhost:5000/api/schedule/admin/blocked-schedules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ courtId, date, startTime, endTime, reason })
    });
    fetchBlocks();
  };

  const handleDeleteBlock = async (id: string) => {
    await fetch(`http://localhost:5000/api/schedule/admin/blocked-schedules/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchBlocks();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Jadwal & Penutupan</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Block Schedule */}
        <Card className="border border-neutral-200 rounded-xl overflow-hidden bg-white">
          <CardHeader className="border-b border-neutral-100 bg-neutral-50/50 py-3.5 px-4">
            <CardTitle className="text-xs font-bold text-neutral-900 uppercase tracking-wider">Blokir Slot Jam Baru</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <form onSubmit={handleAddBlock} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-neutral-800 font-semibold mb-1">Target Lapangan</label>
                <select value={courtId} onChange={e => setCourtId(e.target.value)} className="w-full h-10 px-3 border border-neutral-300 rounded-lg text-xs bg-white focus:outline-none focus:border-brand-600">
                  {courts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-neutral-800 font-semibold mb-1">Tanggal Blokir</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full h-10 px-3 border border-neutral-300 rounded-lg text-xs bg-white focus:outline-none focus:border-brand-600" />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-neutral-800 font-semibold mb-1">Jam Mulai</label>
                  <input type="text" value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full h-10 px-3 border border-neutral-300 rounded-lg text-xs font-mono focus:outline-none focus:border-brand-600" placeholder="08:00" />
                </div>
                <div>
                  <label className="block text-neutral-800 font-semibold mb-1">Jam Selesai</label>
                  <input type="text" value={endTime} onChange={e => setEndTime(e.target.value)} className="w-full h-10 px-3 border border-neutral-300 rounded-lg text-xs font-mono focus:outline-none focus:border-brand-600" placeholder="10:00" />
                </div>
              </div>

              <div>
                <label className="block text-neutral-800 font-semibold mb-1">Alasan Penutupan</label>
                <select value={reason} onChange={e => setReason(e.target.value)} className="w-full h-10 px-3 border border-neutral-300 rounded-lg text-xs bg-white focus:outline-none focus:border-brand-600">
                  <option value="Maintenance">Maintenance / Perbaikan</option>
                  <option value="Private Event">Private Event</option>
                  <option value="Tournament">Tournament</option>
                  <option value="Venue Closed">Venue Closed</option>
                </select>
              </div>

              <Button type="submit" className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold h-10 rounded-lg mt-2 transition-colors">
                Simpan Blokir Jadwal
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* List Blocked Schedules */}
        <Card className="lg:col-span-2 border border-neutral-200 rounded-xl overflow-hidden bg-white">
          <CardHeader className="border-b border-neutral-100 bg-neutral-50/50 py-3.5 px-4">
            <CardTitle className="text-xs font-bold text-neutral-900 uppercase tracking-wider">Daftar Jadwal Diblokir</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-neutral-50/80 text-neutral-500 uppercase tracking-wider text-[11px] font-semibold border-b border-neutral-200/80">
                  <tr>
                    <th className="px-4 py-3.5">Lapangan</th>
                    <th className="px-4 py-3.5">Tanggal & Waktu</th>
                    <th className="px-4 py-3.5">Alasan</th>
                    <th className="px-4 py-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {loading ? (
                    <tr><td colSpan={4} className="p-4"><LoadingSkeleton label="Memuat jadwal diblokir..." /></td></tr>
                  ) : (
                    blocks.map(b => (
                      <tr key={b.id} className="hover:bg-neutral-50/60 transition-colors">
                        <td className="px-4 py-3.5 font-semibold text-neutral-900">{b.court?.name}</td>
                        <td className="px-4 py-3.5 text-neutral-600">
                          <span className="font-medium text-neutral-900">{new Date(b.date).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                          <span className="ml-2 font-mono text-neutral-500">({b.startTime} - {b.endTime})</span>
                        </td>
                        <td className="px-4 py-3.5">
                          <Badge variant="warning">{b.reason}</Badge>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteBlock(b.id)} className="h-7 text-red-600 hover:bg-red-50 rounded-md">
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                  {!loading && blocks.length === 0 && (
                    <tr><td colSpan={4} className="p-8 text-center text-neutral-400">Belum ada blokir jadwal aktif.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

{/* 5. Admin Pricing (Admin Flow Section 10) */}
function AdminPricing() {
  const cachedPricing = adminDataCache.get('admin_pricing');
  const cachedCourts = adminDataCache.get('admin_courts');

  const [pricing, setPricing] = useState<any[]>(cachedPricing || []);
  const [courts, setCourts] = useState<any[]>(cachedCourts || []);
  const [loading, setLoading] = useState<boolean>(!cachedPricing);
  const [showModal, setShowModal] = useState(false);
  const [courtId, setCourtId] = useState('');
  const [dayType, setDayType] = useState('weekday');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('17:00');
  const [price, setPrice] = useState(150000);
  const [errorMsg, setErrorMsg] = useState('');

  const token = localStorage.getItem('token');

  const fetchPricing = (isSilent = false) => {
    if (!isSilent && !adminDataCache.has('admin_pricing')) setLoading(true);
    fetch('http://localhost:5000/api/pricing/admin/pricing', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        const list = data.data || [];
        adminDataCache.set('admin_pricing', list);
        setPricing(list);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPricing(!!cachedPricing);
    fetch('http://localhost:5000/api/courts/admin/list', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        const list = data.data || [];
        adminDataCache.set('admin_courts', list);
        setCourts(list);
        if (list.length > 0 && !courtId) setCourtId(list[0].id);
      })
      .catch(() => {});
  }, [token]);

  const handleAddPricing = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const res = await fetch('http://localhost:5000/api/pricing/admin/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ courtId, dayType, startTime, endTime, price: Number(price) })
      });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        fetchPricing();
      } else {
        setErrorMsg(data.message || 'Gagal membuat aturan harga');
      }
    } catch {
      setErrorMsg('Koneksi server gagal');
    }
  };

  const handleDeletePricing = async (id: string) => {
    if (!window.confirm('Hapus aturan harga ini?')) return;
    try {
      await fetch(`http://localhost:5000/api/pricing/admin/pricing/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPricing();
    } catch {}
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Tarif & Harga</h1>
        <Button onClick={() => setShowModal(true)} className="bg-brand-600 hover:bg-brand-700 text-white text-xs h-9 px-4 font-semibold rounded-lg transition-colors">
          <Plus className="w-4 h-4 mr-1.5" /> Tambah Aturan Harga
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-3">
            <LoadingSkeleton label="Memuat aturan harga..." />
          </div>
        ) : (
          pricing.map(p => (
            <Card key={p.id} className="border border-neutral-200 bg-white rounded-xl hover:border-neutral-300 transition-all">
              <CardContent className="p-4 space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-neutral-900 text-sm">{p.court?.name || 'Semua Lapangan'}</span>
                  <Badge variant={p.dayType === 'weekend' ? 'warning' : 'secondary'} className="uppercase tracking-wider font-semibold text-[10px]">
                    {p.dayType}
                  </Badge>
                </div>
                <div className="text-neutral-500 font-mono text-[11px]">
                  Jam Operasional Tarif: <strong className="text-neutral-700">{p.startTime} – {p.endTime} WIB</strong>
                </div>
                <div className="pt-2.5 border-t border-neutral-100 flex justify-between items-center">
                  <span className="text-base font-extrabold text-brand-700">{formatCurrency(p.price)}<span className="text-xs font-normal text-neutral-400">/jam</span></span>
                  <Button variant="ghost" size="sm" onClick={() => handleDeletePricing(p.id)} className="h-7 text-red-600 hover:bg-red-50 text-xs px-2.5 rounded-md">
                    <Trash2 className="w-3.5 h-3.5 mr-1" /> Hapus
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
        {!loading && pricing.length === 0 && (
          <div className="col-span-3 p-10 text-center text-neutral-400 bg-white rounded-xl border border-neutral-200">
            Belum ada aturan harga khusus. Tarif standar lapangan akan digunakan.
          </div>
        )}
      </div>

      {/* Modal Add Pricing (Styleguide Section 21 & Section 11) */}
      {showModal && (
        <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md bg-white shadow-xl rounded-xl border border-neutral-200">
            <CardHeader className="flex flex-row justify-between items-center border-b border-neutral-100 pb-3">
              <CardTitle className="text-sm font-bold text-neutral-900">Tambah Aturan Harga Baru</CardTitle>
              <button onClick={() => setShowModal(false)} className="text-neutral-400 hover:text-neutral-600 text-sm p-1 rounded">✕</button>
            </CardHeader>
            <CardContent className="p-5">
              {errorMsg && <div className="mb-3 p-2.5 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">{errorMsg}</div>}
              <form onSubmit={handleAddPricing} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">Target Lapangan</label>
                  <select value={courtId} onChange={e => setCourtId(e.target.value)} className="w-full h-10 px-3 border border-neutral-300 rounded-lg text-xs bg-white focus:outline-none focus:border-brand-600">
                    {courts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">Tipe Hari</label>
                  <select value={dayType} onChange={e => setDayType(e.target.value)} className="w-full h-10 px-3 border border-neutral-300 rounded-lg text-xs bg-white focus:outline-none focus:border-brand-600">
                    <option value="weekday">Weekday (Senin - Jumat)</option>
                    <option value="weekend">Weekend (Sabtu - Minggu)</option>
                    <option value="holiday">Hari Libur Nasional</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-neutral-800 mb-1">Jam Mulai</label>
                    <input type="text" value={startTime} onChange={e => setStartTime(e.target.value)} placeholder="08:00" className="w-full h-10 px-3 border border-neutral-300 rounded-lg text-xs font-mono focus:outline-none focus:border-brand-600" />
                  </div>
                  <div>
                    <label className="block font-semibold text-neutral-800 mb-1">Jam Selesai</label>
                    <input type="text" value={endTime} onChange={e => setEndTime(e.target.value)} placeholder="17:00" className="w-full h-10 px-3 border border-neutral-300 rounded-lg text-xs font-mono focus:outline-none focus:border-brand-600" />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">Harga per Jam (Rp)</label>
                  <input type="number" required step="5000" value={price} onChange={e => setPrice(Number(e.target.value))} className="w-full h-10 px-3 border border-neutral-300 rounded-lg text-xs font-bold focus:outline-none focus:border-brand-600" />
                </div>

                <div className="pt-3 border-t border-neutral-100 flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="h-9 px-4 text-xs font-medium border-neutral-300">Batal</Button>
                  <Button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white h-9 px-4 text-xs font-semibold rounded-lg">Simpan Aturan Harga</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

{/* 6. Admin Customers (Admin Flow Section 11) */}
function AdminCustomers() {
  const cachedCustomers = adminDataCache.get('admin_customers');
  const [customers, setCustomers] = useState<any[]>(cachedCustomers || []);
  const [loading, setLoading] = useState<boolean>(!cachedCustomers);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!cachedCustomers) setLoading(true);
    fetch('http://localhost:5000/api/users/admin/customers', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        const list = data.data || [];
        adminDataCache.set('admin_customers', list);
        setCustomers(list);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Pelanggan</h1>
      </div>

      <Card className="border border-neutral-200 rounded-xl overflow-hidden bg-white">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-neutral-50/80 text-neutral-500 uppercase tracking-wider text-[11px] font-semibold border-b border-neutral-200/80">
                <tr>
                  <th className="px-4 py-3.5">Nama Pelanggan</th>
                  <th className="px-4 py-3.5">Email</th>
                  <th className="px-4 py-3.5">Telepon</th>
                  <th className="px-4 py-3.5">Role</th>
                  <th className="px-4 py-3.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {loading ? (
                  <tr><td colSpan={5} className="p-4"><LoadingSkeleton label="Memuat pelanggan..." /></td></tr>
                ) : (
                  customers.map(c => (
                    <tr key={c.id} className="hover:bg-neutral-50/60 transition-colors">
                      <td className="px-4 py-3.5 font-bold text-neutral-900">{c.name}</td>
                      <td className="px-4 py-3.5 text-neutral-600 font-medium">{c.email}</td>
                      <td className="px-4 py-3.5 text-neutral-600 font-mono">{c.phone || '-'}</td>
                      <td className="px-4 py-3.5"><Badge variant="secondary" className="capitalize">{c.role}</Badge></td>
                      <td className="px-4 py-3.5 text-right">{renderStatusBadge('active')}</td>
                    </tr>
                  ))
                )}
                {!loading && customers.length === 0 && (
                  <tr><td colSpan={5} className="p-10 text-center text-neutral-400">Belum ada pelanggan terdaftar.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

{/* 7. Admin Staff (Admin Flow Section 12) */}
function AdminStaff() {
  const cachedStaff = adminDataCache.get('admin_staff');
  const [staffList, setStaffList] = useState<any[]>(cachedStaff || []);
  const [loading, setLoading] = useState<boolean>(!cachedStaff);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('staff');
  const [errorMsg, setErrorMsg] = useState('');
  const token = localStorage.getItem('token');

  const fetchStaff = (isSilent = false) => {
    if (!isSilent && !adminDataCache.has('admin_staff')) setLoading(true);
    fetch('http://localhost:5000/api/users/admin/staff', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        const list = data.data || [];
        adminDataCache.set('admin_staff', list);
        setStaffList(list);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => fetchStaff(!!cachedStaff), [token]);

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const res = await fetch('http://localhost:5000/api/users/admin/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, email, phone, password, role })
      });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        setName(''); setEmail(''); setPhone(''); setPassword('');
        fetchStaff();
      } else {
        setErrorMsg(data.message || 'Gagal menambahkan staff');
      }
    } catch {
      setErrorMsg('Kesalahan server/koneksi');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Kelola Staf Operasional</h1>
        <Button onClick={() => setShowModal(true)} className="bg-brand-600 hover:bg-brand-700 text-white text-xs h-9 px-4 font-semibold rounded-lg transition-colors">
          <Plus className="w-4 h-4 mr-1.5" /> Tambah Staf
        </Button>
      </div>

      <Card className="border border-neutral-200 rounded-xl overflow-hidden bg-white">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-neutral-50/80 text-neutral-500 uppercase tracking-wider text-[11px] font-semibold border-b border-neutral-200/80">
                <tr>
                  <th className="px-4 py-3.5">Nama Staff</th>
                  <th className="px-4 py-3.5">Email</th>
                  <th className="px-4 py-3.5">Nomor HP</th>
                  <th className="px-4 py-3.5">Hak Akses Role</th>
                  <th className="px-4 py-3.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {loading ? (
                  <tr><td colSpan={5} className="p-4"><LoadingSkeleton label="Memuat tim staff..." /></td></tr>
                ) : (
                  staffList.map(s => (
                    <tr key={s.id} className="hover:bg-neutral-50/60 transition-colors">
                      <td className="px-4 py-3.5 font-bold text-neutral-900">{s.name}</td>
                      <td className="px-4 py-3.5 text-neutral-600 font-medium">{s.email}</td>
                      <td className="px-4 py-3.5 text-neutral-600 font-mono">{s.phone || '-'}</td>
                      <td className="px-4 py-3.5">
                        <Badge variant={s.role === 'admin' ? 'info' : 'secondary'} className="capitalize">{s.role}</Badge>
                      </td>
                      <td className="px-4 py-3.5 text-right">{renderStatusBadge('active')}</td>
                    </tr>
                  ))
                )}
                {!loading && staffList.length === 0 && (
                  <tr><td colSpan={5} className="p-10 text-center text-neutral-400">Belum ada staff terdaftar.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal Add Staff (Styleguide Section 21 & Section 11) */}
      {showModal && (
        <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md bg-white shadow-xl rounded-xl border border-neutral-200">
            <CardHeader className="flex flex-row justify-between items-center border-b border-neutral-100 pb-3">
              <CardTitle className="text-sm font-bold text-neutral-900">Tambah Akun Staff / Admin Baru</CardTitle>
              <button onClick={() => setShowModal(false)} className="text-neutral-400 hover:text-neutral-600 text-sm p-1 rounded">✕</button>
            </CardHeader>
            <CardContent className="p-5">
              {errorMsg && <div className="mb-3 p-2.5 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">{errorMsg}</div>}
              <form onSubmit={handleCreateStaff} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">Nama Lengkap</label>
                  <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Contoh: Budi Kasir" className="w-full h-10 px-3 border border-neutral-300 rounded-lg text-xs focus:outline-none focus:border-brand-600" />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">Email</label>
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="budi@padel.com" className="w-full h-10 px-3 border border-neutral-300 rounded-lg text-xs focus:outline-none focus:border-brand-600" />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">Nomor Handphone</label>
                  <input type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder="08123456789" className="w-full h-10 px-3 border border-neutral-300 rounded-lg text-xs font-mono focus:outline-none focus:border-brand-600" />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">Password</label>
                  <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full h-10 px-3 border border-neutral-300 rounded-lg text-xs focus:outline-none focus:border-brand-600" />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">Role Access</label>
                  <select value={role} onChange={e => setRole(e.target.value)} className="w-full h-10 px-3 border border-neutral-300 rounded-lg text-xs bg-white focus:outline-none focus:border-brand-600">
                    <option value="staff">Staff (Operasional Kasir)</option>
                    <option value="admin">Admin (Akses Penuh)</option>
                  </select>
                </div>
                <div className="pt-3 border-t border-neutral-100 flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="h-9 px-4 text-xs font-medium border-neutral-300">Batal</Button>
                  <Button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white h-9 px-4 text-xs font-semibold rounded-lg">Simpan Staff</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

{/* 8. Admin Payments (Admin Flow Section 13) */}
function AdminPayments() {
  const cachedPayments = adminDataCache.get('admin_payments');
  const [payments, setPayments] = useState<any[]>(cachedPayments || []);
  const [loading, setLoading] = useState<boolean>(!cachedPayments);
  const token = localStorage.getItem('token');

  const fetchPayments = (isSilent = false) => {
    if (!isSilent && !adminDataCache.has('admin_payments')) setLoading(true);
    fetch('http://localhost:5000/api/payments/admin/pending', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        const list = data.data || [];
        adminDataCache.set('admin_payments', list);
        setPayments(list);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => fetchPayments(!!cachedPayments), [token]);

  const handleVerify = async (id: string, action: 'approve' | 'reject') => {
    await fetch(`http://localhost:5000/api/payments/admin/verify/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ action, reason: action === 'reject' ? 'Bukti transfer tidak sesuai nominal' : undefined })
    });
    fetchPayments(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Pembayaran</h1>
      </div>

      <Card className="border border-neutral-200 rounded-xl overflow-hidden bg-white">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-neutral-50/80 text-neutral-500 uppercase tracking-wider text-[11px] font-semibold border-b border-neutral-200/80">
                <tr>
                  <th className="px-4 py-3.5">Kode Booking</th>
                  <th className="px-4 py-3.5">Nominal Pembayaran</th>
                  <th className="px-4 py-3.5">Bukti Transfer</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5 text-right">Verifikasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {loading ? (
                  <tr><td colSpan={5} className="p-4"><LoadingSkeleton label="Memuat pembayaran pending..." /></td></tr>
                ) : (
                  payments.map(p => (
                    <tr key={p.id} className="hover:bg-neutral-50/60 transition-colors">
                      <td className="px-4 py-3.5">
                        <span className="font-mono font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded text-[11px]">
                          {p.booking?.bookingCode}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-bold text-neutral-900">{formatCurrency(p.amount)}</td>
                      <td className="px-4 py-3.5">
                        {p.proofUrl ? (
                          <a href={p.proofUrl} target="_blank" rel="noreferrer" className="text-brand-600 font-semibold hover:underline flex items-center gap-1">
                            <ExternalLink className="w-3 h-3" /> Lihat Bukti
                          </a>
                        ) : <span className="text-neutral-400">Tidak ada</span>}
                      </td>
                      <td className="px-4 py-3.5">{renderStatusBadge(p.status)}</td>
                      <td className="px-4 py-3.5 text-right space-x-2">
                        <Button size="sm" onClick={() => handleVerify(p.id, 'approve')} className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] h-7 px-3 rounded-md font-semibold">
                          <CheckCircle className="w-3.5 h-3.5 mr-1" /> Approve
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleVerify(p.id, 'reject')} className="text-red-600 border-red-200 hover:bg-red-50 text-[11px] h-7 px-2.5 rounded-md">
                          <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
                {!loading && payments.length === 0 && (
                  <tr><td colSpan={5} className="p-10 text-center text-neutral-400">Tidak ada pembayaran menunggu verifikasi saat ini.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

{/* 9. Admin Reports & Analytics (Admin Flow Section 14) */}
function AdminReports() {
  const cachedBookings = adminDataCache.get('admin_bookings');
  const cachedCourts = adminDataCache.get('admin_courts');

  const [bookings, setBookings] = useState<any[]>(cachedBookings || []);
  const [courts, setCourts] = useState<any[]>(cachedCourts || []);
  const [period, setPeriod] = useState<'all' | 'today' | 'month'>('all');
  const [selectedCourt, setSelectedCourt] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(!cachedBookings || !cachedCourts);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!cachedBookings || !cachedCourts) setLoading(true);
    Promise.all([
      fetch('http://localhost:5000/api/bookings/admin/all', { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()),
      fetch('http://localhost:5000/api/courts/admin/list', { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json())
    ]).then(([bookingsRes, courtsRes]) => {
      if (bookingsRes.data) {
        adminDataCache.set('admin_bookings', bookingsRes.data);
        setBookings(bookingsRes.data);
      }
      if (courtsRes.data) {
        adminDataCache.set('admin_courts', courtsRes.data);
        setCourts(courtsRes.data);
      }
    }).catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  const filteredBookings = bookings.filter(b => {
    if (selectedCourt !== 'all' && b.courtId !== selectedCourt) return false;
    if (period === 'today') {
      const todayStr = new Date().toISOString().split('T')[0];
      const bDateStr = new Date(b.bookingDate).toISOString().split('T')[0];
      return bDateStr === todayStr;
    }
    if (period === 'month') {
      const now = new Date();
      const bDate = new Date(b.bookingDate);
      return bDate.getMonth() === now.getMonth() && bDate.getFullYear() === now.getFullYear();
    }
    return true;
  });

  const validBookings = filteredBookings.filter(b => b.status !== 'cancelled');
  const grossRevenue = validBookings.reduce((sum, b) => sum + (b.total || 0), 0);
  const totalCount = validBookings.length;
  const avgOrderValue = totalCount > 0 ? grossRevenue / totalCount : 0;
  const completedCount = validBookings.filter(b => b.status === 'completed' || b.status === 'checked_in').length;
  const occupancyRate = validBookings.length > 0 ? Math.min(Math.round((completedCount / (courts.length * 12 || 1)) * 100), 94) : 0;

  const courtMetrics = courts.map(c => {
    const cBookings = validBookings.filter(b => b.courtId === c.id || b.court?.name === c.name);
    const revenue = cBookings.reduce((sum, b) => sum + (b.total || 0), 0);
    const pct = grossRevenue > 0 ? Math.round((revenue / grossRevenue) * 100) : 0;
    return { id: c.id, name: c.name, type: c.type, count: cBookings.length, revenue, pct };
  });

  const primeTimeBookings = validBookings.filter(b => {
    const startH = parseInt((b.startTime || '00:00').split(':')[0], 10);
    return startH >= 17 && startH <= 23;
  });
  const primePct = validBookings.length > 0 ? Math.round((primeTimeBookings.length / validBookings.length) * 100) : 0;

  const exportCSV = () => {
    const headers = "Kode Booking,Tanggal,Jam,Pelanggan,Lapangan,Nominal Total,Status\n";
    const rows = filteredBookings.map(b => 
      `"${b.bookingCode}","${new Date(b.bookingDate).toLocaleDateString()}","${b.startTime}-${b.endTime}","${b.user?.name || 'Walk-in'}","${b.court?.name}","${b.total}","${b.status}"`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `laporan_padel_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-1">
        <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Laporan</h1>

        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-neutral-100 p-1 rounded-lg flex items-center gap-1 border border-neutral-200">
            <button 
              onClick={() => setPeriod('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${period === 'all' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'}`}
            >
              Semua
            </button>
            <button 
              onClick={() => setPeriod('month')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${period === 'month' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'}`}
            >
              Bulan Ini
            </button>
            <button 
              onClick={() => setPeriod('today')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${period === 'today' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'}`}
            >
              Hari Ini
            </button>
          </div>

          <select 
            value={selectedCourt} 
            onChange={e => setSelectedCourt(e.target.value)}
            className="h-9 px-3 border border-neutral-300 rounded-lg text-xs bg-white font-medium text-neutral-800 focus:outline-none focus:border-brand-600"
          >
            <option value="all">Semua Lapangan</option>
            {courts.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <Button onClick={exportCSV} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-9 px-3.5 font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5">
            <FileSpreadsheet className="w-4 h-4" /> Ekspor CSV
          </Button>
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton label="Memuat data laporan & analisis venue..." />
      ) : (
        <>
          {/* 4 KPI Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border border-neutral-200 rounded-xl bg-white p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Total Pendapatan</span>
                <DollarSign className="w-4 h-4 text-neutral-400" />
              </div>
              <div className="text-2xl font-extrabold text-neutral-900 mt-2 tracking-tight">
                {formatCurrency(grossRevenue)}
              </div>
              <div className="mt-2.5 flex items-center gap-1.5">
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/80">
                  {totalCount} Reservasi
                </span>
              </div>
            </Card>

            <Card className="border border-neutral-200 rounded-xl bg-white p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Total Reservasi</span>
                <Calendar className="w-4 h-4 text-neutral-400" />
              </div>
              <div className="text-2xl font-extrabold text-neutral-900 mt-2 tracking-tight">
                {totalCount} <span className="text-xs font-semibold text-neutral-500 font-sans">Slot</span>
              </div>
              <div className="mt-2.5 flex items-center gap-1.5">
                <span className="text-[11px] font-semibold text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">
                  {completedCount} Selesai / Check-in
                </span>
              </div>
            </Card>

            <Card className="border border-neutral-200 rounded-xl bg-white p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Okupansi Lapangan</span>
                <BarChart3 className="w-4 h-4 text-brand-600" />
              </div>
              <div className="text-2xl font-extrabold text-brand-600 mt-2 tracking-tight">
                {occupancyRate}%
              </div>
              <div className="mt-2.5 w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-brand-600 h-full rounded-full transition-all duration-300" style={{ width: `${occupancyRate}%` }} />
              </div>
            </Card>

            <Card className="border border-neutral-200 rounded-xl bg-white p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Rata-rata Transaksi</span>
                <CreditCard className="w-4 h-4 text-neutral-400" />
              </div>
              <div className="text-2xl font-extrabold text-neutral-900 mt-2 tracking-tight">
                {formatCurrency(avgOrderValue)}
              </div>
              <div className="mt-2.5 flex items-center gap-1">
                <span className="text-[11px] font-semibold text-neutral-500">Per pemesanan slot</span>
              </div>
            </Card>
          </div>

          {/* Analytics Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue per Court Breakdown */}
            <Card className="lg:col-span-2 border border-neutral-200 rounded-xl overflow-hidden bg-white">
              <CardHeader className="border-b border-neutral-200 bg-neutral-50/50 py-3.5 px-5 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold text-neutral-900 uppercase tracking-wider">Pendapatan per Lapangan</CardTitle>
                <span className="text-[11px] font-semibold text-neutral-500">{courts.length} Lapangan</span>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                {courtMetrics.map((cm, idx) => (
                  <div key={cm.id} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded bg-neutral-100 text-neutral-600 font-bold text-[10px] flex items-center justify-center">
                          #{idx + 1}
                        </span>
                        <span className="font-bold text-neutral-900">{cm.name}</span>
                        <span className="text-[10px] font-semibold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">
                          {cm.type}
                        </span>
                      </div>
                      <div className="font-bold text-neutral-900">
                        {formatCurrency(cm.revenue)} <span className="text-neutral-400 font-medium">({cm.count} slot)</span>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden flex">
                      <div 
                        className="h-full bg-brand-600 rounded-full transition-all duration-300" 
                        style={{ width: `${cm.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
                {courtMetrics.length === 0 && (
                  <div className="py-8 text-center text-xs text-neutral-400 font-medium">Belum ada data lapangan.</div>
                )}
              </CardContent>
            </Card>

            {/* Peak Hours Widget */}
            <Card className="border border-neutral-200 rounded-xl overflow-hidden bg-white flex flex-col justify-between">
              <CardHeader className="border-b border-neutral-200 bg-neutral-50/50 py-3.5 px-5">
                <CardTitle className="text-xs font-bold text-neutral-900 uppercase tracking-wider">Distribusi Waktu Bermain</CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-5 my-auto">
                <div className="text-center py-1">
                  <div className="text-3xl font-extrabold text-neutral-900 tracking-tight">{primePct}%</div>
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 inline-block mt-1.5">
                    Prime Time (17:00 – 23:00 WIB)
                  </span>
                </div>

                <div className="space-y-3 border-t border-neutral-100 pt-4 text-xs">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-600 font-semibold">Malam / Peak (17:00 - 23:00)</span>
                      <span className="font-bold text-neutral-900">{primePct}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${primePct}%` }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-600 font-semibold">Siang / Regular (08:00 - 16:00)</span>
                      <span className="font-bold text-neutral-900">{100 - primePct}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                      <div className="bg-neutral-400 h-full rounded-full" style={{ width: `${100 - primePct}%` }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Transactions Table */}
          <Card className="border border-neutral-200 rounded-xl overflow-hidden bg-white">
            <CardHeader className="border-b border-neutral-200 bg-neutral-50/50 py-3.5 px-5 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold text-neutral-900 uppercase tracking-wider">Riwayat Transaksi</CardTitle>
              <span className="text-[11px] text-neutral-500 font-semibold">{filteredBookings.length} Transaksi</span>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-neutral-50 text-neutral-600 uppercase tracking-wider text-[11px] font-semibold border-b border-neutral-200">
                    <tr>
                      <th className="px-5 py-3.5">Kode</th>
                      <th className="px-5 py-3.5">Tanggal</th>
                      <th className="px-5 py-3.5">Pelanggan</th>
                      <th className="px-5 py-3.5">Lapangan</th>
                      <th className="px-5 py-3.5">Jam</th>
                      <th className="px-5 py-3.5">Total</th>
                      <th className="px-5 py-3.5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {filteredBookings.map(b => (
                      <tr key={b.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-5 py-3.5">
                          <span className="font-mono font-bold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded text-[11px] border border-brand-200/50">
                            {b.bookingCode}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-neutral-600 font-medium">
                          {new Date(b.bookingDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-5 py-3.5 font-bold text-neutral-900">{b.user?.name || 'Walk-in'}</td>
                        <td className="px-5 py-3.5 text-neutral-700 font-medium">{b.court?.name}</td>
                        <td className="px-5 py-3.5 font-mono text-neutral-600">{b.startTime} - {b.endTime} WIB</td>
                        <td className="px-5 py-3.5 font-bold text-neutral-900">{formatCurrency(b.total)}</td>
                        <td className="px-5 py-3.5 text-right">{renderStatusBadge(b.status)}</td>
                      </tr>
                    ))}
                    {filteredBookings.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-12 text-center text-neutral-400 font-medium">
                          Belum ada transaksi.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

{/* 10. Admin Settings (Admin Flow Section 15) */}
function AdminSettings() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Pengaturan</h1>
      </div>

      <Card className="border border-neutral-200">
        <CardContent className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-medium text-neutral-700 mb-1">Nama Venue</label>
            <input type="text" defaultValue="Padel Sports Center Jakarta" className="w-full p-2.5 border border-neutral-300 rounded-lg" />
          </div>
          <div>
            <label className="block font-medium text-neutral-700 mb-1">Alamat Lengkap</label>
            <input type="text" defaultValue="Jl. Padel Sports Center No. 8, Jakarta Selatan" className="w-full p-2.5 border border-neutral-300 rounded-lg" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-neutral-700 mb-1">Nomor WhatsApp CS</label>
              <input type="text" defaultValue="+62 812-3456-7890" className="w-full p-2.5 border border-neutral-300 rounded-lg" />
            </div>
            <div>
              <label className="block font-medium text-neutral-700 mb-1">Batas Waktu Bayar (Menit)</label>
              <input type="number" defaultValue={15} className="w-full p-2.5 border border-neutral-300 rounded-lg" />
            </div>
          </div>
          <Button className="bg-brand-600 text-white font-semibold text-xs h-10 px-6 rounded-lg">
            Simpan Pengaturan
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
