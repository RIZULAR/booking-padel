# TASK.md — Padel Booking System

## Project Goal

Membangun **Padel Booking System** berbasis web yang memungkinkan customer melihat ketersediaan lapangan, memilih jadwal, melakukan booking dan pembayaran, serta memungkinkan staff/admin mengelola operasional venue, booking, pembayaran, dan laporan.

---

# 0. Definition of Done

Sebuah task dianggap selesai jika:

- [ ] Implementasi sudah sesuai acceptance criteria.
- [ ] Tidak ada error/blocker pada flow utama.
- [ ] Input tervalidasi di backend.
- [ ] Authorization sudah diterapkan sesuai role.
- [ ] API memiliki response/error handling yang konsisten.
- [ ] UI memiliki loading, empty, success, dan error state jika relevan.
- [ ] Fitur telah diuji minimal secara manual.
- [ ] Tidak ada secret/API key yang di-hardcode.
- [ ] Database migration/schema sudah sinkron.
- [ ] Dokumentasi endpoint/konfigurasi diperbarui jika relevan.

---

# 1. Project Foundation

## 1.1 Repository & Project Setup

- [ ] Inisialisasi repository Git.
- [ ] Buat struktur project frontend dan backend.
- [ ] Tambahkan `.gitignore`.
- [ ] Tambahkan `.env.example`.
- [ ] Buat README dasar.
- [ ] Tentukan branching strategy.
- [ ] Setup formatter/linter frontend.
- [ ] Setup formatter/linter backend.
- [ ] Setup konfigurasi environment development.
- [ ] Setup konfigurasi database development.

### Acceptance Criteria

- [ ] Frontend dapat dijalankan secara lokal.
- [ ] Backend dapat dijalankan secara lokal.
- [ ] Backend berhasil terhubung ke database.
- [ ] Tidak ada credential production di repository.

---

# 2. Database Design

## 2.1 Users

Buat tabel `users`.

Field minimal:

- [ ] `id`
- [ ] `name`
- [ ] `email`
- [ ] `phone`
- [ ] `password`
- [ ] `role`
- [ ] `created_at`
- [ ] `updated_at`

Role:

- [ ] `customer`
- [ ] `staff`
- [ ] `admin`

## 2.2 Courts

Buat tabel `courts`.

Field:

- [ ] `id`
- [ ] `name`
- [ ] `description`
- [ ] `type`
- [ ] `indoor`
- [ ] `capacity`
- [ ] `status`
- [ ] `created_at`
- [ ] `updated_at`

Status:

- [ ] `active`
- [ ] `maintenance`
- [ ] `inactive`

## 2.3 Court Images

Buat tabel `court_images`.

Field:

- [ ] `id`
- [ ] `court_id`
- [ ] `image_url`
- [ ] timestamps

## 2.4 Operating Hours

Buat tabel `operating_hours`.

Field:

- [ ] `id`
- [ ] `day`
- [ ] `open_time`
- [ ] `close_time`
- [ ] `is_closed`

## 2.5 Pricing

Buat tabel `pricing`.

Field:

- [ ] `id`
- [ ] `court_id`
- [ ] `day_type`
- [ ] `start_time`
- [ ] `end_time`
- [ ] `price`
- [ ] timestamps

## 2.6 Bookings

Buat tabel `bookings`.

Field:

- [ ] `id`
- [ ] `booking_code`
- [ ] `user_id`
- [ ] `court_id`
- [ ] `booking_date`
- [ ] `start_time`
- [ ] `end_time`
- [ ] `duration`
- [ ] `subtotal`
- [ ] `discount`
- [ ] `total`
- [ ] `status`
- [ ] `expired_at`
- [ ] timestamps

Status:

- [ ] `waiting_payment`
- [ ] `reserved`
- [ ] `confirmed`
- [ ] `checked_in`
- [ ] `completed`
- [ ] `cancelled`
- [ ] `expired`

## 2.7 Payments

Buat tabel `payments`.

Field:

- [ ] `id`
- [ ] `booking_id`
- [ ] `payment_gateway`
- [ ] `payment_method`
- [ ] `transaction_id`
- [ ] `amount`
- [ ] `status`
- [ ] `paid_at`
- [ ] timestamps

Status:

- [ ] `pending`
- [ ] `paid`
- [ ] `failed`
- [ ] `expired`
- [ ] `refunded`

## 2.8 Blocked Schedules

Buat tabel `blocked_schedules`.

Field:

- [ ] `id`
- [ ] `court_id`
- [ ] `date`
- [ ] `start_time`
- [ ] `end_time`
- [ ] `reason`
- [ ] timestamps

## 2.9 Database Relations

- [ ] User memiliki banyak booking.
- [ ] Court memiliki banyak booking.
- [ ] Court memiliki banyak images.
- [ ] Court memiliki banyak pricing rules.
- [ ] Booking memiliki payment.
- [ ] Court memiliki banyak blocked schedule.

### Acceptance Criteria

- [ ] Semua migration dapat dijalankan dari database kosong.
- [ ] Foreign key terpasang dengan benar.
- [ ] Index tersedia untuk query booking/availability yang sering digunakan.
- [ ] Seed data development tersedia minimal untuk admin dan beberapa court.

---

# 3. Authentication & Authorization

## 3.1 Register

- [ ] Endpoint register.
- [ ] Validasi nama.
- [ ] Validasi email unik.
- [ ] Validasi nomor WhatsApp.
- [ ] Validasi password.
- [ ] Hash password.
- [ ] Default role `customer`.

## 3.2 Login

- [ ] Endpoint login.
- [ ] Validasi credential.
- [ ] Generate session/token.
- [ ] Return profile user.

## 3.3 Logout

- [ ] Endpoint logout.
- [ ] Revoke session/token.

## 3.4 Current User

- [ ] Endpoint `/api/me`.
- [ ] Return user yang sedang login.

## 3.5 Forgot Password

- [ ] Request reset password.
- [ ] Reset password dengan token.
- [ ] Token memiliki expiration.

## 3.6 Role-Based Access Control

- [ ] Middleware/guard customer.
- [ ] Middleware/guard staff.
- [ ] Middleware/guard admin.
- [ ] Endpoint admin tidak dapat diakses customer.
- [ ] Endpoint staff tidak dapat digunakan customer.

### Acceptance Criteria

- [ ] Customer dapat register/login/logout.
- [ ] Password tidak tersimpan plaintext.
- [ ] Unauthorized request mendapat `401`.
- [ ] Forbidden role mendapat `403`.

---

# 4. Public / Customer Court Module

## 4.1 Court List API

- [ ] `GET /api/courts`
- [ ] Hanya tampilkan court aktif.
- [ ] Support pagination jika diperlukan.
- [ ] Return harga mulai.
- [ ] Return thumbnail/foto utama.

## 4.2 Court Detail API

- [ ] `GET /api/courts/{id}`
- [ ] Return detail court.
- [ ] Return fasilitas.
- [ ] Return images.
- [ ] Return pricing summary.

## 4.3 Court List UI

- [ ] Halaman daftar court.
- [ ] Card nama court.
- [ ] Foto.
- [ ] Indoor/outdoor.
- [ ] Harga mulai.
- [ ] Status.
- [ ] Tombol lihat detail.

## 4.4 Court Detail UI

- [ ] Gallery court.
- [ ] Deskripsi.
- [ ] Fasilitas.
- [ ] Harga.
- [ ] Status.
- [ ] Tombol booking.

### Acceptance Criteria

- [ ] Customer dapat melihat seluruh court aktif.
- [ ] Customer dapat membuka detail court.
- [ ] Court maintenance/inactive tidak dapat dibooking.

---

# 5. Operating Hours & Schedule Rules

## 5.1 Operating Hours Admin

- [ ] CRUD operating hours.
- [ ] Atur jam buka per hari.
- [ ] Atur hari tutup.

## 5.2 Blocked Schedule

- [ ] Admin dapat block jadwal court.
- [ ] Input tanggal.
- [ ] Input start/end time.
- [ ] Input alasan.
- [ ] Block dapat dihapus.

## 5.3 Maintenance Handling

- [ ] Court maintenance tidak menghasilkan availability.
- [ ] Existing booking tidak otomatis hilang ketika court diubah maintenance.

### Acceptance Criteria

- [ ] Slot di luar jam operasional tidak tersedia.
- [ ] Blocked schedule tidak dapat dibooking.
- [ ] Court maintenance tidak dapat dibooking.

---

# 6. Pricing Engine

## 6.1 Pricing Rules

- [ ] Admin dapat membuat pricing berdasarkan court.
- [ ] Support weekday.
- [ ] Support weekend.
- [ ] Support time range.
- [ ] Support peak/off-peak.

## 6.2 Price Calculation Service

- [ ] Hitung harga berdasarkan court.
- [ ] Hitung berdasarkan tanggal.
- [ ] Hitung berdasarkan jam mulai dan selesai.
- [ ] Dapat menghitung booking yang melewati lebih dari satu price range.
- [ ] Backend menjadi source of truth total harga.

### Acceptance Criteria

Contoh:

- [ ] 10:00–11:00 off-peak menggunakan harga off-peak.
- [ ] 19:00–20:00 peak menggunakan harga peak.
- [ ] Client tidak dapat memanipulasi total harga dari frontend.

---

# 7. Availability Engine

> Modul ini adalah core dari sistem booking.

## 7.1 Availability API

Buat:

`GET /api/courts/{id}/availability?date=YYYY-MM-DD`

Return minimal:

- [ ] start_time
- [ ] end_time
- [ ] status
- [ ] price

Status:

- [ ] `available`
- [ ] `reserved`
- [ ] `booked`
- [ ] `maintenance`
- [ ] `closed`

## 7.2 Availability Calculation

Availability harus memperhitungkan:

- [ ] Jam operasional.
- [ ] Existing booking.
- [ ] Temporary reservation.
- [ ] Blocked schedule.
- [ ] Court status.
- [ ] Durasi slot.

## 7.3 Overlap Detection

Gunakan rule overlap:

`requested_start < existing_end AND requested_end > existing_start`

Test kasus:

- [ ] Existing `19:00–21:00`, request `18:00–19:00` → valid.
- [ ] Existing `19:00–21:00`, request `21:00–22:00` → valid.
- [ ] Existing `19:00–21:00`, request `20:00–22:00` → conflict.
- [ ] Existing `19:00–21:00`, request `18:00–20:00` → conflict.
- [ ] Existing `19:00–21:00`, request `19:00–21:00` → conflict.
- [ ] Existing `19:00–21:00`, request `19:30–20:00` → conflict.

### Acceptance Criteria

- [ ] Availability berubah setelah booking sukses.
- [ ] Availability berubah saat slot di-reserve.
- [ ] Slot expired kembali tersedia.
- [ ] Tidak ada slot booking yang overlap.

---

# 8. Booking Engine

## 8.1 Create Booking

Buat:

`POST /api/bookings`

Input minimal:

- [ ] `court_id`
- [ ] `booking_date`
- [ ] `start_time`
- [ ] `duration` atau `end_time`

Backend melakukan:

- [ ] Validasi user.
- [ ] Validasi court.
- [ ] Validasi jam operasional.
- [ ] Validasi blocked schedule.
- [ ] Validasi overlap.
- [ ] Hitung harga.
- [ ] Generate booking code.
- [ ] Set expiration.
- [ ] Simpan booking.

## 8.2 Booking Code

Format contoh:

`PDL-20260830-XXXX`

Requirement:

- [ ] Unique.
- [ ] Mudah dibaca staff.

## 8.3 Temporary Reservation

- [ ] Booking baru mengunci slot sementara.
- [ ] Default timeout 10 menit.
- [ ] `expired_at` disimpan.
- [ ] Slot berstatus reserved selama belum dibayar.
- [ ] Scheduler/job mengubah booking expired.
- [ ] Slot kembali available setelah expired.

## 8.4 Concurrency Protection

Wajib:

- [ ] Database transaction.
- [ ] Lock row/resource yang relevan atau gunakan mekanisme locking lain.
- [ ] Re-check availability di dalam transaction.
- [ ] Jangan percaya availability dari frontend.
- [ ] Race condition test.

### Acceptance Criteria

Jika 2 request mencoba booking court dan waktu yang sama secara hampir bersamaan:

- [ ] Hanya 1 request yang berhasil.
- [ ] Request lainnya mendapat response conflict (`409` direkomendasikan).
- [ ] Tidak terbentuk double booking pada database.

---

# 9. Booking Customer UI

## 9.1 Select Date

- [ ] Date picker.
- [ ] Tidak boleh pilih tanggal yang sudah lewat.

## 9.2 Select Court

- [ ] Tampilkan court tersedia.
- [ ] Tampilkan harga mulai.

## 9.3 Select Time

- [ ] Tampilkan slot.
- [ ] Disable booked/reserved/closed slot.
- [ ] Pilih durasi.
- [ ] Update estimasi harga.

## 9.4 Booking Summary

Tampilkan:

- [ ] Court.
- [ ] Tanggal.
- [ ] Jam.
- [ ] Durasi.
- [ ] Subtotal.
- [ ] Discount jika ada.
- [ ] Total.

## 9.5 Booking Confirmation

- [ ] Tombol lanjut pembayaran.
- [ ] Handle slot yang keburu diambil orang lain.
- [ ] Tampilkan countdown pembayaran jika booking berhasil dibuat.

---

# 10. Payment Integration

## 10.1 Midtrans Configuration

- [ ] Setup server key.
- [ ] Setup client key.
- [ ] Sandbox mode untuk development.
- [ ] Credential hanya disimpan di environment.

## 10.2 Create Payment

- [ ] Backend membuat transaksi Midtrans.
- [ ] Gunakan booking amount dari backend.
- [ ] Simpan external transaction/reference id.
- [ ] Return payment instruction/token ke frontend.

## 10.3 Payment UI

- [ ] Tampilkan metode pembayaran.
- [ ] Support QRIS jika tersedia.
- [ ] Support Virtual Account jika tersedia.
- [ ] Tampilkan status pending.
- [ ] Tampilkan expiration countdown.

## 10.4 Midtrans Webhook

Buat:

`POST /api/payments/webhook`

Webhook wajib:

- [ ] Verifikasi signature.
- [ ] Jangan percaya status dari frontend.
- [ ] Idempotent.
- [ ] Mapping status Midtrans → internal payment status.
- [ ] Update payment.
- [ ] Update booking.

## 10.5 Payment Success

Jika pembayaran sukses:

- [ ] Payment → `paid`.
- [ ] Booking → `confirmed`.
- [ ] Set `paid_at`.
- [ ] Slot tetap locked sebagai booked.

## 10.6 Payment Expired

Jika pembayaran expired:

- [ ] Payment → `expired`.
- [ ] Booking → `expired`.
- [ ] Slot kembali tersedia.

## 10.7 Payment Failed

- [ ] Payment → `failed`.
- [ ] Booking diproses sesuai policy.

### Acceptance Criteria

- [ ] Booking hanya confirmed melalui status pembayaran valid.
- [ ] Manipulasi response frontend tidak bisa membuat booking confirmed.
- [ ] Webhook yang sama dikirim dua kali tidak menimbulkan data ganda.

---

# 11. My Booking

## 11.1 My Booking API

- [ ] `GET /api/bookings`
- [ ] Return hanya booking milik user login.
- [ ] Filter upcoming/completed/cancelled.

## 11.2 Booking Detail API

- [ ] `GET /api/bookings/{id}`
- [ ] Customer hanya bisa melihat booking sendiri.

## 11.3 My Booking UI

Tabs:

- [ ] Upcoming.
- [ ] Completed.
- [ ] Cancelled.

Card:

- [ ] Booking code.
- [ ] Court.
- [ ] Tanggal.
- [ ] Jam.
- [ ] Total.
- [ ] Payment status.
- [ ] Booking status.

## 11.4 Booking Detail UI

- [ ] Booking code.
- [ ] Court.
- [ ] Date/time.
- [ ] Duration.
- [ ] Payment method.
- [ ] Payment status.
- [ ] Booking status.
- [ ] Total.
- [ ] Cancel button jika eligible.

---

# 12. Booking Cancellation

## 12.1 Cancellation Rule

- [ ] Config cancellation cutoff.
- [ ] Default contoh: 6 jam sebelum jadwal.
- [ ] Booking expired/completed tidak dapat dibatalkan.
- [ ] Booking checked-in tidak dapat dibatalkan.

## 12.2 Cancel API

`POST /api/bookings/{id}/cancel`

Backend:

- [ ] Validate ownership.
- [ ] Validate booking status.
- [ ] Validate cancellation cutoff.
- [ ] Update booking status.
- [ ] Trigger refund process jika applicable.

## 12.3 Refund

Untuk MVP dapat dipilih salah satu:

- [ ] Refund manual oleh admin.

Future:

- [ ] Refund otomatis Midtrans.

### Acceptance Criteria

- [ ] User tidak dapat cancel booking milik orang lain.
- [ ] User tidak dapat cancel setelah cancellation cutoff.

---

# 13. Customer Profile

## 13.1 Profile API

- [ ] Get profile.
- [ ] Update name.
- [ ] Update phone.
- [ ] Update email dengan aturan keamanan.
- [ ] Change password.

## 13.2 Profile UI

- [ ] Form profile.
- [ ] Form change password.
- [ ] Validation messages.

---

# 14. Admin Dashboard

## 14.1 Summary Metrics

- [ ] Revenue hari ini.
- [ ] Booking hari ini.
- [ ] Court aktif.
- [ ] Upcoming booking.

## 14.2 Revenue Chart

- [ ] Daily.
- [ ] Weekly.
- [ ] Monthly.

## 14.3 Court Utilization

- [ ] Hitung jumlah jam booked.
- [ ] Bandingkan dengan total operational hours.
- [ ] Tampilkan utilization per court.

### Acceptance Criteria

- [ ] Data dashboard berasal dari transaksi aktual.
- [ ] Customer tidak dapat mengakses endpoint dashboard admin.

---

# 15. Admin Court Management

## 15.1 Court CRUD API

- [ ] `POST /api/admin/courts`
- [ ] `PUT /api/admin/courts/{id}`
- [ ] `DELETE /api/admin/courts/{id}` atau soft delete.
- [ ] Change status court.

## 15.2 Court Management UI

- [ ] Court table/list.
- [ ] Add court.
- [ ] Edit court.
- [ ] Upload image.
- [ ] Set indoor/outdoor.
- [ ] Set status.
- [ ] Delete/deactivate court.

---

# 16. Admin Pricing Management

- [ ] Pricing list.
- [ ] Add pricing rule.
- [ ] Edit pricing rule.
- [ ] Delete pricing rule.
- [ ] Validation time range.
- [ ] Prevent invalid overlapping pricing rules atau tentukan explicit priority.

---

# 17. Admin Booking Management

## 17.1 Booking List

- [ ] Semua booking.
- [ ] Filter date.
- [ ] Filter court.
- [ ] Filter booking status.
- [ ] Filter payment status.
- [ ] Search booking code/customer.

## 17.2 Booking Detail

- [ ] Customer information.
- [ ] Court.
- [ ] Schedule.
- [ ] Payment.
- [ ] Status history jika tersedia.

## 17.3 Admin Actions

- [ ] Cancel booking.
- [ ] Check-in booking.
- [ ] Complete booking.
- [ ] Verifikasi payment manual jika diizinkan policy.

---

# 18. Manual Booking

Staff/admin dapat membuat booking dari dashboard.

Input:

- [ ] Customer name.
- [ ] Customer phone.
- [ ] Court.
- [ ] Date.
- [ ] Start time.
- [ ] Duration.
- [ ] Payment status.
- [ ] Notes.

Requirement:

- [ ] Manual booking menggunakan booking engine yang sama.
- [ ] Manual booking tetap menjalankan overlap validation.
- [ ] Manual booking tercatat pada laporan.

### Acceptance Criteria

- [ ] Booking WhatsApp/walk-in dapat dimasukkan staff.
- [ ] Tidak bisa membuat manual booking yang bentrok.

---

# 19. Staff Module

## 19.1 Staff Access

- [ ] Staff login.
- [ ] Staff melihat jadwal booking.
- [ ] Staff melihat booking detail.
- [ ] Staff membuat manual booking.
- [ ] Staff check-in.
- [ ] Staff complete booking.

## 19.2 Check-In

- [ ] Booking harus confirmed.
- [ ] Staff menekan check-in.
- [ ] Status → `checked_in`.

## 19.3 Complete Booking

- [ ] Booking yang selesai dapat ditandai completed.
- [ ] Status → `completed`.

---

# 20. Customer Management

Admin dapat:

- [ ] Melihat customer list.
- [ ] Search customer.
- [ ] Melihat detail customer.
- [ ] Melihat total booking.
- [ ] Melihat total transaksi.

---

# 21. Reports

## 21.1 Revenue Report

Filter:

- [ ] Daily.
- [ ] Weekly.
- [ ] Monthly.
- [ ] Custom date range.

Metric:

- [ ] Gross revenue.
- [ ] Paid bookings.
- [ ] Refund jika tersedia.

## 21.2 Booking Report

- [ ] Total booking.
- [ ] Confirmed.
- [ ] Completed.
- [ ] Cancelled.
- [ ] Expired.

## 21.3 Court Performance

- [ ] Booking count per court.
- [ ] Revenue per court.
- [ ] Court utilization.

## 21.4 Export

Optional MVP:

- [ ] Export CSV.

Future:

- [ ] Export Excel.
- [ ] Export PDF.

---

# 22. Notifications

## 22.1 Booking Created

- [ ] Kirim email setelah booking dibuat.

## 22.2 Payment Success

- [ ] Kirim email setelah pembayaran berhasil.

## 22.3 Cancellation

- [ ] Kirim email setelah booking dibatalkan.

## 22.4 Reminder

- [ ] Reminder 2 jam sebelum booking.

Future:

- [ ] WhatsApp notification.
- [ ] Push notification.

---

# 23. Home Page

## 23.1 Hero

- [ ] Venue name.
- [ ] Tagline.
- [ ] CTA Book Now.
- [ ] Venue image.

## 23.2 Quick Booking

- [ ] Date.
- [ ] Duration.
- [ ] Search available court.

## 23.3 Venue Info

- [ ] Address.
- [ ] Operating hours.
- [ ] Facilities.
- [ ] Starting price.

## 23.4 Facilities

Contoh:

- [ ] Parking.
- [ ] Shower.
- [ ] Locker.
- [ ] Cafe.
- [ ] Racket rental.
- [ ] WiFi.
- [ ] Mushola.

---

# 24. Responsive UI

Test minimal:

- [ ] 360px mobile.
- [ ] 390px mobile.
- [ ] Tablet.
- [ ] Laptop.
- [ ] Desktop.

Pastikan:

- [ ] Navigation responsive.
- [ ] Booking slot mudah dipilih di mobile.
- [ ] Table admin memiliki fallback responsive.
- [ ] Modal tidak overflow.
- [ ] Form tetap usable pada layar kecil.

---

# 25. Loading, Empty & Error State

Untuk setiap halaman data-driven:

- [ ] Loading state.
- [ ] Empty state.
- [ ] API error state.
- [ ] Retry jika relevan.

Untuk form:

- [ ] Disable submit ketika processing.
- [ ] Prevent duplicate submit.
- [ ] Tampilkan validation error.
- [ ] Tampilkan success feedback.

---

# 26. Security

## 26.1 Authentication Security

- [ ] Password hashing.
- [ ] Session/token expiration.
- [ ] Secure cookie jika menggunakan cookie.
- [ ] Logout invalidates session.

## 26.2 Authorization

- [ ] Setiap admin endpoint memiliki authorization.
- [ ] Object-level authorization untuk booking.

## 26.3 Input Validation

- [ ] Semua request backend divalidasi.
- [ ] Jangan percaya harga dari client.
- [ ] Jangan percaya booking status dari client.

## 26.4 Payment Security

- [ ] Midtrans webhook signature verification.
- [ ] Idempotency.
- [ ] Log webhook failure tanpa expose secret.

## 26.5 General Security

- [ ] Rate limit login.
- [ ] Rate limit register.
- [ ] CSRF protection jika relevan.
- [ ] XSS prevention.
- [ ] SQL injection prevention.
- [ ] Secure headers.
- [ ] CORS dikonfigurasi sesuai environment.

---

# 27. Background Jobs / Scheduler

- [ ] Expire unpaid booking.
- [ ] Expire stale reservation.
- [ ] Send booking reminder.
- [ ] Retry notification jika diperlukan.

Job expiration:

- [ ] Query booking `waiting_payment/reserved`.
- [ ] `expired_at < now`.
- [ ] Update booking → expired.
- [ ] Update payment → expired jika relevan.

---

# 28. API Error Convention

Tentukan response standard.

Contoh success:

```json
{
  "success": true,
  "data": {}
}
```

Contoh validation:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {}
}
```

Gunakan status code:

- [ ] `200` success.
- [ ] `201` created.
- [ ] `400` invalid request.
- [ ] `401` unauthenticated.
- [ ] `403` unauthorized.
- [ ] `404` not found.
- [ ] `409` booking conflict.
- [ ] `422` validation error.
- [ ] `500` internal error.

---

# 29. Logging & Monitoring

- [ ] Log server error.
- [ ] Log payment webhook.
- [ ] Log booking conflict untuk debugging.
- [ ] Jangan log password/token/secret.
- [ ] Tambahkan error tracking ketika production jika tersedia.

---

# 30. Testing

## 30.1 Authentication Tests

- [ ] Register berhasil.
- [ ] Duplicate email ditolak.
- [ ] Login benar.
- [ ] Login salah.
- [ ] Unauthorized admin endpoint.

## 30.2 Court Tests

- [ ] Court aktif tampil.
- [ ] Court inactive tidak available.
- [ ] Court maintenance tidak bisa dibooking.

## 30.3 Availability Tests

- [ ] Jam kosong available.
- [ ] Booked slot unavailable.
- [ ] Reserved slot unavailable.
- [ ] Blocked slot unavailable.
- [ ] Closed hours unavailable.

## 30.4 Booking Tests

- [ ] Create booking sukses.
- [ ] Booking di luar operational hour ditolak.
- [ ] Overlap ditolak.
- [ ] Booking court maintenance ditolak.
- [ ] Price dihitung backend.

## 30.5 Concurrency Tests

Simulasikan dua request bersamaan:

- [ ] Court sama.
- [ ] Tanggal sama.
- [ ] Waktu sama.

Expected:

- [ ] Request A success.
- [ ] Request B conflict.
- [ ] Database hanya memiliki satu booking aktif.

## 30.6 Payment Tests

- [ ] Create payment.
- [ ] Pending.
- [ ] Paid webhook.
- [ ] Expired webhook.
- [ ] Duplicate webhook.
- [ ] Invalid signature.

## 30.7 Cancellation Tests

- [ ] Cancel sebelum cutoff.
- [ ] Cancel setelah cutoff ditolak.
- [ ] Cancel booking milik orang lain ditolak.

---

# 31. Seed Data Development

Buat seed:

## Admin

- [ ] 1 admin.

## Staff

- [ ] Minimal 1 staff.

## Customer

- [ ] Minimal 2 customer.

## Courts

- [ ] Court A.
- [ ] Court B.
- [ ] Court C.

## Pricing

- [ ] Weekday off-peak.
- [ ] Weekday peak.
- [ ] Weekend.

## Operating Hours

- [ ] Senin–Minggu.

---

# 32. Deployment

## 32.1 Frontend

- [ ] Production build berhasil.
- [ ] Environment production.
- [ ] Deploy frontend.

## 32.2 Backend

- [ ] Production environment.
- [ ] Database migration.
- [ ] Queue worker.
- [ ] Scheduler.
- [ ] Storage configuration.
- [ ] HTTPS.

## 32.3 Database

- [ ] Production database.
- [ ] Backup policy.
- [ ] Restricted database access.

## 32.4 Midtrans

- [ ] Sandbox diuji.
- [ ] Production credential dikonfigurasi saat go-live.
- [ ] Production webhook URL.
- [ ] Webhook HTTPS.

---

# 33. MVP Release Checklist

## Customer Flow

- [ ] Register.
- [ ] Login.
- [ ] Browse courts.
- [ ] View availability.
- [ ] Select schedule.
- [ ] Create booking.
- [ ] Pay booking.
- [ ] Booking confirmed.
- [ ] View My Booking.
- [ ] Cancel eligible booking.

## Staff Flow

- [ ] Login.
- [ ] View schedule.
- [ ] Manual booking.
- [ ] Check-in.
- [ ] Complete booking.

## Admin Flow

- [ ] Login.
- [ ] Dashboard.
- [ ] CRUD court.
- [ ] Operating hours.
- [ ] Block schedule.
- [ ] Pricing.
- [ ] Manage bookings.
- [ ] Manage customers.
- [ ] Reports.

## Technical

- [ ] Double booking prevention tested.
- [ ] Payment webhook tested.
- [ ] Reservation expiration tested.
- [ ] Authorization tested.
- [ ] Responsive UI tested.
- [ ] Error handling tested.
- [ ] Production deployment tested.

---

# 34. Recommended Implementation Order

Kerjakan secara berurutan untuk mengurangi rework.

## Sprint 1 — Foundation

- [x] Project setup.
- [x] Database schema.
- [x] Authentication.
- [x] RBAC.
- [x] Seed data.

## Sprint 2 — Court & Schedule

- [x] Court CRUD.
- [x] Court public pages.
- [x] Operating hours.
- [x] Blocked schedule.
- [x] Pricing engine.

## Sprint 3 — Booking Core

- [x] Availability engine.
- [x] Overlap detection.
- [x] Create booking.
- [x] Temporary reservation.
- [x] Booking expiration.
- [x] Concurrency protection.

## Sprint 4 — Customer Booking UI

- [x] Date selection.
- [x] Court selection.
- [x] Slot selection.
- [x] Booking summary.
- [x] Booking confirmation.

## Sprint 5 — Payment

- [x] Midtrans integration.
- [x] Payment page.
- [x] Webhook.
- [x] Payment states.
- [x] Expiration handling.

## Sprint 6 — Customer Account

- [x] My Booking.
- [x] Booking detail.
- [x] Cancellation.
- [x] Profile.

## Sprint 7 — Staff & Admin

- [x] Dashboard.
- [x] Booking management.
- [x] Manual booking.
- [x] Check-in.
- [x] Customer management.
- [x] Reports.

## Sprint 8 — Production Readiness

- [ ] Testing.
- [ ] Security review.
- [ ] Performance review.
- [ ] Responsive QA.
- [ ] Logging.
- [ ] Deployment.
- [ ] Production smoke test.

---

# 35. Out of Scope for Initial MVP

Jangan implementasikan terlebih dahulu kecuali core MVP sudah stabil:

- [ ] Membership.
- [ ] Loyalty point.
- [ ] Matchmaking.
- [ ] Tournament.
- [ ] League.
- [ ] Player ranking.
- [ ] Split payment.
- [ ] Coach marketplace.
- [ ] Dynamic pricing otomatis.
- [ ] Multi venue.
- [ ] Multi branch.
- [ ] Mobile native app.
- [ ] Push notification.
- [ ] Complex promo engine.

---

# 36. Critical Rules for AI Coding Agent

Jika project dikerjakan menggunakan AI coding agent, ikuti aturan berikut:

1. Jangan mengubah arsitektur besar tanpa alasan teknis yang jelas.
2. Jangan mengimplementasikan fitur future scope sebelum MVP core selesai.
3. Backend adalah source of truth untuk harga, availability, dan booking status.
4. Jangan pernah mengandalkan frontend untuk mencegah double booking.
5. Gunakan database transaction untuk create booking.
6. Re-check availability di dalam transaction.
7. Semua admin/staff endpoint wajib memiliki authorization.
8. Semua external payment callback wajib diverifikasi.
9. Jangan hardcode secret.
10. Jangan menghapus migration/data tanpa instruksi eksplisit.
11. Jangan membuat duplicate service/function jika logic dapat digunakan ulang.
12. Selalu handle loading/error/empty state pada UI.
13. Setelah menyelesaikan task, jalankan test yang relevan.
14. Jangan menandai task selesai jika acceptance criteria belum terpenuhi.
15. Jika menemukan konflik dengan PRD, prioritaskan integritas booking dan keamanan data.

---

# 37. MVP Final Acceptance Criteria

Project dinyatakan siap MVP jika seluruh kondisi berikut terpenuhi:

- [ ] Customer dapat register dan login.
- [ ] Customer dapat melihat court.
- [ ] Customer dapat melihat jadwal kosong.
- [ ] Customer dapat memilih slot.
- [ ] Customer dapat membuat booking.
- [ ] Booking menghasilkan temporary reservation.
- [ ] Double booking tidak dapat terjadi.
- [ ] Backend menghitung harga.
- [ ] Customer dapat membayar menggunakan Midtrans.
- [ ] Webhook dapat mengonfirmasi pembayaran.
- [ ] Booking unpaid dapat expired otomatis.
- [ ] Customer dapat melihat riwayat booking.
- [ ] Customer dapat membatalkan booking sesuai policy.
- [ ] Staff dapat membuat manual booking.
- [ ] Staff dapat melakukan check-in.
- [ ] Admin dapat CRUD court.
- [ ] Admin dapat mengatur operating hours.
- [ ] Admin dapat mengatur pricing.
- [ ] Admin dapat block schedule.
- [ ] Admin dapat melihat seluruh booking.
- [ ] Admin dapat melihat laporan dasar.
- [ ] Role/authorization berjalan benar.
- [ ] UI responsive.
- [ ] Core API memiliki automated test.
- [ ] Concurrency booking telah diuji.
- [ ] Payment webhook telah diuji.
- [ ] Production deployment berhasil.
