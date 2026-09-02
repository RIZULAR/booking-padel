# PRODUCT REQUIREMENTS DOCUMENT (PRD)
## Sistem Booking Lapangan Padel

**Versi:** 1.0  
**Status:** Draft MVP  
**Platform:** Web Application  
**Target Pengguna:** Pemain Padel, Staff Venue, Admin/Pemilik Venue

---

## Technical Stack

### Frontend
- React
- Vite
- Tailwind CSS

### Backend
- Node.js
- Express.js
- REST API

### Database
- Supabase PostgreSQL

### Authentication
- Supabase Auth

### Storage
- Supabase Storage

### Payment
- Midtrans

# 1. Product Overview

## 1.1 Nama Produk

**Padel Booking System**

Nama produk masih bersifat sementara dan dapat diganti sesuai brand venue.

## 1.2 Deskripsi Produk

Padel Booking System adalah aplikasi berbasis web yang digunakan untuk mempermudah pelanggan dalam melihat ketersediaan lapangan padel, memilih jadwal bermain, melakukan booking, melakukan pembayaran, serta melihat riwayat reservasi.

Sistem juga menyediakan dashboard bagi admin atau pengelola venue untuk mengelola lapangan, jadwal operasional, harga sewa, booking pelanggan, pembayaran, serta laporan transaksi.

## 1.3 Latar Belakang

Proses booking lapangan olahraga yang dilakukan melalui WhatsApp atau pencatatan manual memiliki beberapa kekurangan, antara lain:

- Pelanggan harus bertanya terlebih dahulu mengenai jadwal kosong.
- Staff harus mengecek jadwal secara manual.
- Risiko terjadinya double booking.
- Sulit melakukan monitoring pembayaran.
- Riwayat booking tidak terdokumentasi dengan baik.
- Pemilik venue kesulitan melihat laporan pendapatan secara cepat.

Sistem booking online dibuat agar proses reservasi dapat dilakukan secara mandiri oleh pelanggan dan dikelola secara terpusat oleh pengelola venue.

---

# 2. Product Goals

Tujuan utama sistem:

1. Mempermudah pelanggan melakukan booking lapangan.
2. Menampilkan jadwal lapangan secara real-time.
3. Menghindari double booking.
4. Mempermudah pengelolaan pembayaran.
5. Mempermudah admin mengelola lapangan dan jadwal.
6. Menyediakan riwayat transaksi dan booking.
7. Memberikan laporan pendapatan kepada pemilik venue.
8. Mengurangi proses booking melalui WhatsApp atau pencatatan manual.

---

# 3. Product Scope

## 3.1 MVP Scope

Fitur utama MVP:

- Registrasi dan login pengguna.
- Melihat daftar lapangan.
- Melihat detail lapangan.
- Melihat jadwal tersedia.
- Memilih tanggal dan jam bermain.
- Booking lapangan.
- Pembayaran booking.
- Status pembayaran.
- Riwayat booking.
- Pembatalan booking.
- Dashboard admin.
- Manajemen lapangan.
- Manajemen harga.
- Manajemen jadwal.
- Manajemen booking.
- Manajemen pembayaran.
- Laporan transaksi sederhana.

## 3.2 Future Scope

Fitur yang dapat dikembangkan setelah MVP:

- Mobile application.
- Membership.
- Paket langganan.
- Loyalty points.
- Voucher dan promo.
- Dynamic pricing.
- Booking pelatih.
- Booking equipment/raket.
- Tournament management.
- Matchmaking antar pemain.
- Player rating.
- Split payment antar pemain.
- Waiting list.
- Multi venue.
- Multi branch.
- WhatsApp notification.
- Push notification.
- QR Code check-in.
- Google Calendar integration.

---

# 4. User Roles

Sistem memiliki tiga role utama.

## 4.1 Customer

Customer adalah pemain yang melakukan pemesanan lapangan.

Customer dapat:

- Registrasi.
- Login.
- Melihat lapangan.
- Melihat fasilitas.
- Melihat harga.
- Melihat jadwal.
- Melakukan booking.
- Melakukan pembayaran.
- Melihat status booking.
- Membatalkan booking sesuai kebijakan.
- Melihat riwayat booking.

## 4.2 Staff

Staff bertugas mengelola aktivitas operasional venue.

Staff dapat:

- Melihat booking.
- Membuat booking manual.
- Memverifikasi pembayaran manual.
- Melakukan check-in.
- Mengubah status booking.
- Melihat jadwal lapangan.

## 4.3 Admin

Admin memiliki akses penuh terhadap sistem.

Admin dapat:

- Mengelola user.
- Mengelola staff.
- Mengelola lapangan.
- Mengelola jadwal.
- Mengelola harga.
- Mengelola booking.
- Mengelola pembayaran.
- Mengelola promo.
- Melihat dashboard.
- Melihat laporan transaksi.

---

# 5. Main User Flow

Alur utama customer:

**Home → Pilih Tanggal → Lihat Lapangan → Pilih Lapangan → Pilih Jam → Booking → Pembayaran → Booking Confirmed → Datang ke Venue → Check-in → Selesai**

Detail alur:

1. User membuka website.
2. User memilih tanggal bermain.
3. Sistem menampilkan lapangan yang tersedia.
4. User memilih lapangan.
5. Sistem menampilkan jadwal kosong.
6. User memilih jam bermain.
7. User melakukan login jika belum login.
8. User melakukan konfirmasi booking.
9. Sistem membuat booking dengan status `WAITING_PAYMENT`.
10. User melakukan pembayaran.
11. Payment gateway mengirimkan status pembayaran.
12. Sistem mengubah booking menjadi `CONFIRMED`.
13. User mendapatkan detail booking.
14. User datang ke venue.
15. Staff melakukan check-in.
16. Booking berubah menjadi `COMPLETED`.

---

# 6. Authentication

## 6.1 Register

User dapat melakukan registrasi menggunakan:

- Nama.
- Email.
- Nomor WhatsApp.
- Password.
- Konfirmasi password.

Optional:

- Google Authentication.

## 6.2 Login

Login menggunakan:

- Email.
- Password.

Optional:

- Login Google.

## 6.3 Forgot Password

User dapat melakukan reset password melalui email.

---

# 7. Home Page

Homepage menampilkan:

### Hero Section

- Nama venue.
- Tagline.
- Tombol `Book Now`.
- Foto venue.

### Quick Booking

Input:

- Tanggal.
- Durasi.
- Jumlah pemain.

Button:

**Cari Lapangan**

### Venue Information

Menampilkan:

- Alamat.
- Jam operasional.
- Fasilitas.
- Jumlah lapangan.
- Harga mulai.

### Facilities

Contoh:

- Parking.
- Shower.
- Locker.
- Cafe.
- Racket Rental.
- WiFi.
- Mushola.

---

# 8. Courts

## 8.1 Court List

User dapat melihat seluruh lapangan.

Informasi:

- Nama lapangan.
- Foto.
- Jenis lapangan.
- Indoor / Outdoor.
- Harga.
- Status.
- Fasilitas.

Contoh:

**Court A**

- Indoor
- Panoramic Court
- Rp250.000 / jam
- Available

## 8.2 Court Detail

Halaman detail lapangan menampilkan:

- Foto.
- Nama lapangan.
- Deskripsi.
- Jenis court.
- Indoor / outdoor.
- Fasilitas.
- Harga.
- Jadwal.
- Tombol booking.

---

# 9. Availability System

Sistem harus dapat menentukan jadwal lapangan yang tersedia secara otomatis.

Contoh:

**Tanggal: 30 Agustus 2026**

| Jam | Status |
|---|---|
| 07:00–08:00 | Available |
| 08:00–09:00 | Available |
| 09:00–10:00 | Booked |
| 10:00–11:00 | Available |
| 11:00–12:00 | Available |

Slot yang sudah dipesan tidak dapat dipilih pengguna lain.

Status slot:

- Available.
- Reserved.
- Booked.
- Maintenance.
- Closed.

---

# 10. Booking

## 10.1 Booking Form

Data booking:

- Court.
- Tanggal.
- Jam mulai.
- Durasi.
- Jam selesai.
- Harga.
- Nama customer.
- Nomor WhatsApp.

Optional:

- Catatan.

## 10.2 Booking Duration

Contoh durasi:

- 60 menit.
- 90 menit.
- 120 menit.

Admin dapat menentukan durasi minimum booking.

## 10.3 Booking Summary

Sebelum melakukan pembayaran user melihat:

**Court**

Court A

**Tanggal**

30 Agustus 2026

**Waktu**

19:00–21:00

**Durasi**

2 jam

**Harga**

Rp250.000 × 2

**Total**

Rp500.000

Button:

**Lanjut Pembayaran**

---

# 11. Booking Status

Booking menggunakan status berikut:

### WAITING_PAYMENT

Booking sudah dibuat tetapi belum dibayar.

### CONFIRMED

Pembayaran berhasil dan booking telah dikonfirmasi.

### CHECKED_IN

Customer sudah datang ke venue.

### COMPLETED

Booking selesai.

### CANCELLED

Booking dibatalkan.

### EXPIRED

Booking tidak dibayar sampai batas waktu pembayaran.

---

# 12. Temporary Reservation

Untuk mencegah dua user membayar slot yang sama, sistem menggunakan temporary reservation.

Contoh:

User memilih:

Court A  
19:00–20:00

Slot akan dikunci sementara selama:

**10 menit**

Status:

`RESERVED`

Jika pembayaran berhasil:

`RESERVED → BOOKED`

Jika pembayaran tidak dilakukan:

`RESERVED → AVAILABLE`

---

# 13. Double Booking Prevention

Sistem WAJIB mencegah double booking.

Sebelum booking dibuat, backend harus melakukan pengecekan terhadap:

- Court.
- Booking date.
- Start time.
- End time.
- Booking status.

Sistem tidak boleh hanya mengandalkan validasi dari frontend.

Validasi harus dilakukan pada backend dan database.

Contoh konflik:

Booking pertama:

19:00–21:00

User kedua mencoba:

20:00–22:00

Booking harus ditolak karena memiliki waktu yang overlap.

---

# 14. Payment

Sistem mendukung pembayaran online.

Payment Gateway yang dapat digunakan:

**Midtrans**

Metode pembayaran:

- QRIS.
- Virtual Account.
- E-Wallet.
- Bank Transfer.

Status pembayaran:

- Pending.
- Paid.
- Failed.
- Expired.
- Refunded.

---

# 15. Payment Flow

Alur pembayaran:

Booking dibuat

↓

`WAITING_PAYMENT`

↓

Payment Gateway

↓

User melakukan pembayaran

↓

Payment Gateway Webhook

↓

Backend melakukan verifikasi

↓

Payment berhasil

↓

Booking:

`CONFIRMED`

Payment:

`PAID`

---

# 16. Booking Expiration

Booking yang belum dibayar memiliki waktu pembayaran.

Contoh:

**10 menit**

Setelah 10 menit:

Payment:

`EXPIRED`

Booking:

`EXPIRED`

Court slot kembali tersedia.

---

# 17. Cancellation

User dapat membatalkan booking berdasarkan kebijakan venue.

Contoh aturan:

Booking dapat dibatalkan maksimal:

**6 jam sebelum jadwal bermain.**

Status:

`CONFIRMED → CANCELLED`

Refund dapat dilakukan:

- Otomatis.
- Manual oleh admin.

Kebijakan refund harus configurable oleh admin.

---

# 18. My Booking

Customer memiliki halaman:

**My Booking**

Tabs:

- Upcoming.
- Completed.
- Cancelled.

Booking card menampilkan:

- Booking ID.
- Court.
- Tanggal.
- Jam.
- Total harga.
- Payment status.
- Booking status.

Button:

- Detail.
- Cancel booking.

---

# 19. Booking Detail

Detail booking menampilkan:

- Booking ID.
- Court.
- Tanggal.
- Jam.
- Durasi.
- Total.
- Payment method.
- Payment status.
- Booking status.

Optional:

**QR Code Booking**

QR Code dapat digunakan saat customer check-in.

---

# 20. Customer Profile

Customer dapat mengelola:

- Nama.
- Email.
- Nomor WhatsApp.
- Password.
- Foto profil.

---

# 21. Admin Dashboard

Dashboard menampilkan:

### Today's Revenue

Pendapatan hari ini.

### Today's Booking

Jumlah booking hari ini.

### Active Courts

Jumlah lapangan aktif.

### Upcoming Booking

Booking berikutnya.

### Revenue Chart

Pendapatan:

- Harian.
- Mingguan.
- Bulanan.

### Court Utilization

Persentase penggunaan setiap lapangan.

---

# 22. Court Management

Admin dapat:

- Menambahkan court.
- Mengubah court.
- Menghapus court.
- Menonaktifkan court.

Data:

- Court name.
- Description.
- Court type.
- Indoor / outdoor.
- Price.
- Capacity.
- Image.
- Status.

Status:

- Active.
- Maintenance.
- Inactive.

---

# 23. Operating Hours

Admin dapat menentukan jam operasional.

Contoh:

| Hari | Jam |
|---|---|
| Senin | 07:00–23:00 |
| Selasa | 07:00–23:00 |
| Rabu | 07:00–23:00 |
| Kamis | 07:00–23:00 |
| Jumat | 07:00–24:00 |
| Sabtu | 06:00–24:00 |
| Minggu | 06:00–23:00 |

Admin dapat menutup tanggal tertentu.

Contoh:

- Hari libur.
- Maintenance.
- Event.

---

# 24. Pricing Management

Admin dapat menentukan harga berdasarkan waktu.

Contoh:

### Off Peak

07:00–16:00

Rp200.000/jam

### Peak Hour

16:00–23:00

Rp300.000/jam

Harga dapat berbeda berdasarkan:

- Court.
- Hari.
- Jam.
- Weekend.
- Hari libur.

---

# 25. Manual Booking

Admin atau staff dapat membuat booking manual.

Digunakan untuk customer yang melakukan booking melalui:

- WhatsApp.
- Telepon.
- Walk-in.

Input:

- Customer name.
- Phone.
- Court.
- Date.
- Time.
- Duration.
- Payment status.

Dengan demikian booking offline tetap tercatat dalam sistem.

---

# 26. Admin Booking Management

Admin dapat melihat seluruh booking.

Filter:

- Date.
- Court.
- Customer.
- Booking status.
- Payment status.

Admin dapat:

- Melihat detail.
- Membuat booking.
- Mengubah booking.
- Membatalkan booking.
- Check-in customer.
- Menandai booking completed.

---

# 27. Customer Management

Admin dapat melihat customer.

Data:

- Nama.
- Email.
- Nomor WhatsApp.
- Total booking.
- Total transaksi.
- Tanggal registrasi.

---

# 28. Reports

Admin dapat melihat laporan.

### Revenue Report

Menampilkan:

- Revenue hari ini.
- Revenue minggu ini.
- Revenue bulan ini.

### Booking Report

Menampilkan:

- Jumlah booking.
- Booking completed.
- Booking cancelled.
- Booking expired.

### Court Performance

Menampilkan:

- Total booking per court.
- Revenue per court.
- Court utilization.

Filter:

- Hari.
- Minggu.
- Bulan.
- Custom date.

---

# 29. Notification

Customer mendapatkan notifikasi ketika:

### Booking dibuat

"Booking Anda berhasil dibuat. Silakan lakukan pembayaran."

### Payment berhasil

"Pembayaran berhasil. Booking Anda telah dikonfirmasi."

### Booking reminder

Reminder dapat dikirim:

**2 jam sebelum bermain.**

### Booking cancelled

"Booking Anda telah dibatalkan."

Channel:

MVP:

- Email.

Future:

- WhatsApp.
- Push Notification.

---

# 30. Promo Code

Fitur promo dapat ditambahkan pada fase selanjutnya.

Contoh:

`PADEL10`

Discount:

10%

Aturan promo:

- Start date.
- Expired date.
- Minimum transaction.
- Maximum discount.
- Usage limit.

---

# 31. Search & Filter

User dapat melakukan filter lapangan berdasarkan:

- Tanggal.
- Jam.
- Indoor.
- Outdoor.
- Harga.
- Availability.

---

# 32. Database Entities

Database minimal memiliki tabel berikut.

## users

- id
- name
- email
- phone
- password
- role
- created_at
- updated_at

## courts

- id
- name
- description
- type
- indoor
- capacity
- status
- created_at
- updated_at

## court_images

- id
- court_id
- image_url

## operating_hours

- id
- day
- open_time
- close_time

## court_schedules

- id
- court_id
- date
- start_time
- end_time
- status

## pricing

- id
- court_id
- day_type
- start_time
- end_time
- price

## bookings

- id
- booking_code
- user_id
- court_id
- booking_date
- start_time
- end_time
- duration
- subtotal
- discount
- total
- status
- expired_at
- created_at
- updated_at

## payments

- id
- booking_id
- payment_gateway
- payment_method
- transaction_id
- amount
- status
- paid_at
- created_at
- updated_at

## blocked_schedules

- id
- court_id
- date
- start_time
- end_time
- reason

---

# 33. Suggested Database Relationship

```text
User
 |
 | 1:N
 |
Booking
 |
 +------ Court
 |
 +------ Payment
 |
 +------ Promo
```

Court:

```text
Court
 |
 +------ Court Images
 |
 +------ Pricing
 |
 +------ Booking
 |
 +------ Blocked Schedule
```

---

# 34. Main API Requirements

Contoh REST API.

## Authentication

```text
POST /api/register
POST /api/login
POST /api/logout
GET  /api/me
```

## Courts

```text
GET    /api/courts
GET    /api/courts/{id}
POST   /api/admin/courts
PUT    /api/admin/courts/{id}
DELETE /api/admin/courts/{id}
```

## Availability

```text
GET /api/courts/{id}/availability
```

Parameter:

```text
date
```

Contoh:

```text
/api/courts/1/availability?date=2026-08-30
```

## Booking

```text
POST /api/bookings
GET  /api/bookings
GET  /api/bookings/{id}
POST /api/bookings/{id}/cancel
```

## Payment

```text
POST /api/payments
POST /api/payments/webhook
```

## Admin

```text
GET /api/admin/dashboard
GET /api/admin/bookings
GET /api/admin/customers
GET /api/admin/reports
```

---

# 35. Business Rules

## BR-01

Satu lapangan tidak boleh memiliki booking dengan jadwal yang overlap.

## BR-02

Booking belum dianggap confirmed sebelum pembayaran berhasil.

## BR-03

Booking yang belum dibayar akan expired secara otomatis.

## BR-04

Slot booking harus dikunci sementara selama proses pembayaran.

## BR-05

Booking hanya dapat dilakukan pada jam operasional.

## BR-06

Lapangan berstatus maintenance tidak dapat dibooking.

## BR-07

Harga booking dihitung berdasarkan pricing rule yang aktif.

## BR-08

Pembayaran dianggap valid setelah backend menerima dan memverifikasi webhook payment gateway.

## BR-09

Customer tidak dapat melakukan check-in terhadap booking yang belum confirmed.

## BR-10

Admin dapat membuat booking manual.

---

# 36. Non Functional Requirements

## Performance

- Response API normal < 500 ms.
- Availability schedule < 1 detik.
- Website initial load < 3 detik.

## Security

- Password harus di-hash.
- API menggunakan authentication token/session.
- Role Based Access Control.
- Input validation.
- SQL Injection prevention.
- XSS protection.
- CSRF protection jika menggunakan cookie authentication.
- Rate limiting endpoint authentication.
- Payment webhook verification.

## Reliability

Sistem harus memastikan booking tidak mengalami race condition.

Backend harus menggunakan:

- Database transaction.
- Locking atau constraint.
- Server-side validation.

## Responsive Design

Website harus dapat digunakan melalui:

- Desktop.
- Tablet.
- Smartphone.

---

# 37. Role-Based Access Control

| Feature | Customer | Staff | Admin |
|---|:---:|:---:|:---:|
| View courts | ✓ | ✓ | ✓ |
| Create booking | ✓ | ✓ | ✓ |
| View own booking | ✓ | - | ✓ |
| View all booking | - | ✓ | ✓ |
| Manual booking | - | ✓ | ✓ |
| Check-in | - | ✓ | ✓ |
| Manage court | - | - | ✓ |
| Manage pricing | - | - | ✓ |
| Manage staff | - | - | ✓ |
| Reports | - | - | ✓ |

---

# 38. Suggested Pages

## Customer

```text
/
├── Home
├── Courts
│   └── Court Detail
├── Booking
│   ├── Select Schedule
│   ├── Booking Summary
│   └── Payment
├── Booking Success
├── My Booking
│   └── Booking Detail
├── Login
├── Register
└── Profile
```

## Admin

```text
/admin
├── Dashboard
├── Bookings
├── Courts
├── Schedules
├── Pricing
├── Customers
├── Staff
├── Payments
├── Reports
└── Settings
```

---

# Technical Stack

## Frontend
- React
- Vite
- Tailwind CSS
- React Router

## Backend
- Node.js
- Express.js
- REST API

## Database
- Supabase PostgreSQL

## Payment MVP
- QRIS
- Customer melakukan pembayaran QRIS
- Customer mengunggah bukti pembayaran
- Staff/Admin melakukan verifikasi pembayaran

## Architecture

Frontend:
React + Vite

Backend:
Node.js + Express.js

Database:
Supabase PostgreSQL

Architecture flow:

React
↓
Express REST API
↓
Supabase PostgreSQL

Frontend tidak melakukan operasi booking secara langsung ke database.

Express menjadi source of truth untuk:
- authentication
- authorization
- booking
- availability
- pricing
- payment verification
- double-booking prevention

# 40. Recommended Architecture

```text
Customer
   ↓
Frontend
React / Next.js
   ↓
REST API
   ↓
Laravel Backend
   ↓
PostgreSQL
   ↓
Payment Gateway
Midtrans
```

Payment:

```text
Customer
   ↓
Frontend
   ↓
Backend
   ↓
Midtrans

Midtrans
   ↓
Webhook
   ↓
Backend
   ↓
Update Payment
   ↓
Update Booking
```

---

# 41. MVP Development Priority

## Phase 1 — Foundation

- Project setup.
- Database.
- Authentication.
- Role & permission.

## Phase 2 — Court Management

- CRUD court.
- Court images.
- Operating hours.
- Pricing.

## Phase 3 — Booking Engine

- Availability.
- Schedule.
- Booking.
- Temporary reservation.
- Double booking prevention.

## Phase 4 — Payment

- Midtrans.
- Payment status.
- Webhook.
- Booking expiration.

## Phase 5 — Customer Features

- My booking.
- Booking detail.
- Cancellation.
- Profile.

## Phase 6 — Admin

- Dashboard.
- Booking management.
- Manual booking.
- Customer management.

## Phase 7 — Reports

- Revenue.
- Booking statistics.
- Court utilization.

## Phase 8 — QA

- Unit testing.
- API testing.
- Integration testing.
- Booking concurrency testing.
- Payment testing.
- Responsive testing.

---

# 42. MVP Acceptance Criteria

Produk dapat dianggap MVP selesai apabila:

1. Customer dapat register dan login.
2. Customer dapat melihat seluruh lapangan.
3. Customer dapat memilih tanggal bermain.
4. Sistem dapat menampilkan slot kosong.
5. Customer dapat memilih slot.
6. Customer dapat membuat booking.
7. Tidak terjadi double booking.
8. Customer dapat melakukan pembayaran.
9. Payment webhook dapat mengubah status booking.
10. Booking yang tidak dibayar dapat expired.
11. Customer dapat melihat riwayat booking.
12. Admin dapat CRUD lapangan.
13. Admin dapat mengatur harga.
14. Admin dapat melihat seluruh booking.
15. Admin dapat membuat booking manual.
16. Staff/admin dapat melakukan check-in.
17. Admin dapat melihat pendapatan.
18. Website berjalan responsif pada mobile dan desktop.

---

# 43. Success Metrics

Beberapa metric yang dapat digunakan:

### Booking Conversion Rate

Persentase user yang menyelesaikan booking setelah melihat availability.

### Payment Success Rate

Persentase booking yang berhasil dibayar.

### Court Utilization

Persentase jam operasional lapangan yang terisi booking.

### Online Booking Percentage

Persentase booking melalui sistem dibandingkan manual.

### Cancellation Rate

Persentase booking yang dibatalkan.

---

# 44. Future Roadmap

Setelah MVP stabil, pengembangan dapat dilanjutkan menjadi platform padel yang lebih lengkap.

## Phase 2

- Promo.
- Membership.
- Voucher.
- Racket rental.
- Coach booking.
- WhatsApp notification.

## Phase 3

- Mobile application.
- QR check-in.
- Loyalty points.
- Split payment.
- Matchmaking.

## Phase 4

- Multi venue.
- Multi branch.
- Tournament.
- League.
- Ranking pemain.

Pada tahap ini sistem dapat berkembang dari sekadar **Court Booking System** menjadi **Padel Venue Management Platform**.