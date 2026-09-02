import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { formatCurrency } from '../lib/utils';
import { Calendar, Search, MapPin, Clock, Phone, ChevronRight, ShieldCheck, Zap, Sparkles } from 'lucide-react';

export default function Home() {
  const [courts, setCourts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [quickDate, setQuickDate] = useState(new Date().toISOString().split('T')[0]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5000/api/courts?date=${quickDate}`)
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        setCourts(data.data || []);
      })
      .catch(() => setLoading(false));
  }, [quickDate]);

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/courts?date=${quickDate}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Hero Section (Styleguide Section 2 - Clean Sport-Tech Hero) */}
      <section className="relative rounded-2xl p-8 md:p-14 overflow-hidden border border-neutral-800 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=1600&q=80')` }}>
        {/* Dark Gradient Overlay for High Contrast Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/90 via-neutral-900/75 to-neutral-950/40"></div>

        <div className="max-w-2xl space-y-3 relative z-10">
          <span className="inline-flex items-center text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1 rounded-full">
            ● Court Availability Live
          </span>
          
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Sewa Lapangan Padel Resmi
          </h1>
          
          <p className="text-neutral-300 text-sm md:text-base font-normal">
            Cek ketersediaan jam secara real-time dan pesan lapangan favorit Anda dalam hitungan detik.
          </p>

          {/* Quick Date Search Bar (Styleguide Section 5 - Flat & Clean) */}
          <form onSubmit={handleQuickSearch} className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-lg">
            <div className="flex items-center gap-2.5 bg-white rounded-lg px-3.5 h-11 border border-neutral-300 flex-1 shadow-xs">
              <Calendar className="w-4 h-4 text-neutral-400 flex-shrink-0" />
              <span className="text-xs font-semibold text-neutral-500 whitespace-nowrap">Tanggal:</span>
              <input 
                type="date"
                value={quickDate}
                onChange={e => setQuickDate(e.target.value)}
                className="text-xs font-semibold text-neutral-900 bg-transparent border-0 p-0 focus:ring-0 w-full"
              />
            </div>

            <Button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs h-11 px-6 rounded-lg whitespace-nowrap">
              <Search className="w-4 h-4 mr-2" /> Cari Lapangan
            </Button>
          </form>
        </div>
      </section>

      {/* Court Preview Section */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">Pilihan Lapangan</h2>
            <p className="text-sm text-neutral-500">Pilihan lapangan indoor & outdoor siap pakai</p>
          </div>
          <Link to="/courts" className="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1">
            Lihat Semua <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-neutral-200 animate-pulse rounded-xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courts.slice(0, 3).map(court => (
              <Card key={court.id} className="overflow-hidden border border-neutral-200 shadow-none hover:border-neutral-300 transition-colors flex flex-col rounded-xl bg-white">
                {/* 16:10 Aspect Ratio Image (Styleguide Section 13) */}
                <div className="aspect-[16/10] bg-neutral-900 relative flex items-center justify-center overflow-hidden">
                  <img 
                    src={
                      court.images && court.images[0]?.imageUrl
                        ? court.images[0].imageUrl
                        : court.indoor 
                          ? 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=800&q=80'
                          : 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=800&q=80'
                    } 
                    alt={court.name} 
                    className="w-full h-full object-cover" 
                  />
                  
                  {/* Court Type Pill */}
                  <span className="absolute top-3 left-3 bg-neutral-900/80 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded-md font-medium">
                    {court.indoor ? 'Indoor' : 'Outdoor'}
                  </span>

                  {/* Status Badge (Styleguide Section 18) */}
                  <span className={`absolute top-3 right-3 text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5 border shadow-xs ${
                    (court.availableSlotsCount ?? 0) > 0 
                      ? 'bg-white/95 text-emerald-700 border-emerald-200/80' 
                      : 'bg-white/95 text-neutral-600 border-neutral-200'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${(court.availableSlotsCount ?? 0) > 0 ? 'bg-emerald-600' : 'bg-neutral-400'}`}></span>
                    {(court.availableSlotsCount ?? 0) > 0 ? `${court.availableSlotsCount} Slot Tersedia` : 'Penuh Hari Ini'}
                  </span>
                </div>

                <CardContent className="p-5 flex-grow flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-neutral-900 mb-1 leading-snug">{court.name}</h3>
                    <p className="text-xs text-neutral-500 line-clamp-1">{court.description || 'Lapangan padel standar kompetisi karpet sintetis.'}</p>
                    
                    <div className="text-xs text-neutral-600 pt-3 mt-2 border-t border-neutral-100 flex items-center justify-between">
                      <span>Maks. {court.capacity} Pemain</span>
                      <span className="text-neutral-400">•</span>
                      <span>Blue Turf</span>
                      {(court.availableSlotsCount ?? 0) > 0 && court.nextAvailableSlot && (
                        <>
                          <span className="text-neutral-400">•</span>
                          <span className="font-semibold text-emerald-700">Awal {court.nextAvailableSlot}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">Mulai Dari</span>
                      <p className="text-base font-bold text-neutral-900">{formatCurrency(150000)}<span className="text-xs font-normal text-neutral-500"> / jam</span></p>
                    </div>

                    <Button asChild size="sm" className="bg-brand-600 hover:bg-brand-700 font-semibold text-xs px-4 h-9 rounded-lg text-white">
                      <Link to={`/courts/${court.id}?date=${quickDate}`}>Pilih Jam</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Facilities Section */}
      <section className="bg-white p-8 rounded-xl border border-neutral-200 space-y-6">
        <h2 className="text-xl font-bold text-neutral-900">Fasilitas Venue</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-brand-50 text-brand-600 rounded-lg">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-neutral-900">Pencahayaan LED Pro</h4>
              <p className="text-xs text-neutral-500 mt-0.5">Pencahayaan terang tanpa bayangan untuk main malam</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-brand-50 text-brand-600 rounded-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-neutral-900">Karpet Sintetis Biru</h4>
              <p className="text-xs text-neutral-500 mt-0.5">Daya cengkeram tinggi & kenyamanan langkah pemain</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-brand-50 text-brand-600 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-neutral-900">Ruang Ganti & Shower</h4>
              <p className="text-xs text-neutral-500 mt-0.5">Bersih, terawat, dilengkapi loker pribadi</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-brand-50 text-brand-600 rounded-lg">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-neutral-900">Kantin & Beverage Area</h4>
              <p className="text-xs text-neutral-500 mt-0.5">Menyediakan minuman kesegaran & camilan sehat</p>
            </div>
          </div>
        </div>
      </section>

      {/* Venue Information Section */}
      <section className="bg-neutral-100 p-8 rounded-xl border border-neutral-200 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-brand-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-neutral-900">Lokasi Venue</h4>
            <p className="text-xs text-neutral-600 mt-1">Jl. Padel Sports Center No. 8, Jakarta Selatan</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-brand-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-neutral-900">Jam Operasional</h4>
            <p className="text-xs text-neutral-600 mt-1">Senin – Minggu: 08:00 – 22:00 WIB</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Phone className="w-5 h-5 text-brand-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-neutral-900">Kontak & Pertanyaan</h4>
            <p className="text-xs text-neutral-600 mt-1">WhatsApp: +62 812-3456-7890</p>
          </div>
        </div>
      </section>
    </div>
  );
}
