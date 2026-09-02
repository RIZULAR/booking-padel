# ADMIN-FLOW.md — Padel Booking System

Dokumen ini mengatur perilaku sisi Admin dan Staff. Gunakan bersama PRD, `styleguide.md`, `task.md`, dan `app-flow.md`.

## 1. Roles

### Admin
Akses penuh:
- Dashboard
- Bookings
- Courts
- Schedules
- Pricing
- Customers
- Staff
- Payments
- Reports
- Settings

### Staff
Akses operasional:
- Dashboard operasional
- Bookings
- Schedule
- Manual Booking
- Payment Verification
- Check-in
- Complete Booking

Staff tidak dapat mengelola staff lain, mengubah role, atau membuka setting sensitif.

---

## 2. Login & Redirect

Route login:
```text
/login
```

Redirect setelah login:
```text
customer → /
staff    → /staff
admin    → /admin
```

Jika admin sudah login dan membuka `/login`, redirect ke `/admin`.

---

## 3. Admin Layout

Desktop:
```text
Sidebar | Topbar
        | Content
```

Sidebar:
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
────────────
Profile
Logout
```

Topbar:
```text
Page Title                 Notifications    Admin ▼
```

Mobile: sidebar berubah menjadi Sheet/Drawer.

Menu aktif harus tetap active pada child route, contoh `/admin/bookings/:id` tetap menandai `Bookings`.

---

## 4. Dashboard

Route:
```text
/admin
```

Metric utama:
```text
Revenue Hari Ini
Booking Hari Ini
Court Aktif
Pending Payment
```

Contoh:
```text
Revenue Hari Ini   Rp4.500.000
Booking Hari Ini   18
Court Aktif        3 / 3
Pending Payment    4
```

Klik metric:
```text
Revenue         → /admin/reports
Booking Hari Ini→ /admin/bookings?date=today
Pending Payment → /admin/payments?status=pending
```

Section:
- Revenue chart
- Upcoming bookings
- Court utilization
- Pending payment verification

Dashboard jangan full-loading tiap dibuka ulang. Jika cache ada, tampilkan cache dan refresh di background.

---

## 5. Booking Management

Route:
```text
/admin/bookings
```

Kolom:
```text
Booking Code
Customer
Court
Schedule
Total
Payment
Booking Status
Action
```

Filter:
```text
Search
Date
Court
Booking Status
Payment Status
```

Search:
- booking code
- customer name
- phone
- email

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

Action matrix:

| Status | View | Check In | Complete | Cancel |
|---|---:|---:|---:|---:|
| Waiting Payment | ✓ | - | - | ✓ |
| Pending Verification | ✓ | - | - | ✓ |
| Confirmed | ✓ | ✓ | - | ✓* |
| Checked In | ✓ | - | ✓ | - |
| Completed | ✓ | - | - | - |
| Cancelled | ✓ | - | - | - |
| Expired | ✓ | - | - | - |

`*` mengikuti cancellation policy.

---

## 6. Booking Detail

Route:
```text
/admin/bookings/:id
```

Section:
```text
Booking Information
Customer Information
Court Information
Payment Information
Activity / Status
```

Booking:
- Booking code
- Date
- Start/end time
- Duration
- Status
- Created at

Customer:
- Name
- Email
- Phone

Payment:
- Amount
- Method
- Status
- Payment proof
- Submitted at
- Verified by
- Verified at

Actions:
```text
confirmed  → Check In
checked_in → Complete
eligible   → Cancel
```

---

## 7. Manual Booking

Route:
```text
/admin/bookings/new
```

Staff:
```text
/staff/manual-booking
```

Fields:
```text
Customer
Phone
Court
Date
Start Time
Duration
Payment Status
Notes
```

Flow:
```text
Pilih court
→ pilih tanggal
→ load availability
→ pilih slot
→ hitung harga
→ create booking
```

Manual booking tetap wajib melalui:
- overlap validation
- operating-hours validation
- blocked-schedule validation
- pricing validation
- anti-double-booking

Jangan membuat jalur khusus yang bypass booking engine.

---

## 8. Court Management

Route:
```text
/admin/courts
```

Kolom:
```text
Court
Type
Indoor/Outdoor
Price From
Status
Actions
```

Actions:
```text
Add Court
View
Edit
Set Maintenance
Deactivate
```

Add:
```text
/admin/courts/new
```

Edit:
```text
/admin/courts/:id/edit
```

Fields:
- Court name
- Description
- Type
- Indoor/outdoor
- Capacity
- Images
- Status

Status:
```text
active
maintenance
inactive
```

Rules:
- active: dapat dibooking
- maintenance: tidak tersedia untuk booking baru
- inactive: tidak tampil di customer
- existing confirmed booking tidak boleh dihapus otomatis saat court masuk maintenance

---

## 9. Schedule Management

Route:
```text
/admin/schedules
```

Section:
```text
Operating Hours
Blocked Dates
Maintenance Windows
```

Operating hours contoh:
```text
Monday    07:00–23:00
Tuesday   07:00–23:00
Wednesday 07:00–23:00
Thursday  07:00–23:00
Friday    07:00–24:00
Saturday  06:00–24:00
Sunday    06:00–23:00
```

Block schedule fields:
```text
Court
Date
Start
End
Reason
```

Contoh reason:
```text
Private Event
Maintenance
Tournament
Venue Closed
```

Jika block bertabrakan dengan confirmed booking, tampilkan warning. Jangan silently overwrite.

---

## 10. Pricing Management

Route:
```text
/admin/pricing
```

Table:
```text
Court
Day Type
Start
End
Price
Status
Action
```

Support minimal:
```text
weekday
weekend
```

Rule:
```text
court
day_type
start_time
end_time
price_per_hour
```

Cegah pricing rule overlap yang ambigu.

---

## 11. Customer Management

Route:
```text
/admin/customers
```

Table:
```text
Name
Phone
Email
Total Booking
Total Spend
Joined
Action
```

Detail:
```text
/admin/customers/:id
```

Sections:
```text
Profile
Booking History
Payment History
Statistics
```

Metrics:
```text
Total Booking
Completed Booking
Cancelled Booking
Total Spend
```

Admin tidak perlu dapat mengubah password customer secara langsung.

---

## 12. Staff Management

Route:
```text
/admin/staff
```

Actions:
```text
Add Staff
Edit Staff
Activate
Deactivate
```

Fields:
```text
Name
Email
Phone
Role
Status
```

Untuk MVP cukup role:
```text
admin
staff
```

Jangan membuat permission builder kompleks.

---

## 13. Payment Verification

Route:
```text
/admin/payments
```

Tabs:
```text
Pending Verification
Approved
Rejected
Expired
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

Detail:
```text
/admin/payments/:id
```

Layout:
```text
Payment Proof
Booking Info
Customer Info
Payment Info
```

Actions:
```text
Approve Payment
Reject Payment
```

Approve:
```text
payment → paid
booking → confirmed
```

Reject:
```text
payment → rejected
```

Reason:
```text
Nominal tidak sesuai
Bukti tidak terbaca
Transaksi tidak ditemukan
Bukti tidak valid
Lainnya
```

Customer harus dapat melihat alasan reject.

Jika payment sudah diverifikasi admin lain, backend menolak verifikasi ulang dan frontend refresh status terbaru.

---

## 14. Reports

Route:
```text
/admin/reports
```

Filter:
```text
Today
7 Days
30 Days
Custom Range
```

Revenue:
```text
Gross Revenue
Paid Revenue
Refund
Average Booking Value
```

Booking:
```text
Total Booking
Confirmed
Completed
Cancelled
Expired
```

Court performance:
```text
Court
Bookings
Booked Hours
Revenue
Utilization
```

MVP export:
```text
CSV
```

Export mengikuti filter aktif.

---

## 15. Settings

Route:
```text
/admin/settings
```

Sections:
```text
Venue Information
Booking Rules
Payment Settings
```

Venue:
```text
Venue Name
Address
Phone
WhatsApp
Email
```

Booking rules:
```text
Minimum Booking Duration
Maximum Booking Duration
Payment Timeout
Cancellation Cutoff
```

Contoh:
```text
Minimum: 1 hour
Maximum: 3 hours
Payment Timeout: 10 minutes
Cancellation Cutoff: 6 hours
```

QRIS:
```text
QRIS Image
Merchant Name
Payment Instructions
```

Admin dapat mengganti QRIS image.

---

## 16. Notifications

Topbar boleh menampilkan notification indicator.

MVP notification:
```text
New Booking
New Payment Proof
Payment Needs Verification
Upcoming Booking
```

Tidak perlu websocket untuk MVP. Polling atau refresh manual cukup.

---

## 17. Loading & Cache

Jangan artificial loading untuk mock data.

Saat API real:

Relatif stabil:
```text
courts
pricing
customers
settings
```

Cache:
```text
5–30 menit
```

Lebih dinamis:
```text
bookings
payments
dashboard
availability
```

Cache lebih pendek:
```text
15–60 detik
```

Setelah mutation jangan reload seluruh app.

Contoh:
```text
Approve Payment
→ update payment
→ invalidate payment detail
→ invalidate payment list
→ invalidate booking detail
→ invalidate booking list
→ invalidate dashboard metrics
```

Jika cached data ada, tampilkan dulu dan refetch di background.

---

## 18. Error Handling

Gunakan error spesifik:

```text
Booking tidak ditemukan.
Payment sudah diverifikasi.
Court memiliki booking aktif.
Pricing rule bentrok dengan rule lain.
Jadwal bertabrakan dengan booking aktif.
```

Hindari `Something went wrong` jika error sebenarnya diketahui.

---

## 19. Confirmation Dialog

Perlu confirmation:
```text
Cancel Booking
Deactivate Court
Approve Payment
Reject Payment
Delete Pricing
Deactivate Staff
```

Tidak perlu:
```text
Search
Filter
Open Detail
Change Tab
```

---

## 20. Staff Dashboard

Route:
```text
/staff
```

Tampilkan:
```text
Booking Hari Ini
Next Booking
Pending Verification
Court Status
```

Tidak perlu:
```text
Revenue Analytics
Staff Management
Advanced Reports
Settings
```

Staff route:
```text
/staff
/staff/bookings
/staff/bookings/:id
/staff/manual-booking
/staff/schedule
/staff/payments
/staff/payments/:id
```

---

## 21. Mock Admin Prototype

Login:
```text
admin@example.com
password
```

Demo flow:
```text
Login Admin
→ Dashboard
→ Bookings
→ Booking Detail
→ Check In
→ Complete

Payments
→ Payment Detail
→ Approve / Reject

Courts
→ Add / Edit / Maintenance

Schedules
→ Block Slot

Pricing
→ Edit Price

Reports
→ Change Range
```

Gunakan data lokal/localStorage. Jangan membuat fake Express API hanya untuk prototype.

Staff:
```text
staff@example.com
password
```

---

## 22. Admin Topbar Dropdown

```text
Profile
Back to Customer Site
Logout
```

`Back to Customer Site` membuka `/` tetapi admin tetap login.

---

## 23. Responsive

Desktop:
```text
sidebar permanent
```

Mobile/tablet:
```text
sidebar → Sheet/Drawer
```

Untuk tabel yang lebar:
- desktop: table
- mobile: compact cards atau horizontal scroll jika benar-benar perlu

Booking dan payment lebih baik berubah menjadi card pada mobile daripada memaksa 8 kolom.

---

## 24. Security

Visibility frontend bukan authorization.

Jangan menganggap:
```text
menu disembunyikan = endpoint aman
```

Backend wajib memverifikasi:
```text
authenticated
role
ownership / permission
```

Admin endpoint:
```text
role = admin
```

Staff endpoint:
```text
role = staff/admin sesuai policy
```

---

## 25. Admin Route Map

```text
/admin
/admin/bookings
/admin/bookings/new
/admin/bookings/:id
/admin/courts
/admin/courts/new
/admin/courts/:id/edit
/admin/schedules
/admin/pricing
/admin/customers
/admin/customers/:id
/admin/staff
/admin/payments
/admin/payments/:id
/admin/reports
/admin/settings
```

---

## 26. Admin UI Definition of Done

- [ ] Admin login redirect ke `/admin`.
- [ ] Sidebar dan mobile drawer bekerja.
- [ ] Dashboard metrics tersedia.
- [ ] Revenue chart tersedia.
- [ ] Upcoming bookings tersedia.
- [ ] Booking list/filter tersedia.
- [ ] Booking detail tersedia.
- [ ] Manual booking tersedia.
- [ ] Check-in dapat disimulasikan.
- [ ] Complete booking dapat disimulasikan.
- [ ] Court management tersedia.
- [ ] Add/Edit/Maintenance court tersedia.
- [ ] Schedule management tersedia.
- [ ] Block schedule tersedia.
- [ ] Pricing management tersedia.
- [ ] Customer list/detail tersedia.
- [ ] Staff management tersedia.
- [ ] Payment verification tersedia.
- [ ] Payment proof dapat dibuka.
- [ ] Approve/reject dapat disimulasikan.
- [ ] Reports tersedia.
- [ ] Settings tersedia.
- [ ] Staff navigation berbeda dari admin.
- [ ] Logout bekerja.
- [ ] Responsive mobile usable.
- [ ] Mock data tidak memakai artificial loading.
- [ ] State demo penting persist dengan localStorage.
