import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { formatCurrency } from '../lib/utils';
import { 
  Clock, Upload, CheckCircle2, AlertCircle, ArrowLeft, ShieldCheck, 
  Copy, Check, Smartphone, Building2, ExternalLink
} from 'lucide-react';

export default function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'bank'>('qris');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedBank, setCopiedBank] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);

  const token = localStorage.getItem('token');

  const fetchBookingDetail = () => {
    if (!token) return;
    fetch('http://localhost:5000/api/bookings/my-bookings', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        const found = data.data?.find((b: any) => b.id === id);
        if (found) setBooking(found);
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchBookingDetail();
  }, [id, token, navigate]);

  useEffect(() => {
    if (booking?.status === 'waiting_payment' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [booking?.status, timeLeft]);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleCopyCode = () => {
    if (booking?.bookingCode) {
      navigator.clipboard.writeText(booking.bookingCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleCopyBank = () => {
    navigator.clipboard.writeText('8410293847');
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProofFile(e.target.files[0]);
    }
  };

  const simulatePayment = async (status: 'settlement' | 'cancel') => {
    setLoading(true);
    try {
      await fetch('http://localhost:5000/api/payments/create', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ bookingId: id })
      });

      const res = await fetch('http://localhost:5000/api/payments/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: id,
          transaction_status: status
        })
      });
      
      const data = await res.json();
      setLoading(false);
      
      if (data.success) {
        if (status === 'settlement') {
          navigate(`/booking/${id}/success`);
        } else {
          fetchBookingDetail();
        }
      }
    } catch {
      setLoading(false);
    }
  };

  const handleUploadProof = () => {
    if (!proofFile) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (booking) {
        setBooking({ ...booking, status: 'pending_verification' });
      }
    }, 400);
  };

  if (!booking) {
    return (
      <div className="max-w-3xl mx-auto py-20 px-4 text-center text-neutral-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 mx-auto mb-4"></div>
        Memuat data pembayaran...
      </div>
    );
  }

  const isPending = booking.status === 'waiting_payment';
  const isPendingVerification = booking.status === 'pending_verification';
  const isPaid = booking.status === 'confirmed' || booking.status === 'paid';
  const isExpired = booking.status === 'expired' || booking.status === 'cancelled';

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-6">
      
      {/* Sleek Minimal Header */}
      <div className="flex items-center justify-between">
        <Link to="/my-bookings" className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-brand-600">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-400 font-mono">Kode:</span>
          <button 
            onClick={handleCopyCode}
            className="font-mono text-xs font-bold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 px-2.5 py-1 rounded border border-neutral-300 transition-colors inline-flex items-center gap-1.5"
          >
            {booking.bookingCode}
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-neutral-400" />}
          </button>
        </div>
      </div>

      {/* Main Single Card Checkout Container */}
      <div className="bg-white border border-neutral-200 rounded-2xl shadow-xs overflow-hidden">
        
        {/* Top Summary Bar */}
        <div className="p-6 md:p-8 border-b border-neutral-100 bg-neutral-50/50 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-neutral-400">Pembayaran Reservasi</span>
              <h1 className="text-2xl font-extrabold text-neutral-900 mt-0.5">{booking.court?.name}</h1>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs font-medium text-neutral-500">Total Tagihan</span>
              <p className="text-2xl font-extrabold text-neutral-900">{formatCurrency(booking.total)}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-neutral-600 pt-2 border-t border-neutral-200/60">
            <div>
              <span className="text-neutral-400 block text-[10px] uppercase font-bold">Tanggal</span>
              <span className="font-semibold text-neutral-900">
                {new Date(booking.bookingDate).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
            <div>
              <span className="text-neutral-400 block text-[10px] uppercase font-bold">Jam Main</span>
              <span className="font-semibold text-neutral-900">{booking.startTime} – {booking.endTime}</span>
            </div>
            <div>
              <span className="text-neutral-400 block text-[10px] uppercase font-bold">Status</span>
              <Badge variant={
                isPaid ? 'success' :
                isPendingVerification ? 'warning' :
                isExpired ? 'destructive' : 'secondary'
              } className="text-[11px] font-semibold px-2 py-0.5 mt-0.5">
                {
                  isPending ? 'Menunggu Pembayaran' :
                  isPendingVerification ? 'Verifikasi Admin' :
                  isPaid ? 'Lunas' : 'Batal'
                }
              </Badge>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="p-6 md:p-8 space-y-6">
          
          {/* Waiting Payment State */}
          {isPending && (
            <div className="space-y-6">
              
              {/* Minimal Countdown Timer Bar */}
              <div className="p-4 bg-amber-50 border border-amber-200/80 rounded-xl flex items-center justify-between text-amber-900">
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Selesaikan pembayaran dalam:</span>
                </div>
                <span className="font-mono text-lg font-bold text-amber-800">{formatTimer(timeLeft)}</span>
              </div>

              {/* Payment Method Toggle Tabs */}
              <div className="grid grid-cols-2 gap-3 p-1 bg-neutral-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('qris')}
                  className={`py-2.5 px-4 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                    paymentMethod === 'qris'
                      ? 'bg-white text-neutral-900 shadow-xs'
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  <Smartphone className="w-4 h-4" /> QRIS Instant
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank')}
                  className={`py-2.5 px-4 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                    paymentMethod === 'bank'
                      ? 'bg-white text-neutral-900 shadow-xs'
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  <Building2 className="w-4 h-4" /> Transfer Bank
                </button>
              </div>

              {/* QRIS View */}
              {paymentMethod === 'qris' && (
                <div className="text-center space-y-4 py-2">
                  <div className="max-w-xs mx-auto p-6 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3">
                    <p className="text-xs font-bold text-neutral-900">PADEL SPORTS CENTER</p>
                    <p className="text-[10px] text-neutral-400 font-mono">NMID: ID1020394857102</p>

                    {/* Clean QR Graphic Container */}
                    <div className="w-48 h-48 bg-white p-3 rounded-xl border border-neutral-200 mx-auto flex items-center justify-center shadow-xs">
                      <img 
                        src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=PADEL-BOOKING-PAYMENT" 
                        alt="QRIS Code" 
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <p className="text-[11px] text-neutral-500">Scan via GoPay, OVO, Dana, ShopeePay atau m-Banking</p>
                  </div>
                </div>
              )}

              {/* Bank Transfer View */}
              {paymentMethod === 'bank' && (
                <div className="p-5 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-neutral-800">Bank Central Asia (BCA)</span>
                    <span className="font-mono text-xs bg-neutral-200 text-neutral-800 px-2 py-0.5 rounded font-bold">BCA</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 text-[10px] uppercase font-bold">Nomor Rekening Virtual</span>
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-mono text-lg font-extrabold text-neutral-900">8410 2938 47</span>
                      <Button onClick={handleCopyBank} size="sm" variant="outline" className="h-8 text-xs">
                        {copiedBank ? 'Tersalin!' : 'Salin Rekening'}
                      </Button>
                    </div>
                  </div>
                  <p className="text-neutral-500 text-[11px]">Atas Nama: <strong className="text-neutral-800">PT Padel Sports Indonesia</strong></p>
                </div>
              )}

              {/* Upload Proof */}
              <div className="space-y-3 pt-2 border-t border-neutral-100">
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider">
                  Unggah Bukti Pembayaran (Opsional)
                </label>
                <div className="flex items-center gap-3">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange}
                    className="block w-full text-xs text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-neutral-100 file:text-neutral-800 hover:file:bg-neutral-200"
                  />
                  {proofFile && (
                    <Button onClick={handleUploadProof} disabled={loading} className="bg-brand-600 hover:bg-brand-700 text-white text-xs h-9 px-4">
                      <Upload className="w-3.5 h-3.5 mr-1.5" /> Kirim
                    </Button>
                  )}
                </div>
              </div>

              {/* Demo Action Buttons */}
              <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={() => simulatePayment('settlement')} 
                  disabled={loading}
                  className="flex-1 bg-brand-600 hover:bg-brand-700 text-white font-semibold h-11 text-xs"
                >
                  Konfirmasi Pembayaran Sukses
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => simulatePayment('cancel')} 
                  disabled={loading}
                  className="border-neutral-300 text-neutral-700 hover:bg-neutral-50 text-xs h-11"
                >
                  Batalkan Pemesanan
                </Button>
              </div>

            </div>
          )}

          {/* Pending Verification Banner */}
          {isPendingVerification && (
            <div className="p-8 text-center space-y-4 bg-amber-50/50 rounded-2xl border border-amber-200">
              <ShieldCheck className="w-12 h-12 text-amber-600 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-neutral-900">Bukti Pembayaran Sedang Diverifikasi</h3>
                <p className="text-xs text-neutral-600 max-w-md mx-auto">
                  Admin sedang mencocokkan mutasi pembayaran Anda. Status reservasi akan terkonfirmasi secara otomatis.
                </p>
              </div>
              <Button onClick={() => navigate('/my-bookings')} className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs px-6">
                Lihat Pesanan Saya
              </Button>
            </div>
          )}

          {/* Confirmed State */}
          {isPaid && (
            <div className="p-8 text-center space-y-4 bg-emerald-50/50 rounded-2xl border border-emerald-200">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-neutral-900">Pembayaran Berhasil & Lunas</h3>
                <p className="text-xs text-neutral-600 max-w-md mx-auto">
                  Pemesanan Anda telah diverifikasi. Tunjukkan kode <strong className="font-mono text-neutral-900">{booking.bookingCode}</strong> saat kedatangan.
                </p>
              </div>
              <Button onClick={() => navigate(`/booking/${id}/success`)} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-6">
                Lihat Tiket Reservasi
              </Button>
            </div>
          )}

          {/* Expired State */}
          {isExpired && (
            <div className="p-8 text-center space-y-4 bg-neutral-100 rounded-2xl border border-neutral-200">
              <AlertCircle className="w-12 h-12 text-neutral-400 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-neutral-900">Waktu Pembayaran Expired</h3>
                <p className="text-xs text-neutral-600 max-w-md mx-auto">
                  Batas waktu pembayaran 10 menit telah berakhir. Slot ini telah dibuka kembali untuk pemain lain.
                </p>
              </div>
              <Button onClick={() => navigate('/courts')} className="bg-brand-600 hover:bg-brand-700 text-white text-xs px-6">
                Pilih Jadwal Lain
              </Button>
            </div>
          )}

          {/* Support Line */}
          <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
            <span>Ada pertanyaan mengenai pembayaran?</span>
            <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" className="text-brand-600 hover:underline font-semibold inline-flex items-center gap-1">
              Hubungi Support WhatsApp <ExternalLink className="w-3 h-3" />
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}
