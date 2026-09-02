# STAFF-FLOW.md — Padel Booking System

Dokumen ini mengatur seluruh perilaku role Staff pada Padel Booking System.

Gunakan bersama:

- `PRODUCT REQUIREMENTS DOCUMENT` → requirement dan business rules
- `styleguide.md` → visual dan UI rules
- `task.md` → urutan implementasi
- `app-flow.md` → flow aplikasi umum
- `admin-flow.md` → referensi admin
- `staff-flow.md` → flow khusus Staff

Jika ada konflik:
1. Business rule mengikuti PRD.
2. Visual mengikuti `styleguide.md`.
3. Urutan pengerjaan mengikuti `task.md`.
4. Flow umum mengikuti `app-flow.md`.
5. Perilaku Staff mengikuti `staff-flow.md`.

---

# 1. Staff Role

Staff adalah role operasional venue.

Staff dapat:

- login
- melihat dashboard operasional
- melihat booking hari ini
- melihat semua booking sesuai kebutuhan operasional
- melihat detail booking
- membuat manual booking
- memverifikasi pembayaran QRIS jika diberi akses
- check-in customer
- menandai booking selesai
- melihat jadwal court
- melihat status court
- membantu customer saat walk-in

Staff tidak dapat:

- mengelola staff lain
- mengubah role user
- mengubah settings global
- mengubah konfigurasi pembayaran
- mengubah pricing rule jika tidak diberi permission
- menghapus court
- melihat advanced report sensitif
- mengubah admin account
- mengubah sistem authorization

---

# 2. Staff Login

Route:

```text
/login
```

Flow:

```text
Staff input email + password
        ↓
Validate credential
        ↓
Get user role
        ↓
role = staff?
    ├── YES → /staff
    └── NO  → redirect sesuai role
```

Role redirect:

```text
customer → /
staff    → /staff
admin    → /admin
```

Jika staff sudah login lalu membuka `/login`:

```text
redirect → /staff
```

---

# 3. Staff Layout

Desktop:

```text
┌───────────────────────────────────────────────┐
│ Sidebar │ Topbar                              │
│         ├─────────────────────────────────────│
│         │ Content                             │
└───────────────────────────────────────────────┘
```

Sidebar:

```text
Dashboard
Bookings
Manual Booking
Schedule
Payments

────────────
Profile
Back to Customer Site
Logout
```

Mobile:

```text
Topbar
├── menu button
├── page title
└── profile
```

Sidebar berubah menjadi Sheet/Drawer.

---

# 4. Staff Dashboard

Route:

```text
/staff
```

Dashboard staff fokus operasional hari ini.

Metric utama:

```text
Booking Hari Ini
Booking Berikutnya
Pending Verification
Court Aktif
```

Contoh:

```text
Booking Hari Ini
18

Booking Berikutnya
19:00 — Court A

Pending Verification
4

Court Aktif
3 / 3
```

Jangan tampilkan revenue analytics besar jika staff tidak memerlukannya.

---

# 5. Today Bookings

Section:

```text
Booking Hari Ini
```

Tampilkan:

```text
Time
Customer
Court
Status
Action
```

Contoh:

```text
19:00–21:00
Albar
Court A
Confirmed
Check In
```

Urutan:

```text
booking terdekat
→ booking setelahnya
→ completed paling bawah
```

---

# 6. Next Booking

Tampilkan booking terdekat:

```text
Court A
19:00–21:00

Customer:
Albar

Status:
Confirmed
```

Actions:

```text
View Detail
Check In
```

Jika booking sudah checked-in:

```text
Complete
```

---

# 7. Staff Booking Management

Route:

```text
/staff/bookings
```

Table/List:

```text
Booking Code
Customer
Court
Schedule
Payment
Status
Action
```

Filter:

```text
Date
Court
Booking Status
Payment Status
Search
```

Search:

```text
booking code
customer name
phone
```

Default date:

```text
today
```

Staff tetap dapat memilih tanggal lain jika diperlukan.

---

# 8. Booking Status

Status:

```text
waiting_payment
pending_verification
confirmed
checked_in
completed
cancelled
expired
```

Staff action matrix:

| Status | View | Verify Payment | Check In | Complete | Cancel |
|---|---:|---:|---:|---:|---:|
| Waiting Payment | ✓ | - | - | - | - |
| Pending Verification | ✓ | ✓ | - | - | - |
| Confirmed | ✓ | - | ✓ | - | limited |
| Checked In | ✓ | - | - | ✓ | - |
| Completed | ✓ | - | - | - | - |
| Cancelled | ✓ | - | - | - | - |
| Expired | ✓ | - | - | - | - |

Cancellation oleh staff sebaiknya terbatas.

Untuk MVP:
- staff tidak melakukan refund
- staff tidak membatalkan booking confirmed tanpa alasan
- jika pembatalan sensitif, arahkan ke admin

---

# 9. Booking Detail

Route:

```text
/staff/bookings/:id
```

Tampilkan:

```text
Booking Information
Customer Information
Court Information
Payment Information
Status
Operational Actions
```

Booking:

```text
Booking Code
Date
Start Time
End Time
Duration
Status
```

Customer:

```text
Name
Phone
Email
```

Court:

```text
Court Name
Court Type
```

Payment:

```text
Amount
Method
Status
Proof
```

---

# 10. Check-In Flow

Check-in hanya boleh jika:

```text
booking.status = confirmed
```

Flow:

```text
Staff buka Booking Detail
        ↓
Klik Check In
        ↓
Confirmation
        ↓
Update booking
        ↓
status = checked_in
```

Confirmation:

```text
Check-in customer?

Pastikan customer sudah datang ke venue.
```

Buttons:

```text
Batal
Check In
```

---

# 11. Complete Booking

Tampilkan hanya jika:

```text
booking.status = checked_in
```

Flow:

```text
Staff klik Complete
       ↓
Confirmation
       ↓
booking → completed
```

Message:

```text
Tandai booking selesai?
```

Tidak perlu meminta alasan.

---

# 12. Manual Booking

Route:

```text
/staff/manual-booking
```

Digunakan untuk:

```text
WhatsApp booking
Walk-in
Telephone booking
```

Fields:

```text
Customer Name
Phone
Court
Date
Start Time
Duration
Payment Status
Notes
```

Optional:

```text
Email
```

Flow:

```text
Input customer
↓
Pilih court
↓
Pilih tanggal
↓
Load availability
↓
Pilih slot
↓
Hitung harga
↓
Review
↓
Create Booking
```

---

# 13. Existing Customer Search

Pada manual booking, staff dapat mencari customer:

```text
Name
Phone
Email
```

Jika ditemukan:

```text
Select Customer
```

Jika tidak:

```text
Continue as Walk-in Customer
```

Jangan memaksa staff membuat akun customer terlebih dahulu untuk booking walk-in.

---

# 14. Manual Booking Rules

Manual booking tetap harus mengikuti:

- operating hours
- blocked schedule
- court status
- overlap validation
- pricing rules
- double-booking prevention

Manual booking tidak boleh bypass booking engine.

---

# 15. Manual Booking Payment

Pilihan payment status:

```text
unpaid
paid
```

Jika:

```text
paid
```

staff wajib mencatat:

```text
payment method
```

MVP:

```text
qris
cash
```

Optional:

```text
transfer
```

Jika pembayaran manual dicatat paid:

```text
booking → confirmed
```

Jika unpaid:

```text
booking → waiting_payment
```

---

# 16. Walk-In Booking Flow

Contoh:

```text
Customer datang langsung
        ↓
Staff buka Manual Booking
        ↓
Pilih court & slot
        ↓
Customer bayar
        ↓
Create booking
        ↓
booking = confirmed
        ↓
Check In
```

Untuk walk-in yang langsung bermain, staff boleh:

```text
Create Booking
→ Confirm
→ Check In
```

tetapi tetap sebagai dua state yang jelas.

---

# 17. Schedule Page

Route:

```text
/staff/schedule
```

Tujuan:

- melihat court mana yang sedang digunakan
- melihat booking berikutnya
- melihat slot kosong
- melihat maintenance / blocked slot

View:

```text
Day View
```

Contoh:

```text
           Court A       Court B       Court C

07:00      Available     Booked        Available
08:00      Booked        Booked        Available
09:00      Booked        Available     Maintenance
10:00      Available     Available     Maintenance
```

---

# 18. Schedule Interactions

Klik booking:

```text
Open Booking Detail
```

Klik available slot:

```text
Create Manual Booking
```

Klik maintenance:

```text
View reason
```

Staff tidak dapat mengubah operating hours dari halaman ini.

---

# 19. Court Status

Staff dapat melihat:

```text
active
maintenance
inactive
```

Jika court maintenance:

```text
booking baru disabled
```

Staff dapat melihat alasan maintenance jika tersedia.

---

# 20. Payment Verification

Route:

```text
/staff/payments
```

Jika staff diberikan permission verifikasi.

Tabs:

```text
Pending Verification
Approved
Rejected
```

Table:

```text
Booking Code
Customer
Amount
Submitted At
Status
Action
```

---

# 21. Payment Detail

Route:

```text
/staff/payments/:id
```

Tampilkan:

```text
Payment Proof
Booking Info
Customer
Amount
Submitted At
```

Actions:

```text
Approve
Reject
```

---

# 22. Approve Payment

Flow:

```text
Staff buka Payment
       ↓
Lihat bukti
       ↓
Approve
       ↓
Confirmation
       ↓
payment → paid
booking → confirmed
```

Message:

```text
Verifikasi pembayaran ini?
```

---

# 23. Reject Payment

Flow:

```text
Reject
 ↓
Select reason
 ↓
Confirm
 ↓
payment → rejected
```

Reasons:

```text
Nominal tidak sesuai
Bukti tidak terbaca
Transaksi tidak ditemukan
Bukti tidak valid
Lainnya
```

Customer harus dapat melihat alasan rejection.

---

# 24. Verification Safety

Jika payment sudah berubah status sebelum staff submit:

```text
payment already verified
```

UI:

```text
Pembayaran ini sudah diverifikasi oleh pengguna lain.
```

Refresh data.

Jangan overwrite status terbaru.

---

# 25. Staff Notifications

Topbar notification:

```text
New Booking
New Payment Proof
Upcoming Booking
Booking Starting Soon
```

MVP tidak perlu websocket.

Polling/manual refresh cukup.

---

# 26. Booking Starting Soon

Optional UI:

```text
Booking berikutnya dimulai 15 menit lagi
```

Contoh:

```text
Court A
19:00
Albar
```

CTA:

```text
Open Booking
```

---

# 27. Staff Profile

Route:

```text
/staff/profile
```

Fields:

```text
Name
Email
Phone
Password
```

Staff tidak dapat:

```text
mengubah role sendiri
mengaktifkan account sendiri jika disabled
```

---

# 28. Back to Customer Site

Dropdown:

```text
Back to Customer Site
```

Route:

```text
/
```

Staff tetap authenticated.

Navbar customer tidak perlu memperlihatkan fitur My Booking milik customer jika role staff tidak memiliki konsep personal booking.

Boleh tampilkan:

```text
Staff Mode
```

atau tetap gunakan site publik tanpa customer-specific action.

---

# 29. Logout

Flow:

```text
Staff menu
↓
Logout
↓
Clear auth state
↓
/login
```

Tidak perlu confirmation.

---

# 30. Protected Route

Routes:

```text
/staff/*
```

Jika:

```text
guest    → /login
customer → 403
admin    → boleh jika policy memperbolehkan
```

Frontend hide menu bukan security.

Backend tetap wajib validate role.

---

# 31. Loading Behavior

Mock UI:

```text
NO artificial loading
```

Render mock data langsung.

Real API:

First visit:

```text
skeleton
```

Revisit:

```text
cached data
+ background refresh
```

Jangan full-page spinner setiap pindah menu.

---

# 32. Caching Strategy

Relatif stabil:

```text
court list
court status
staff profile
```

Cache beberapa menit.

Lebih dinamis:

```text
today bookings
schedule
payments
booking status
```

Cache pendek:

```text
15–60 detik
```

Setelah mutation:

```text
invalidate relevant cache
```

---

# 33. Mutation Cache Rules

Check In:

invalidate:

```text
booking detail
booking list
today bookings
schedule
dashboard
```

Complete:

```text
booking detail
booking list
today bookings
dashboard
```

Approve Payment:

```text
payment detail
payment list
booking detail
booking list
dashboard
```

Manual Booking:

```text
booking list
schedule
dashboard
availability
```

---

# 34. Empty States

Today bookings:

```text
Belum ada booking hari ini.
```

Pending payment:

```text
Tidak ada pembayaran yang perlu diverifikasi.
```

Schedule:

```text
Tidak ada booking pada tanggal ini.
```

---

# 35. Error States

Gunakan error spesifik:

```text
Booking tidak ditemukan.
Booking sudah di-check-in.
Booking sudah selesai.
Pembayaran sudah diverifikasi.
Slot sudah diambil booking lain.
Court sedang maintenance.
```

---

# 36. Confirmation Rules

Confirmation diperlukan:

```text
Check In
Complete Booking
Approve Payment
Reject Payment
```

Tidak perlu:

```text
Open Booking
Search
Filter
Change Date
Change Tab
```

---

# 37. Staff Mobile Experience

Mobile menjadi penting karena staff kemungkinan menggunakan tablet/HP di venue.

Prioritas mobile:

```text
Today Booking
Next Booking
Check In
Manual Booking
Payment Verification
```

Booking cards lebih disukai daripada tabel lebar.

Contoh:

```text
19:00–21:00
Court A

Albar
Confirmed

[View] [Check In]
```

---

# 38. Staff Desktop Experience

Desktop:

```text
Sidebar
Dashboard
Tables
Schedule Grid
```

Jangan buat dashboard terlalu analitik.

Staff membutuhkan action cepat, bukan chart sebanyak admin.

---

# 39. Staff Dashboard Priority

Urutan informasi:

```text
1. Next Booking
2. Booking Hari Ini
3. Pending Payment
4. Court Status
```

Revenue tidak perlu menjadi fokus staff.

---

# 40. Mock Staff Account

UI-only prototype:

```text
staff@example.com
password
```

Login:

```text
/staff
```

Mock state boleh menggunakan:

```text
localStorage
```

Jangan membuat fake backend.

---

# 41. Mock Staff Demo Flow

Prototype harus bisa didemokan:

```text
Login Staff
↓
Dashboard
↓
Lihat booking hari ini
↓
Open Booking
↓
Check In
↓
Complete

Manual Booking
↓
Pilih customer
↓
Pilih court
↓
Pilih slot
↓
Create Booking

Payments
↓
Open Proof
↓
Approve / Reject

Schedule
↓
Klik available slot
↓
Manual Booking
```

---

# 42. Staff Route Map

```text
/staff
/staff/bookings
/staff/bookings/:id
/staff/manual-booking
/staff/schedule
/staff/payments
/staff/payments/:id
/staff/profile
```

---

# 43. Staff Permission Matrix

| Feature | Staff | Admin |
|---|---:|---:|
| View Booking | ✓ | ✓ |
| Manual Booking | ✓ | ✓ |
| Check In | ✓ | ✓ |
| Complete Booking | ✓ | ✓ |
| Verify Payment | ✓* | ✓ |
| View Schedule | ✓ | ✓ |
| CRUD Court | - | ✓ |
| Change Pricing | - | ✓ |
| Manage Staff | - | ✓ |
| Reports | limited/- | ✓ |
| Settings | - | ✓ |

`*` jika staff diberi permission.

Untuk MVP, jika ingin lebih sederhana, payment verification bisa langsung diizinkan untuk semua staff.

---

# 44. Important Staff Rules

1. Staff UI fokus pada operasi hari ini.
2. Staff tidak perlu memiliki fitur admin yang tidak dipakai.
3. Manual booking menggunakan booking engine yang sama dengan customer booking.
4. Staff tidak boleh bypass anti-double-booking.
5. Check-in hanya untuk booking confirmed.
6. Complete hanya untuk booking checked-in.
7. Payment verification harus aman dari double verification.
8. Semua action harus memperbarui UI tanpa reload seluruh aplikasi.
9. Mock data tidak perlu artificial loading.
10. Backend nantinya tetap menjadi source of truth.
11. Hidden menu bukan authorization.
12. Mobile UX harus tetap nyaman untuk operasional venue.

---

# 45. Staff UI Definition of Done

Fase Staff dianggap siap direview jika:

- [ ] Staff login redirect ke `/staff`.
- [ ] Staff sidebar bekerja.
- [ ] Mobile drawer bekerja.
- [ ] Dashboard operasional tersedia.
- [ ] Next Booking tersedia.
- [ ] Booking Hari Ini tersedia.
- [ ] Booking list tersedia.
- [ ] Filter booking bekerja dengan mock data.
- [ ] Booking detail tersedia.
- [ ] Check In dapat disimulasikan.
- [ ] Complete Booking dapat disimulasikan.
- [ ] Manual Booking tersedia.
- [ ] Existing customer dapat dipilih.
- [ ] Walk-in customer dapat dibuat.
- [ ] Availability tampil pada manual booking.
- [ ] Schedule page tersedia.
- [ ] Court status terlihat.
- [ ] Payment Verification tersedia.
- [ ] Payment proof dapat dibuka.
- [ ] Approve/Reject dapat disimulasikan.
- [ ] Profile tersedia.
- [ ] Logout bekerja.
- [ ] Staff tidak melihat menu admin-only.
- [ ] UI mobile usable.
- [ ] Tidak ada artificial loading untuk mock data.
- [ ] Demo state penting dapat persist dengan localStorage.
