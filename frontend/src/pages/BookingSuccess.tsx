import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { formatCurrency } from '../lib/utils';
import { CheckCircle2, Calendar, Clock, MapPin, CreditCard } from 'lucide-react';

export default function BookingSuccess() {
  const { id } = useParams();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:5000/api/bookings/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        if (data.success) {
          setBooking(data.data);
        }
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="text-center py-16 text-neutral-500">Memuat status pemesanan...</div>;
  }

  return (
    <div className="max-w-md mx-auto py-10 px-4">
      <Card className="border border-neutral-200 shadow-sm text-center">
        <CardHeader className="pb-2">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <CardTitle className="text-2xl font-bold text-neutral-900">Pemesanan Dikonfirmasi!</CardTitle>
          <p className="text-sm text-neutral-500">Pembayaran Anda telah terverifikasi</p>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
          {booking && (
            <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200 text-left space-y-3">
              <div className="flex justify-between items-center border-b border-neutral-200 pb-2">
                <span className="text-xs text-neutral-500">Kode Pemesanan</span>
                <span className="text-sm font-mono font-bold text-brand-700">{booking.bookingCode}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-700">
                <MapPin className="w-4 h-4 text-neutral-400" />
                <span>{booking.court?.name || 'Lap. Padel'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-700">
                <Calendar className="w-4 h-4 text-neutral-400" />
                <span>{new Date(booking.bookingDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-700">
                <Clock className="w-4 h-4 text-neutral-400" />
                <span>{booking.startTime} - {booking.endTime} ({booking.duration} menit)</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-700 pt-2 border-t border-neutral-200 font-bold">
                <CreditCard className="w-4 h-4 text-neutral-400" />
                <span>Total: {formatCurrency(booking.total)}</span>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Button asChild className="bg-brand-600 hover:bg-brand-700 w-full font-semibold">
              <Link to={`/my-bookings/${id}`}>Lihat Booking</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link to="/">Kembali ke Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
