# APP-FLOW.md — Padel Booking System

Dokumen ini menjadi acuan perilaku aplikasi: navigasi, state, redirect, authentication flow, booking flow, payment flow, dan role-based behavior.

Dokumen lain tetap memiliki fungsi masing-masing:

- `PRODUCT REQUIREMENTS DOCUMENT` → requirement dan business rules.
- `styleguide.md` → tampilan dan interaction style.
- `task.md` → urutan implementasi.
- `app-flow.md` → bagaimana aplikasi bereaksi terhadap tindakan user.

Jika ada konflik:
1. Business rule mengikuti PRD.
2. Visual mengikuti `styleguide.md`.
3. Urutan pengerjaan mengikuti `task.md`.
4. Perilaku UI/navigation mengikuti `app-flow.md`.

---

# 1. User Roles

Aplikasi memiliki tiga role:

```text
guest
customer
staff
admin
```

## Guest

Belum login.

Dapat:
- melihat Home
- melihat Courts
- melihat Court Detail
- melihat availability
- membuka Login
- membuka Register

Tidak dapat:
- membuat booking final
- melihat My Booking
- melihat Profile
- mengakses halaman staff/admin

## Customer

User yang sudah login sebagai pelanggan.

Dapat:
- seluruh akses Guest
- memilih jadwal
- membuat booking
- melakukan pembayaran
- upload bukti pembayaran
- melihat My Booking
- melihat Booking Detail
- cancel booking jika memenuhi aturan
- mengubah profile

## Staff

Dapat:
- login
- melihat booking
- melihat jadwal
- membuat manual booking
- memverifikasi pembayaran jika diberi akses
- check-in customer
- menandai booking selesai

## Admin

Memiliki akses penuh:
- dashboard
- bookings
- courts
- schedules
- pricing
- customers
- staff
- payments
- reports
- settings

---

# 2. Authentication State

Frontend memiliki satu sumber state autentikasi.

Minimal:

```js
auth = {
  user: null,
  role: null,
  isAuthenticated: false,
  isLoading: true
}
```

Contoh setelah login customer:

```js
auth = {
  user: {
    id: "usr_001",
    name: "Albar",
    email: "albar@example.com"
  },
  role: "customer",
  isAuthenticated: true,
  isLoading: false
}
```

Untuk prototype UI, state boleh disimpan sementara menggunakan `localStorage`.

Saat backend sudah dibuat, authentication state harus berasal dari session/token yang valid.

---

# 3. Initial App Load

Saat aplikasi pertama kali dibuka:

```text
App Start
   ↓
Check existing auth/session
   ↓
Loading state
   ↓
Session valid?
   ├── YES → restore user
   └── NO  → guest
   ↓
Render application
```

Selama session diperiksa, jangan langsung menampilkan navbar Guest lalu berubah menjadi Customer.

Gunakan loading/skeleton singkat agar tidak terjadi UI flicker.

---

# 4. Public Navbar

## 4.1 Guest Navbar

Saat belum login:

```text
Logo

Home
Courts

                    Login
                    Book Now
```

Desktop:

```text
PADEL      Home   Courts                   Login   [Book Now]
```

`Book Now` behavior:

```text
Guest klik Book Now
        ↓
Masuk flow pemilihan court/jadwal
        ↓
Saat hendak mengonfirmasi booking
        ↓
Login required
```

Jangan paksa login hanya untuk melihat court atau availability.

---

# 5. Customer Navbar Setelah Login

Setelah login sebagai customer, navbar berubah.

Jangan lagi tampilkan:

```text
Login
Register
```

Ganti menjadi:

```text
Home
Courts
My Booking

                    [Book Now]
                    User Menu
```

Desktop:

```text
PADEL     Home   Courts   My Booking       [Book Now]   Albar ▼
```

User menu:

```text
Profile
My Booking
Logout
```

Optional avatar:

```text
[A] Albar ▼
```

Tidak perlu menampilkan email penuh di navbar.

---

# 6. Customer Mobile Navbar

Mobile header:

```text
Logo                       Menu
```

Menu / Sheet:

```text
Home
Courts
My Booking
Profile

Book Now

Logout
```

Jika Guest:

```text
Home
Courts

Login
Book Now
```

---

# 7. Admin / Staff Navigation

Admin dan staff tidak menggunakan public navbar sebagai navigasi utama.

Gunakan dashboard layout:

```text
Sidebar
Topbar
Content
```

## Admin Sidebar

```text
Dashboard
Bookings
Courts
Schedules
Pricing
Customers
Staff
Payments
Reports
Settings
```

Bottom:

```text
Profile
Logout
```

## Staff Sidebar

```text
Dashboard
Bookings
Schedule
Manual Booking
Payments
```

Bottom:

```text
Profile
Logout
```

Menu yang tidak dimiliki role jangan ditampilkan.

---

# 8. Login Flow

Route:

```text
/login
```

User mengisi:

```text
email
password
```

Flow:

```text
Login page
   ↓
Input credential
   ↓
Submit
   ↓
Validate
   ↓
Credential valid?
   ├── NO
   │    ↓
   │  tampilkan error
   │
   └── YES
        ↓
      get role
        ↓
      redirect berdasarkan role
```

Redirect:

```text
customer → /
staff    → /staff
admin    → /admin
```

---

# 9. Login dari Booking Flow

Kasus penting:

```text
Court Detail
   ↓
Pilih 19:00–20:00
   ↓
Continue
   ↓
Belum login
   ↓
Redirect /login
```

Simpan intended destination:

```text
/courts/1/booking?date=2026-08-30&start=19:00
```

Setelah login sukses:

```text
Login
 ↓
returnTo tersedia?
 ├── YES → kembali ke booking
 └── NO  → home
```

Jangan selalu redirect user ke Home jika login dilakukan dari tengah booking flow.

---

# 10. Register Flow

Route:

```text
/register
```

Input:

```text
name
email
phone
password
confirm password
```

Flow:

```text
Register
   ↓
Validation
   ↓
Success
   ↓
Auto login / Login page
```

Recommended MVP:

```text
Register success
      ↓
Auto login
      ↓
Home
```

Jika user register dari booking flow, kembali ke booking setelah register/login berhasil.

---

# 11. Logout Flow

Customer:

```text
User menu
  ↓
Logout
  ↓
Clear auth state
  ↓
Clear sensitive cached data
  ↓
Redirect /
```

Admin/staff:

```text
Logout
 ↓
Clear auth
 ↓
Redirect /login
```

Logout tidak perlu confirmation dialog.

---

# 12. Protected Routes

## Customer Protected

```text
/my-bookings
/my-bookings/:id
/profile
/booking/*
/payment/*
```

Jika Guest membuka route tersebut:

```text
redirect /login
```

Simpan `returnTo`.

## Admin Protected

```text
/admin/*
```

Jika:

```text
guest → /login
customer → 403 / unauthorized
staff → 403 jika route admin-only
```

## Staff Protected

```text
/staff/*
```

Admin boleh mengakses jika sistem memperbolehkan.

---

# 13. Home Flow

Route:

```text
/
```

Urutan:

```text
Navbar
Hero
Quick Booking
Court Preview
Facilities
Venue Information
Footer
```

Quick Booking input:

```text
Tanggal
Durasi
```

Action:

```text
Cari Lapangan
```

Flow:

```text
Pilih tanggal
 ↓
Pilih durasi
 ↓
Cari
 ↓
/courts?date=...&duration=...
```

---

# 14. Courts Flow

Route:

```text
/courts
```

State:

```text
selectedDate
duration
courtType
```

User dapat:
- ubah tanggal
- filter court
- pilih court

Klik Court:

```text
/courts/:courtId?date=...
```

Selected date sebaiknya dibawa ke Court Detail.

---

# 15. Court Detail Flow

Route:

```text
/courts/:id
```

Tampilkan:

```text
Gallery
Court info
Facilities
Pricing
Date selector
Availability
Booking CTA
```

Flow:

```text
Pilih tanggal
 ↓
Load availability
 ↓
Pilih slot
 ↓
Pilih duration
 ↓
Calculate estimated price
 ↓
Continue Booking
```

Jika tidak login:

```text
redirect Login
→ kembali ke Court Detail/Booking
```

Jika sudah login:

```text
→ Booking Confirmation
```

---

# 16. Availability State

Slot memiliki state:

```text
available
selected
reserved
booked
maintenance
closed
```

Behavior:

### Available
clickable

### Selected
highlight primary, klik ulang untuk unselect

### Reserved
disabled

### Booked
disabled

### Maintenance
disabled

### Closed
disabled

Slot disabled tidak boleh menjalankan booking action.

---

# 17. Booking Selection Logic

Contoh:

```text
Court A
30 Agustus 2026

Start:
19:00

Duration:
2 jam

End:
21:00
```

Frontend boleh menghitung preview:

```text
Rp300.000 × 2
= Rp600.000
```

Tetapi saat backend tersedia, harga final wajib berasal dari backend.

---

# 18. Booking Confirmation

Route contoh:

```text
/booking/confirm
```

Tampilkan:

```text
Court
Tanggal
Jam
Durasi
Subtotal
Discount
Total
```

Actions:

```text
Back
Continue to Payment
```

`Back` kembali ke Court Detail tanpa menghilangkan selection yang masih valid.

`Continue to Payment`:

```text
Create booking/reservation
        ↓
Success?
├── NO conflict
│      ↓
│  slot sudah diambil
│      ↓
│  kembali availability
│
└── YES
       ↓
    Payment
```

---

# 19. Booking Conflict

Jika slot sudah diambil user lain, UI menampilkan:

```text
Slot 19:00–20:00 baru saja diambil pemain lain.
Pilih jadwal yang berbeda.
```

Action:

```text
Refresh availability
```

---

# 20. Payment MVP Flow

MVP menggunakan QRIS + verifikasi pembayaran.

```text
Booking created
    ↓
WAITING_PAYMENT
    ↓
Payment Page
    ↓
Show QRIS
    ↓
Customer pays
    ↓
Upload payment proof
    ↓
PENDING_VERIFICATION
    ↓
Admin/Staff verifies
    ├── Approved → CONFIRMED
    └── Rejected → payment needs correction
```

---

# 21. Payment Page

Route:

```text
/payment/:bookingId
```

Tampilkan:

```text
Booking code
Amount
QRIS
Expiration countdown
Upload bukti
Payment status
```

Contoh:

```text
Total Pembayaran

Rp600.000

Selesaikan pembayaran dalam:

09:42
```

Buttons:

```text
Upload Bukti Pembayaran
```

Setelah file dipilih:

```text
Preview file
Change file
Submit
```

---

# 22. Payment Upload State

States:

```text
idle
uploading
submitted
approved
rejected
expired
```

## Submitted

```text
Bukti pembayaran sedang diperiksa.
```

## Approved

```text
Pembayaran terverifikasi.
Booking kamu sudah dikonfirmasi.
```

CTA:

```text
Lihat Booking
```

## Rejected

```text
Bukti pembayaran tidak dapat diverifikasi.
Silakan unggah bukti pembayaran yang benar.
```

CTA:

```text
Upload Ulang
```

## Expired

```text
Waktu pembayaran telah habis.
Slot booking sudah dilepas.
```

CTA:

```text
Cari Jadwal Lagi
```

---

# 23. Booking Success

Setelah pembayaran terverifikasi:

```text
/payment/:id
      ↓
approved
      ↓
/booking/:id/success
```

Tampilkan:

```text
Booking Confirmed

Booking Code
Court
Tanggal
Waktu
Total
```

Actions:

```text
Lihat Booking
Kembali ke Home
```

---

# 24. My Booking

Route:

```text
/my-bookings
```

Tabs:

```text
Upcoming
Completed
Cancelled
```

## Upcoming

```text
waiting_payment
pending_verification
confirmed
checked_in
```

## Completed

```text
completed
```

## Cancelled

```text
cancelled
expired
```

---

# 25. Booking Card Behavior

Setiap card minimal:

```text
Booking Code
Court
Date
Time
Total
Payment Status
Booking Status
```

Klik card:

```text
/my-bookings/:id
```

CTA sesuai state:

```text
waiting_payment        → Lanjut Pembayaran
pending_verification   → Lihat Pembayaran
confirmed              → Lihat Detail
completed              → Lihat Detail
cancelled              → Lihat Detail
```

---

# 26. Booking Detail

Route:

```text
/my-bookings/:id
```

Tampilkan:

```text
Booking code
Court
Date
Time
Duration
Price
Payment status
Booking status
```

Actions:

```text
waiting_payment      → Bayar Sekarang + Cancel Booking
pending_verification → Lihat Bukti Pembayaran
confirmed            → Cancel Booking jika eligible
checked_in           → no cancellation
completed            → no cancellation
cancelled / expired  → no destructive action
```

---

# 27. Cancel Booking Flow

Customer klik:

```text
Cancel Booking
```

Dialog:

```text
Batalkan booking?

Slot akan kembali tersedia setelah booking dibatalkan.
```

Buttons:

```text
Kembali
Batalkan Booking
```

Flow:

```text
Validate cancellation policy
       ↓
Allowed?
├── NO  → tampilkan alasan
└── YES → booking cancelled → refresh detail
```

---

# 28. Customer Profile

Route:

```text
/profile
```

Sections:

```text
Personal Information
Password
```

Fields:

```text
Name
Email
Phone
```

Save:

```text
loading
→ success
→ toast
```

---

# 29. Admin Login Flow

Admin login menggunakan `/login`.

Redirect:

```text
admin    → /admin
staff    → /staff
customer → /
```

---

# 30. Admin Dashboard

Route:

```text
/admin
```

Tampilkan:

```text
Today's Revenue
Today's Bookings
Active Courts
Upcoming Booking

Revenue Chart
Court Utilization
Recent / Upcoming Bookings
```

---

# 31. Admin Booking Management

Route:

```text
/admin/bookings
```

Filters:

```text
Search
Date
Court
Booking Status
Payment Status
```

Klik row:

```text
/admin/bookings/:id
```

Actions:

```text
View
Cancel
Check In
Complete
```

Actions hanya muncul jika status memungkinkan.

---

# 32. Admin Payment Verification

Route:

```text
/admin/payments
```

Tabs:

```text
Pending Verification
Approved
Rejected
```

Pending row:

```text
Booking Code
Customer
Amount
Submitted At
Proof
```

Admin dapat:

```text
Approve
Reject
```

---

# 33. Payment Approval Flow

Admin:

```text
Open payment
 ↓
View proof
 ↓
Approve
```

Result:

```text
payment → paid
booking → confirmed
```

Customer My Booking kemudian memperlihatkan status `Confirmed`.

---

# 34. Payment Rejection Flow

Admin menekan Reject.

Dialog meminta alasan:

```text
Bukti tidak terbaca
Nominal tidak sesuai
Bukti transaksi tidak valid
```

Result:

```text
payment → rejected
booking → waiting_payment / payment_correction
```

Customer dapat upload ulang selama booking belum expired.

---

# 35. Admin Court Management

Route:

```text
/admin/courts
```

Actions:

```text
Add Court
Edit
Set Maintenance
Deactivate
```

Court maintenance tidak boleh muncul sebagai available.

---

# 36. Admin Schedule Management

Route:

```text
/admin/schedules
```

Admin dapat:

```text
Set operating hours
Block schedule
Set maintenance window
```

---

# 37. Admin Pricing

Route:

```text
/admin/pricing
```

Admin dapat:

```text
Add pricing rule
Edit pricing
Delete pricing
```

Contoh:

```text
Weekday
07:00–16:00 → Rp200.000
16:00–23:00 → Rp300.000
```

---

# 38. Route Map

## Public

```text
/
/courts
/courts/:id
/login
/register
```

## Customer Protected

```text
/booking/confirm
/payment/:bookingId
/booking/:bookingId/success
/my-bookings
/my-bookings/:id
/profile
```

## Admin

```text
/admin
/admin/bookings
/admin/bookings/:id
/admin/courts
/admin/schedules
/admin/pricing
/admin/customers
/admin/staff
/admin/payments
/admin/reports
/admin/settings
```

## Staff

```text
/staff
/staff/bookings
/staff/bookings/:id
/staff/schedule
/staff/manual-booking
/staff/payments
```

---

# 39. Invalid Route

Route tidak ditemukan:

```text
404
```

Tampilkan:

```text
Halaman tidak ditemukan.
```

CTA:

```text
Kembali ke Home
```

---

# 40. Authorization Error

Jika role tidak memiliki akses:

```text
403
```

Tampilkan:

```text
Kamu tidak memiliki akses ke halaman ini.
```

Jangan memperlihatkan isi halaman sesaat sebelum redirect.

---

# 41. Loading Behavior

Gunakan loading state untuk:

```text
auth check
court list
court detail
availability
booking
payment
my booking
admin tables
```

Gunakan skeleton untuk content page.

Button request:

```text
Simpan → Menyimpan...
Bayar → Memproses...
Login → Masuk...
```

Disable button selama request.

---

# 42. Error Behavior

Prioritaskan error spesifik.

```text
Email atau password salah.
Slot ini sudah diambil pemain lain.
Bukti pembayaran gagal diunggah.
Koneksi bermasalah. Coba lagi.
```

---

# 43. Empty Behavior

My Booking:

```text
Belum ada booking.

Booking pertama kamu akan muncul di sini.
[Book a Court]
```

Admin Payment:

```text
Tidak ada pembayaran yang perlu diverifikasi.
```

Courts:

```text
Tidak ada lapangan tersedia untuk tanggal ini.
[Coba Tanggal Lain]
```

---

# 44. Mock UI Prototype Rules

Selama fase UI-only:

Gunakan mock data.

Login demo:

```text
customer@example.com
staff@example.com
admin@example.com
```

Password:

```text
password
```

Role mapping:

```text
customer@example.com → customer
staff@example.com    → staff
admin@example.com    → admin
```

Mock authentication boleh menggunakan `localStorage`.

Mock booking juga boleh disimpan sementara di `localStorage` agar UI dapat diuji setelah refresh.

Jangan membuat fake Express API jika backend belum dikerjakan.

---

# 45. Mock Login Behavior

Customer:

```text
customer@example.com
password
```

Setelah login navbar menjadi:

```text
Home
Courts
My Booking
Book Now
Albar ▼
```

Admin:

```text
admin@example.com
password
→ /admin
```

Staff:

```text
staff@example.com
password
→ /staff
```

---

# 46. Mock Booking Demo Flow

Prototype harus dapat didemokan:

```text
Home
 ↓
Courts
 ↓
Court A
 ↓
30 Agustus 2026
 ↓
19:00–21:00
 ↓
Continue
 ↓
Login jika Guest
 ↓
Booking Summary
 ↓
Continue Payment
 ↓
QRIS
 ↓
Upload bukti
 ↓
Pending Verification
 ↓
Admin Login
 ↓
Payments
 ↓
Approve
 ↓
Customer Login
 ↓
My Booking
 ↓
Confirmed
```

---

# 47. Navbar State Matrix

| State | Home | Courts | My Booking | Book Now | Login | User Menu |
|---|---:|---:|---:|---:|---:|---:|
| Guest | ✓ | ✓ | - | ✓ | ✓ | - |
| Customer | ✓ | ✓ | ✓ | ✓ | - | ✓ |

Admin dan Staff menggunakan dashboard navigation terpisah.

---

# 48. Booking Action Matrix

| Booking Status | Pay | Upload Proof | Cancel | Check In | Complete |
|---|---:|---:|---:|---:|---:|
| Waiting Payment | ✓ | ✓ | ✓ | - | - |
| Pending Verification | - | - | ✓* | - | - |
| Confirmed | - | - | ✓* | Staff | - |
| Checked In | - | - | - | - | Staff |
| Completed | - | - | - | - | - |
| Cancelled | - | - | - | - | - |
| Expired | - | - | - | - | - |

`*` mengikuti cancellation policy.

---

# 49. Payment Status Matrix

| Payment Status | Customer UI |
|---|---|
| Pending | Bayar / upload bukti |
| Pending Verification | Sedang diperiksa |
| Paid | Pembayaran berhasil |
| Rejected | Upload ulang |
| Expired | Cari jadwal lagi |
| Refunded | Refund berhasil |

---

# 50. Important Implementation Rules

1. Navbar harus langsung berubah setelah login/logout tanpa reload manual.
2. Protected route tidak boleh dapat dibuka Guest.
3. User harus dikembalikan ke booking flow setelah login jika login dipicu dari booking.
4. Selected date dan court jangan hilang tanpa alasan ketika berpindah antar-step booking.
5. Availability harus direfresh setelah booking conflict.
6. Payment status menentukan action yang tersedia.
7. Booking status menentukan action yang tersedia.
8. UI tidak boleh menawarkan tindakan yang sebenarnya tidak valid.
9. Admin/staff menu harus mengikuti role.
10. Mock behavior harus mudah diganti dengan API real nanti.
11. Jangan menaruh business logic kritis hanya di UI ketika backend sudah tersedia.
12. Backend nantinya tetap menjadi source of truth untuk availability, price, booking, authorization, dan payment status.

---

# 51. UI Prototype Definition of Done

Fase UI dianggap siap direview jika:

- [ ] Guest navbar bekerja.
- [ ] Login customer mengubah navbar tanpa refresh manual.
- [ ] Logout mengembalikan navbar Guest.
- [ ] Customer protected route bekerja.
- [ ] Admin redirect bekerja.
- [ ] Staff redirect bekerja.
- [ ] Court list dapat dibuka.
- [ ] Court detail dapat dibuka.
- [ ] Availability memiliki berbagai state.
- [ ] Slot dapat dipilih.
- [ ] Booking summary bekerja.
- [ ] Login dari booking mengembalikan user ke flow booking.
- [ ] Payment QRIS page tersedia.
- [ ] Upload bukti memiliki state UI.
- [ ] My Booking tersedia.
- [ ] Booking Detail tersedia.
- [ ] Cancel confirmation tersedia.
- [ ] Admin dashboard tersedia.
- [ ] Admin booking management tersedia.
- [ ] Admin payment verification tersedia.
- [ ] Admin dapat mensimulasikan approve/reject payment.
- [ ] Responsive mobile tersedia.
- [ ] Tidak ada backend/Supabase dependency untuk menjalankan prototype UI.
