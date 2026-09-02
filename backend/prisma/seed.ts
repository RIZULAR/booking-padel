import 'dotenv/config'
import prisma from '../src/db/prisma'
import bcrypt from 'bcryptjs'

async function main() {
  const hash = await bcrypt.hash('password123', 10)
  
  await prisma.user.upsert({
    where: { email: 'admin@padel.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@padel.com',
      phone: '081234567890',
      password: hash,
      role: 'admin'
    }
  })

  await prisma.user.upsert({
    where: { email: 'staff@padel.com' },
    update: {},
    create: {
      name: 'Staff User',
      email: 'staff@padel.com',
      phone: '081234567891',
      password: hash,
      role: 'staff'
    }
  })

  await prisma.user.upsert({
    where: { email: 'customer1@padel.com' },
    update: {},
    create: {
      name: 'Customer 1',
      email: 'customer1@padel.com',
      phone: '081234567892',
      password: hash,
      role: 'customer'
    }
  })

  await prisma.user.upsert({
    where: { email: 'customer2@padel.com' },
    update: {},
    create: {
      name: 'Customer 2',
      email: 'customer2@padel.com',
      phone: '081234567893',
      password: hash,
      role: 'customer'
    }
  })

  // Clean up duplicate courts first
  await prisma.courtImage.deleteMany({});
  await prisma.pricing.deleteMany({});
  await prisma.blockedSchedule.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.court.deleteMany({});

  const courtA = await prisma.court.create({
    data: {
      name: 'Court A - Center Court',
      description: 'Indoor padel court dengan standar kompetisi WPT dan penerangan LED Pro.',
      type: 'Double',
      indoor: true,
      capacity: 4,
      status: 'active',
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=800&q=80' }
        ]
      }
    }
  })

  const courtB = await prisma.court.create({
    data: {
      name: 'Court B - Panoramic Arena',
      description: 'Outdoor padel court dengan pemandangan terbuka dan sirkulasi udara segar.',
      type: 'Double',
      indoor: false,
      capacity: 4,
      status: 'active',
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=800&q=80' }
        ]
      }
    }
  })

  const courtC = await prisma.court.create({
    data: {
      name: 'Court C - VIP Arena',
      description: 'Premium indoor court dilengkapi dengan fasilitas VIP Lounge private.',
      type: 'Double',
      indoor: true,
      capacity: 4,
      status: 'active',
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80' }
        ]
      }
    }
  })

  // Operating Hours (Mon - Sun: 08:00 - 22:00)
  for (let d = 0; d <= 6; d++) {
    const existing = await prisma.operatingHours.findFirst({ where: { day: d } });
    if (!existing) {
      await prisma.operatingHours.create({
        data: { day: d, openTime: '08:00', closeTime: '22:00', isClosed: false }
      });
    }
  }

  // Pricing rules for Court A, B, C
  const courts = [courtA, courtB, courtC];
  for (const c of courts) {
    const existingPricing = await prisma.pricing.findFirst({ where: { courtId: c.id } });
    if (!existingPricing) {
      await prisma.pricing.create({
        data: { courtId: c.id, dayType: 'weekday', startTime: '08:00', endTime: '17:00', price: 120000 }
      });
      await prisma.pricing.create({
        data: { courtId: c.id, dayType: 'weekday', startTime: '17:00', endTime: '22:00', price: 180000 }
      });
      await prisma.pricing.create({
        data: { courtId: c.id, dayType: 'weekend', startTime: '08:00', endTime: '22:00', price: 200000 }
      });
    }
  }

  console.log('Seed data created')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
