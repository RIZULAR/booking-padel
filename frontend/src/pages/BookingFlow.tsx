import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { formatCurrency } from '../lib/utils';
import { Calendar, Clock, MapPin, ArrowLeft, ShieldCheck, Check, Sparkles, MessageSquare, Zap } from 'lucide-react';

export default function BookingFlow() {
  const { id } = useParams(); // courtId
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialDate = searchParams.get('date') || new Date().toISOString().split('T')[0];
  const initialStartTime = searchParams.get('startTime') || '';
  const initialEndTime = searchParams.get('endTime') || '';
  const durationParam = parseInt(searchParams.get('duration') || '1', 10);

  const [court, setCourt] = useState<any>(null);
  const [date] = useState<string>(initialDate);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [customerNotes, setCustomerNotes] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch court details
  useEffect(() => {
    fetch(`http://localhost:5000/api/courts/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCourt(data.data);
        }
      })
      .catch(() => {});
  }, [id]);

  // Fetch availability slots
  useEffect(() => {
    if (id && date) {
      fetch(`http://localhost:5000/api/bookings/availability?courtId=${id}&date=${date}`)
        .then(res => res.json())
        .then(data => {
          const availableSlots = data.data || [];
          if (initialStartTime) {
            const matched = availableSlots.find((s: any) => s.startTime === initialStartTime);
            if (matched) {
              setSelectedSlot(matched);
            } else if (availableSlots.length > 0) {
              const firstAvail = availableSlots.find((s: any) => s.isAvailable !== false);
              setSelectedSlot(firstAvail || availableSlots[0]);
            }
          } else if (availableSlots.length > 0) {
            const firstAvail = availableSlots.find((s: any) => s.isAvailable !== false);
            setSelectedSlot(firstAvail || availableSlots[0]);
          }
        })
        .catch(() => {});
    }
  }, [id, date, initialStartTime]);

  // Calculate price with duration
  useEffect(() => {
    if (court && selectedSlot) {
      let hourlyPrice = 150000;
      if (court.pricing && court.pricing.length > 0) {
        const isWeekend = new Date(date).getDay() === 0 || new Date(date).getDay() === 6;
        const dayType = isWeekend ? 'weekend' : 'weekday';
        const rule = court.pricing.find((p: any) => p.dayType === dayType);
        if (rule) hourlyPrice = rule.price;
      }
      setTotalPrice(hourlyPrice * durationParam);
    }
  }, [court, selectedSlot, date, durationParam]);

  const handleBook = async () => {
    if (!selectedSlot) return;
    const token = localStorage.getItem('token');
    if (!token) {
      const returnTo = encodeURIComponent(`/book/${id}?date=${date}&startTime=${selectedSlot.startTime}`);
      navigate(`/login?returnTo=${returnTo}`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const calculatedEndTime = initialEndTime || (selectedSlot ? selectedSlot.endTime : '');
      const res = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          courtId: id,
          date,
          startTime: selectedSlot.startTime,
          endTime: calculatedEndTime,
          notes: customerNotes
        })
      });
      
      const data = await res.json();
      setLoading(false);
      
      if (data.success) {
        navigate(`/payment/${data.data.id}`);
      } else {
        setError(data.message || "Slot ini baru saja diambil pemain lain. Silakan pilih jadwal berbeda.");
      }
    } catch {
      setLoading(false);
      setError("Gagal menghubungi server. Periksa koneksi internet Anda.");
    }
  };

  if (!court) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4 text-center text-neutral-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 mx-auto mb-4"></div>
        Memuat rincian pemesanan...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Back Link */}
      <Link to={`/courts/${id}?date=${date}`} className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-600 hover:text-brand-600">
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Detail Lapangan
      </Link>

      {/* Stepper Progress Bar (Styleguide Section 16 & app-flow.md) */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 text-neutral-400">
          <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px]">
            <Check className="w-3 h-3" />
          </span>
          <span className="font-semibold text-neutral-600">1. Pilih Lapangan & Jam</span>
        </div>

        <span className="text-neutral-300 hidden sm:inline">•</span>

        <div className="flex items-center gap-2 text-brand-700 font-bold">
          <span className="w-5 h-5 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-[10px]">2</span>
          <span>2. Konfirmasi Rincian Pemesanan</span>
        </div>

        <span className="text-neutral-300 hidden sm:inline">•</span>

        <div className="flex items-center gap-2 text-neutral-400">
          <span className="w-5 h-5 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center font-bold text-[10px]">3</span>
          <span>3. Selesaikan Pembayaran</span>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
          {error}
        </div>
      )}

      {/* 2-Column Layout (Left: Summary & Notes, Right: Payment Breakdown & Action) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Court Preview, Booking Schedule & Optional Notes */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border border-neutral-200 shadow-sm rounded-xl overflow-hidden bg-white">
            <div className="bg-neutral-900 text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400">Langkah 2 dari 3</span>
                <h1 className="text-xl font-bold text-white mt-0.5">Konfirmasi Pemesanan</h1>
              </div>
              <ShieldCheck className="w-7 h-7 text-brand-400" />
            </div>

            <CardContent className="p-6 space-y-6">
              
              {/* Court Media & Main Info Header */}
              <div className="flex flex-col sm:flex-row gap-4 p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                <div className="w-full sm:w-36 h-24 bg-neutral-900 rounded-lg overflow-hidden flex-shrink-0 relative">
                  {court.images && court.images.length > 0 ? (
                    <img src={court.images[0].imageUrl} alt={court.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-500">
                      <Sparkles className="w-6 h-6 text-brand-400" />
                    </div>
                  )}
                  <span className="absolute top-2 left-2 bg-neutral-900/80 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded font-semibold">
                    {court.indoor ? 'Indoor' : 'Outdoor'}
                  </span>
                </div>

                <div className="space-y-1 flex-1">
                  <Badge variant="success" className="text-[10px] px-2 py-0.5 mb-1">Siap Dipesan</Badge>
                  <h3 className="text-lg font-bold text-neutral-900">{court.name}</h3>
                  <p className="text-xs text-neutral-500 line-clamp-1">{court.description || 'Lapangan padel karpet biru sintetis standar internasional.'}</p>
                  <p className="text-xs text-neutral-600 flex items-center gap-1 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-600" />
                    <span>Jl. Padel Sports Center No. 8, Jakarta Selatan</span>
                  </p>
                </div>
              </div>

              {/* Schedule Details Card */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                  Jadwal Main Terpilih
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 bg-neutral-50 rounded-lg border border-neutral-200 flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-brand-600" />
                    <div>
                      <p className="text-[10px] uppercase font-bold text-neutral-400">Tanggal Main</p>
                      <p className="text-xs font-bold text-neutral-900">
                        {new Date(date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 bg-neutral-50 rounded-lg border border-neutral-200 flex items-center gap-3">
                    <Clock className="w-5 h-5 text-brand-600" />
                    <div>
                      <p className="text-[10px] uppercase font-bold text-neutral-400">Waktu Main & Durasi</p>
                      {selectedSlot ? (
                        <p className="text-xs font-bold text-neutral-900">
                          {selectedSlot.startTime} – {initialEndTime || selectedSlot.endTime} <span className="font-normal text-neutral-500">({durationParam} Jam)</span>
                        </p>
                      ) : (
                        <p className="text-xs text-neutral-400">Belum ada slot dipilih</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Included Features & Standards */}
              <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-2 text-xs text-emerald-900">
                <p className="font-bold flex items-center gap-1.5 text-emerald-950">
                  <Zap className="w-4 h-4 text-emerald-600" /> Fasilitas & Akses Termasuk dalam Pemesanan:
                </p>
                <ul className="grid grid-cols-2 gap-2 text-emerald-800 text-[11px] font-medium pt-1">
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> Pencahayaan LED Pro</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> Ruang Ganti & Locker Room</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> Shower Air Hangat</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> Free High-Speed Wi-Fi</li>
                </ul>
              </div>

              {/* Customer Special Requests / Notes Input */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-neutral-400" /> Catatan Tambahan (Optional)
                </label>
                <textarea 
                  value={customerNotes}
                  onChange={e => setCustomerNotes(e.target.value)}
                  placeholder="Misal: Perlu sewa raket tambahan / permintaan tim..."
                  className="w-full p-3 bg-neutral-50 border border-neutral-300 rounded-lg text-xs focus:ring-2 focus:ring-brand-500 h-20"
                />
              </div>

            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: Price Breakdown Card & Primary CTA */}
        <div className="lg:col-span-5 sticky top-20 space-y-4">
          <Card className="border border-neutral-200 shadow-sm rounded-xl overflow-hidden bg-white">
            <div className="bg-neutral-50 p-4 border-b border-neutral-200">
              <h3 className="text-sm font-bold text-neutral-900">Rincian Pembayaran</h3>
            </div>

            <CardContent className="p-6 space-y-4 text-xs">
              <div className="space-y-2.5 pb-4 border-b border-neutral-200">
                <div className="flex justify-between text-neutral-600">
                  <span>Sewa Lapangan (1 Jam)</span>
                  <span className="font-semibold text-neutral-900">{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Pencahayaan LED Pro</span>
                  <span className="font-semibold text-emerald-600">Gratis / Termasuk</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Biaya Layanan & Kebersihan</span>
                  <span className="font-semibold text-emerald-600">Rp0</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-1 font-bold">
                <span className="text-sm text-neutral-900">Total Pembayaran</span>
                <span className="text-xl font-extrabold text-neutral-900">{formatCurrency(totalPrice)}</span>
              </div>

              {/* Trust Notice Box */}
              <div className="p-3 bg-brand-50 border border-brand-200 rounded-lg text-[11px] text-brand-900 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                <span>
                  Slot Anda akan **dikunci otomatis selama 10 menit** setelah menekan tombol konfirmasi untuk melakukan pembayaran QRIS.
                </span>
              </div>

              {/* Primary Action Button */}
              <Button 
                onClick={handleBook}
                disabled={!selectedSlot || loading}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold h-11 text-xs rounded-lg uppercase tracking-wider shadow-sm"
              >
                {loading ? "Memproses Reservasi..." : "Konfirmasi & Bayar Sekarang"}
              </Button>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
