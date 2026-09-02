import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { formatCurrency } from '../lib/utils';
import { Calendar, Clock, AlertCircle, ChevronRight } from 'lucide-react';

export default function MyBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelModalId, setCancelModalId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchBookings = () => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetch('http://localhost:5000/api/bookings/my-bookings', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        setBookings(data.data || []);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, [token, navigate]);

  const confirmCancelBooking = async () => {
    if (!cancelModalId) return;
    setCancelling(true);
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${cancelModalId}/cancel`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ reason: cancelReason })
      });
      const data = await res.json();
      setCancelling(false);
      setCancelModalId(null);
      setCancelReason('');
      if (data.success) {
        fetchBookings();
      } else {
        alert(data.message || 'Gagal membatalkan reservasi');
      }
    } catch {
      setCancelling(false);
      setCancelModalId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Booking Saya</h1>
          <p className="text-xs text-neutral-500">Kelola riwayat & status reservasi lapangan Anda</p>
        </div>
        <Button asChild size="sm" className="bg-brand-600 hover:bg-brand-700 font-semibold text-xs h-9">
          <Link to="/courts">Pesan Lapangan Baru</Link>
        </Button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-neutral-400 text-sm">Memuat daftar booking...</div>
      ) : bookings.length === 0 ? (
        /* Empty State (Styleguide Section 23) */
        <Card className="border border-neutral-200 shadow-none rounded-xl">
          <CardContent className="text-center py-16 space-y-4">
            <div className="w-12 h-12 bg-neutral-100 text-neutral-400 rounded-full flex items-center justify-center mx-auto">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-900">Belum Ada Booking</h3>
              <p className="text-xs text-neutral-500 mt-1">Booking pertama kamu akan muncul di sini.</p>
            </div>
            <Button asChild className="bg-brand-600 hover:bg-brand-700 text-xs px-6 font-semibold h-10">
              <Link to="/courts">Cari & Pesan Lapangan</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map(b => {
            const isWaiting = b.status === 'waiting_payment';
            const isConfirmed = b.status === 'confirmed' || b.status === 'paid';
            const isCheckedIn = b.status === 'checked_in';
            const isCompleted = b.status === 'completed';

            return (
              <Card key={b.id} className="border border-neutral-200 shadow-none rounded-xl hover:border-neutral-300 transition-colors">
                <CardContent className="p-5 flex flex-col md:flex-row justify-between md:items-center gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-brand-700">{b.bookingCode}</span>
                      <Badge variant={
                        isConfirmed ? 'success' : 
                        isCheckedIn ? 'info' :
                        isWaiting ? 'warning' :
                        isCompleted ? 'secondary' : 'destructive'
                      }>
                        {
                          isWaiting ? 'Menunggu Pembayaran' :
                          isConfirmed ? 'Terkonfirmasi' :
                          isCheckedIn ? 'Checked In' :
                          isCompleted ? 'Selesai' : 'Dibatalkan'
                        }
                      </Badge>
                    </div>

                    <h3 className="text-lg font-bold text-neutral-900">{b.court?.name}</h3>
                    
                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-neutral-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                        {new Date(b.bookingDate).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-neutral-400" />
                        {b.startTime} – {b.endTime}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between md:justify-end gap-4 border-t md:border-t-0 border-neutral-100 pt-3 md:pt-0">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] text-neutral-400 font-bold uppercase">Total Pembayaran</span>
                      <p className="text-lg font-extrabold text-neutral-900">{formatCurrency(b.total)}</p>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                      {isWaiting && (
                        <>
                          <Button asChild size="sm" className="bg-brand-600 hover:bg-brand-700 text-xs px-4 h-9 font-semibold flex-1 md:flex-initial">
                            <Link to={`/payment/${b.id}`}>Bayar Sekarang</Link>
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setCancelModalId(b.id)}
                            className="border-neutral-300 text-red-600 hover:bg-red-50 text-xs h-9"
                          >
                            Batalkan
                          </Button>
                        </>
                      )}

                      {isConfirmed && (
                        <Button asChild size="sm" variant="outline" className="border-neutral-300 text-neutral-700 hover:bg-neutral-50 text-xs h-9">
                          <Link to={`/booking/${b.id}/success`}>
                            Lihat Tiket <ChevronRight className="w-3.5 h-3.5 ml-1" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Confirmation Cancellation Modal (Styleguide Section 21) */}
      {cancelModalId && (
        <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full border border-neutral-200 shadow-lg rounded-2xl bg-white p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-neutral-900">Batalkan Booking Ini?</h3>
            </div>
            
            <p className="text-xs text-neutral-600">
              Slot jadwal ini akan dilepas dan dapat diambil oleh pemain lain. Tindakan ini tidak dapat dibatalkan.
            </p>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Alasan Pembatalan (Optional)</label>
              <textarea 
                value={cancelReason}
                onChange={e => setCancelReason(e.target.value)}
                placeholder="Beritahu kami alasan pembatalan..."
                className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-xs focus:ring-2 focus:ring-brand-500 h-20"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
              <Button variant="outline" onClick={() => setCancelModalId(null)} disabled={cancelling} className="text-xs">
                Kembali
              </Button>
              <Button onClick={confirmCancelBooking} disabled={cancelling} className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold">
                {cancelling ? "Membatalkan..." : "Ya, Batalkan Booking"}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
