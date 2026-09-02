import prisma from '../db/prisma';

export const checkAvailability = async (courtId: string, dateStr: string) => {
  const targetDate = new Date(dateStr);
  const dayOfWeek = targetDate.getDay();

  // 1. Get operating hours
  let hours = await prisma.operatingHours.findFirst({
    where: { day: dayOfWeek }
  });

  if (!hours) {
    hours = { id: 'default', day: dayOfWeek, openTime: '08:00', closeTime: '22:00', isClosed: false };
  }

  if (hours.isClosed) {
    return []; // Closed on this day
  }

  // 2. Get blocked schedules for this date
  const blocks = await prisma.blockedSchedule.findMany({
    where: {
      courtId,
      date: {
        gte: new Date(targetDate.setHours(0, 0, 0, 0)),
        lt: new Date(targetDate.setHours(23, 59, 59, 999))
      }
    }
  });

  // 3. Get existing bookings for this date that are not cancelled or expired
  const targetDateStart = new Date(dateStr);
  targetDateStart.setHours(0, 0, 0, 0);
  const targetDateEnd = new Date(dateStr);
  targetDateEnd.setHours(23, 59, 59, 999);

  const bookings = await prisma.booking.findMany({
    where: {
      courtId,
      bookingDate: {
        gte: targetDateStart,
        lt: targetDateEnd
      },
      status: {
        in: ['waiting_payment', 'paid', 'completed']
      }
    }
  });

  // Generate slots (Assuming 60 min intervals starting from openTime)
  const slots = [];
  let current = parseTime(hours.openTime);
  const end = parseTime(hours.closeTime);

  while (current < end) {
    const slotStart = formatTime(current);
    const slotEndMinutes = current + 60;
    const slotEnd = formatTime(slotEndMinutes);

    if (slotEndMinutes > end) break; // Slot exceeds closing time

    // Check overlaps
    const isBlocked = blocks.some(b => isOverlap(slotStart, slotEnd, b.startTime, b.endTime));
    const isBooked = bookings.some(b => isOverlap(slotStart, slotEnd, b.startTime, b.endTime));

    let status = 'available';
    if (isBlocked) status = 'blocked';
    else if (isBooked) status = 'booked';

    slots.push({
      startTime: slotStart,
      endTime: slotEnd,
      isAvailable: status === 'available',
      status
    });

    current += 60; // Next 60 min
  }

  return slots;
};

export const calculatePrice = async (courtId: string, dateStr: string, startTime: string, endTime: string): Promise<number> => {
  const targetDate = new Date(dateStr);
  const isWeekend = targetDate.getDay() === 0 || targetDate.getDay() === 6;
  const dayType = isWeekend ? 'weekend' : 'weekday';

  const pricingRules = await prisma.pricing.findMany({
    where: { courtId, dayType }
  });

  if (pricingRules.length === 0) {
    return 150000; // Fallback default price if no rules set
  }

  // Calculate based on exact overlapping duration with pricing rules
  let total = 0;
  const startMins = parseTime(startTime);
  const endMins = parseTime(endTime);

  for (const rule of pricingRules) {
    const ruleStart = parseTime(rule.startTime);
    const ruleEnd = parseTime(rule.endTime);

    // Find overlap duration
    const overlapStart = Math.max(startMins, ruleStart);
    const overlapEnd = Math.min(endMins, ruleEnd);

    if (overlapStart < overlapEnd) {
      const hours = (overlapEnd - overlapStart) / 60;
      total += rule.price * hours;
    }
  }

  // If some part of the duration was not covered by any rule, we could apply a fallback, 
  // but for simplicity, we assume pricing rules cover the entire operating hours.
  if (total === 0 && pricingRules.length > 0 && pricingRules[0]) {
      // Fallback to the first matching rule price or standard average
      total = pricingRules[0].price * ((endMins - startMins) / 60);
  }

  return total;
};

// --- Helpers ---
function parseTime(timeStr: string): number {
  const parts = timeStr.split(':').map(Number);
  const h = parts[0] ?? 0;
  const m = parts[1] ?? 0;
  return h * 60 + m;
}

function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

function isOverlap(start1: string, end1: string, start2: string, end2: string): boolean {
  const s1 = parseTime(start1);
  const e1 = parseTime(end1);
  const s2 = parseTime(start2);
  const e2 = parseTime(end2);
  return Math.max(s1, s2) < Math.min(e1, e2);
}
