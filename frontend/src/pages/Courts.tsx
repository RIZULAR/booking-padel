import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { formatCurrency } from '../lib/utils';
import { Calendar as CalendarIcon, Filter } from 'lucide-react';

interface Court {
  id: string;
  name: string;
  description: string;
  type: string;
  indoor: boolean;
  capacity: number;
  status: string;
  images?: { imageUrl: string }[];
  availableSlotsCount?: number;
  totalSlotsCount?: number;
  nextAvailableSlot?: string | null;
}

export default function Courts() {
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  
  const [searchParams] = useSearchParams();
  const initialDate = searchParams.get('date') || new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(initialDate);

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5000/api/courts?date=${selectedDate}`)
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        if (data.success) {
          setCourts(data.data);
        }
      })
      .catch(() => setLoading(false));
  }, [selectedDate]);

  const filteredCourts = courts.filter(c => {
    if (filterType === 'indoor') return c.indoor;
    if (filterType === 'outdoor') return !c.indoor;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header & Availability Filter (Styleguide Section 34 & 20) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-neutral-200">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Daftar Lapangan Padel</h1>
          <p className="text-xs text-neutral-500">Pilih lapangan & tentukan tanggal bermain Anda</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Date Selector */}
          <div className="flex items-center gap-2 bg-neutral-50 p-2 rounded-lg border border-neutral-300">
            <CalendarIcon className="w-4 h-4 text-neutral-500" />
            <input 
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="bg-transparent text-xs font-semibold border-0 focus:ring-0 text-neutral-800 p-0"
            />
          </div>

          {/* Filter Type Chips */}
          <div className="flex bg-neutral-100 p-1 rounded-lg border border-neutral-200">
            <button 
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                filterType === 'all' ? 'bg-white text-brand-700 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Semua
            </button>
            <button 
              onClick={() => setFilterType('indoor')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                filterType === 'indoor' ? 'bg-white text-brand-700 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Indoor
            </button>
            <button 
              onClick={() => setFilterType('outdoor')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                filterType === 'outdoor' ? 'bg-white text-brand-700 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Outdoor
            </button>
          </div>
        </div>
      </div>

      {/* Courts List (Styleguide Section 12 & 13) */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-neutral-200 animate-pulse rounded-xl"></div>
          ))}
        </div>
      ) : filteredCourts.length === 0 ? (
        /* Empty State (Styleguide Section 23) */
        <div className="bg-white p-12 text-center rounded-xl border border-neutral-200 space-y-3">
          <Filter className="w-10 h-10 text-neutral-400 mx-auto" />
          <h3 className="text-base font-bold text-neutral-900">Tidak Ada Lapangan Ditemukan</h3>
          <p className="text-xs text-neutral-500">Coba ubah kriteria filter indoor/outdoor atau pilih tanggal lain.</p>
          <Button variant="outline" onClick={() => setFilterType('all')} className="text-xs">
            Reset Filter
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredCourts.map(court => (
            <Card key={court.id} className="overflow-hidden border border-neutral-200 shadow-none hover:border-neutral-300 transition-colors flex flex-col rounded-xl bg-white">
              {/* Aspect Ratio 16:10 Image Container (Styleguide Section 13) */}
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
                  {court.indoor ? 'Indoor' : 'Outdoor'} • {court.type}
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

              <CardHeader className="p-5 pb-2">
                <CardTitle className="text-base font-bold text-neutral-900 leading-snug">{court.name}</CardTitle>
                <p className="text-xs text-neutral-500 line-clamp-1">{court.description || 'Lapangan padel standar kompetisi karpet sintetis.'}</p>
              </CardHeader>

              <CardContent className="p-5 pt-0 flex-grow flex flex-col justify-between space-y-4">
                <div className="text-xs text-neutral-600 pt-2 border-t border-neutral-100 flex items-center justify-between">
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

                <div className="pt-2 flex items-center justify-between border-t border-neutral-100">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">Mulai Dari</span>
                    <p className="text-base font-bold text-neutral-900">{formatCurrency(150000)}<span className="text-xs font-normal text-neutral-500"> / jam</span></p>
                  </div>

                  <Button 
                    onClick={() => navigate(`/courts/${court.id}?date=${selectedDate}`)}
                    className="bg-brand-600 hover:bg-brand-700 font-semibold text-xs h-9 px-4 rounded-lg text-white"
                  >
                    Pilih Jam
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
