import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { formatCurrency } from '../lib/utils';
import { Calendar as CalendarIcon, ArrowLeft, ChevronRight } from 'lucide-react';

interface Slot {
  startTime: string;
  endTime: string;
  isAvailable?: boolean;
  status?: string;
}

export default function CourtDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();

  const [court, setCourt] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  const initialDate = searchParams.get('date') || new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/api/courts/${id}`)
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        if (data.success) {
          setCourt(data.data);
        }
      })
      .catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (id && selectedDate) {
      setLoadingSlots(true);
      setSelectedSlots([]); // Reset selection on date change
      fetch(`http://localhost:5000/api/bookings/availability?courtId=${id}&date=${selectedDate}`)
        .then(res => res.json())
        .then(data => {
          setLoadingSlots(false);
          if (data.success) {
            const returnedSlots = data.data || [];
            setSlots(returnedSlots);

            // Default select first available single slot
            const firstAvailable = returnedSlots.find((s: any) => s.isAvailable !== false && s.status !== 'booked' && s.status !== 'blocked');
            if (firstAvailable) {
              setSelectedSlots([firstAvailable.startTime]);
            }
          }
        })
        .catch(() => setLoadingSlots(false));
    }
  }, [id, selectedDate]);

  const handleSlotClick = (clickedSlot: Slot) => {
    if (clickedSlot.isAvailable === false || clickedSlot.status === 'booked' || clickedSlot.status === 'blocked') return;

    const clickedTime = clickedSlot.startTime;

    if (selectedSlots.length === 0) {
      setSelectedSlots([clickedTime]);
      return;
    }

    const clickedIndex = slots.findIndex(s => s.startTime === clickedTime);
    const firstSelectedIndex = slots.findIndex(s => s.startTime === selectedSlots[0]);
    const lastSelectedIndex = slots.findIndex(s => s.startTime === selectedSlots[selectedSlots.length - 1]);

    // If clicking an already selected slot
    if (selectedSlots.includes(clickedTime)) {
      if (selectedSlots.length === 1) {
        setSelectedSlots([]);
      } else if (clickedTime === selectedSlots[selectedSlots.length - 1]) {
        // Remove last slot
        setSelectedSlots(selectedSlots.slice(0, -1));
      } else {
        // Reset to just the clicked slot
        setSelectedSlots([clickedTime]);
      }
      return;
    }

    // Try extending range if contiguous and available
    const minIdx = Math.min(firstSelectedIndex, clickedIndex);
    const maxIdx = Math.max(lastSelectedIndex, clickedIndex);

    // Verify all intermediate slots in range [minIdx, maxIdx] are available
    let allAvailable = true;
    const newSelected: string[] = [];
    for (let i = minIdx; i <= maxIdx; i++) {
      const s = slots[i];
      if (!s || s.isAvailable === false || s.status === 'booked' || s.status === 'blocked') {
        allAvailable = false;
        break;
      }
      newSelected.push(s.startTime);
    }

    if (allAvailable && newSelected.length <= 4) { // Limit max 4 consecutive hours
      setSelectedSlots(newSelected);
    } else {
      // If not contiguous or gap exists, start fresh selection at clicked slot
      setSelectedSlots([clickedTime]);
    }
  };

  const getStartTime = () => selectedSlots[0] || '';
  const getEndTime = () => {
    if (selectedSlots.length === 0) return '';
    const lastTime = selectedSlots[selectedSlots.length - 1];
    const slotObj = slots.find(s => s.startTime === lastTime);
    return slotObj ? slotObj.endTime : '';
  };
  const duration = selectedSlots.length;

  const handleProceedBooking = () => {
    const startTime = getStartTime();
    const endTime = getEndTime();
    const targetUrl = `/book/${id}?date=${selectedDate}&duration=${duration}${startTime ? `&startTime=${startTime}` : ''}${endTime ? `&endTime=${endTime}` : ''}`;
    
    if (!isAuthenticated) {
      navigate(`/login?returnTo=${encodeURIComponent(targetUrl)}`);
    } else {
      navigate(targetUrl);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4 text-center text-neutral-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 mx-auto mb-4"></div>
        Memuat detail lapangan...
      </div>
    );
  }

  if (!court) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-neutral-900">Lapangan Tidak Ditemukan</h2>
        <Button onClick={() => navigate('/courts')} variant="outline">Kembali ke Daftar Lapangan</Button>
      </div>
    );
  }

  const images = court.images && court.images.length > 0 ? court.images : [];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Back Link */}
      <Link to="/courts" className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-brand-600">
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Daftar Lapangan
      </Link>

      {/* 2-Column Split Layout (Left: Image Showcase, Right: Details & Booking Form) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: COURT IMAGE SHOWCASE */}
        <div className="lg:col-span-5 space-y-4">
          <div className="aspect-[16/10] bg-neutral-900 relative rounded-xl overflow-hidden border border-neutral-200">
            <img 
              src={
                images.length > 0 
                  ? (images[activeImageIndex]?.imageUrl || images[0].imageUrl)
                  : court.indoor 
                    ? 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=1200&q=80'
                    : 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=1200&q=80'
              } 
              alt={court.name} 
              className="w-full h-full object-cover" 
            />
            <span className="absolute top-3 left-3 bg-neutral-900/80 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded-md font-medium">
              {court.indoor ? 'Indoor' : 'Outdoor'} • {court.type}
            </span>
          </div>

          {/* Thumbnail Gallery */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img: any, idx: number) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-14 rounded-lg overflow-hidden border transition-all flex-shrink-0 ${
                    activeImageIndex === idx ? 'border-brand-600 ring-2 ring-brand-500/20' : 'border-neutral-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.imageUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: COURT INFO, SPECS, SLOT SELECTION & BOOKING SUMMARY */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-neutral-200 rounded-xl p-6 md:p-8 space-y-6">
            
            {/* Header Info */}
            <div className="space-y-2 pb-4 border-b border-neutral-100">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-neutral-900">{court.name}</h1>
                <span className="text-sm font-bold text-neutral-900">{formatCurrency(150000)}<span className="text-xs font-normal text-neutral-500"> / jam</span></span>
              </div>
              <p className="text-xs text-neutral-500">{court.description || 'Lapangan padel standar kompetisi dengan karpet sintetis biru.'}</p>
              
              {/* Clean Inline Specs Row (Styleguide Section 1 - No cards inside cards) */}
              <div className="pt-2 flex items-center gap-3 text-xs text-neutral-600">
                <span>Maks. {court.capacity} Pemain</span>
                <span className="text-neutral-300">•</span>
                <span>Karpet Sintetis Biru</span>
                <span className="text-neutral-300">•</span>
                <span>Jam Buka 08:00–22:00</span>
              </div>
            </div>

            {/* Date & Slot Selection Section */}
            <div className="space-y-5">
              <h3 className="text-base font-bold text-neutral-900">Pilih Jadwal & Slot Waktu</h3>

              {/* 1. Date Selector Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-neutral-700">
                  Tanggal Bermain
                </label>
                <div className="flex items-center gap-2 bg-neutral-50 p-2.5 rounded-lg border border-neutral-300 max-w-xs">
                  <CalendarIcon className="w-4 h-4 text-neutral-500" />
                  <input 
                    type="date" 
                    value={selectedDate}
                    onChange={e => setSelectedDate(e.target.value)}
                    className="bg-transparent text-xs font-semibold text-neutral-900 border-0 p-0 focus:ring-0 w-full"
                  />
                </div>
              </div>

              {/* 2. Slot Selection Grid (Styleguide Section 14) */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <label className="block text-xs font-medium text-neutral-700">
                      Slot Jam Tersedia
                    </label>
                    <p className="text-[11px] text-neutral-500">Klik slot untuk memilih. Klik slot berturut-turut untuk menambah durasi.</p>
                  </div>
                  {/* Status Legend */}
                  <div className="flex items-center gap-3 text-xs text-neutral-500 pt-1 sm:pt-0">
                    <span className="flex items-center gap-1.5 font-normal">
                      <span className="w-2.5 h-2.5 rounded-full bg-white border border-neutral-300"></span> Tersedia
                    </span>
                    <span className="flex items-center gap-1.5 font-normal">
                      <span className="w-2.5 h-2.5 rounded-full bg-brand-600"></span> Terpilih
                    </span>
                    <span className="flex items-center gap-1.5 font-normal">
                      <span className="w-2.5 h-2.5 rounded-full bg-neutral-300"></span> Dibooking
                    </span>
                  </div>
                </div>

                {loadingSlots ? (
                  <div className="text-center py-6 text-neutral-400 text-xs">Memuat jadwal...</div>
                ) : slots.length === 0 ? (
                  <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-600 text-xs">
                    Tidak ada jadwal operasional untuk tanggal ini. Silakan pilih tanggal lain.
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {slots.map(s => {
                      const isAvailable = s.isAvailable !== false && s.status !== 'booked' && s.status !== 'blocked';
                      const isSelected = selectedSlots.includes(s.startTime);

                      let styleClass = "bg-white text-neutral-800 border-neutral-200 hover:border-brand-600 hover:bg-brand-50/50";
                      if (!isAvailable) {
                        styleClass = "bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed line-through";
                      } else if (isSelected) {
                        styleClass = "bg-brand-600 text-white border-brand-600 font-semibold shadow-xs";
                      }

                      return (
                        <button
                          key={s.startTime}
                          type="button"
                          disabled={!isAvailable}
                          onClick={() => handleSlotClick(s)}
                          className={`py-2 px-2 text-xs font-medium rounded-lg border text-center transition-colors ${styleClass}`}
                        >
                          {s.startTime}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Selection Summary Box (Styleguide Section 16) */}
              {selectedSlots.length > 0 && (
                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2 text-xs">
                  <div className="flex justify-between text-neutral-600">
                    <span>Jadwal Terpilih:</span>
                    <span className="font-semibold text-neutral-900">{getStartTime()} – {getEndTime()} WIB ({duration} Jam)</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Tanggal:</span>
                    <span className="font-semibold text-neutral-900">{new Date(selectedDate).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-neutral-200">
                    <span className="font-bold text-neutral-900">Total Pembayaran ({duration} Jam):</span>
                    <span className="text-base text-neutral-900 font-bold">{formatCurrency(150000 * duration)}</span>
                  </div>
                </div>
              )}

              {/* CTA Action Button (Styleguide Section 10) */}
              <Button 
                onClick={handleProceedBooking}
                disabled={selectedSlots.length === 0}
                className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white font-semibold h-11 px-8 text-xs rounded-lg"
              >
                Lanjut Pemesanan <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
