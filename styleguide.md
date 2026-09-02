# STYLEGUIDE.md — Padel Booking System

Dokumen ini adalah acuan visual dan interaction design untuk seluruh aplikasi. Tujuannya bukan membuat tampilan “wah”, tetapi membuat pengalaman booking terasa cepat, jelas, dan terpercaya.

Kalau ada konflik antara estetika dan kejelasan, pilih kejelasan.

---

## 1. Design Direction

Gunakan pendekatan **clean sport-tech**:

- modern, ringan, dan responsif
- terasa aktif, tapi tidak agresif
- layout rapi dengan ruang napas yang cukup
- hierarchy harus jelas tanpa dekorasi berlebihan
- booking flow harus selalu terasa mudah dipahami
- admin dashboard harus mengutamakan informasi, bukan ornamen

Hindari:

- terlalu banyak gradient
- glassmorphism berlebihan
- card di dalam card tanpa alasan
- shadow tebal
- rounded corner ekstrem di semua elemen
- icon dekoratif yang tidak membantu
- animasi yang memperlambat tindakan utama
- teks marketing generik seperti “Elevate your game” di area fungsional
- semua elemen dibuat besar hanya supaya terlihat “modern”

---

## 2. Product Personality

Aplikasi harus terasa:

**Cepat**  
User tidak perlu berpikir lama untuk menemukan slot kosong.

**Terpercaya**  
Harga, status booking, dan status pembayaran tidak boleh ambigu.

**Sporty**  
Ada energi visual, tetapi tetap profesional.

**Tenang**  
Interface tidak boleh terasa ramai meskipun banyak slot jadwal tersedia.

---

## 3. Color System

Gunakan warna melalui design token. Jangan menulis hex langsung di komponen kecuali sedang mendefinisikan token.

### Brand

```css
--brand-50: #F0F9FF;
--brand-100: #E0F2FE;
--brand-200: #BAE6FD;
--brand-300: #7DD3FC;
--brand-400: #38BDF8;
--brand-500: #0EA5E9;
--brand-600: #0284C7;
--brand-700: #0369A1;
--brand-800: #075985;
--brand-900: #0C4A6E;
```

Default primary:

```css
--primary: var(--brand-600);
--primary-hover: var(--brand-700);
```

### Neutral

```css
--neutral-0: #FFFFFF;
--neutral-50: #F8FAFC;
--neutral-100: #F1F5F9;
--neutral-200: #E2E8F0;
--neutral-300: #CBD5E1;
--neutral-400: #94A3B8;
--neutral-500: #64748B;
--neutral-600: #475569;
--neutral-700: #334155;
--neutral-800: #1E293B;
--neutral-900: #0F172A;
```

### Semantic

```css
--success: #16A34A;
--warning: #D97706;
--danger: #DC2626;
--info: #2563EB;
```

### Booking Status Colors

Gunakan warna status secara konsisten.

| Status | Color |
|---|---|
| Available | success |
| Reserved | warning |
| Booked | neutral-500 |
| Confirmed | primary |
| Checked In | info |
| Completed | neutral-700 |
| Cancelled | danger |
| Expired | neutral-400 |
| Maintenance | warning |

Jangan hanya mengandalkan warna. Selalu sertakan label teks.

---

## 4. Typography

Gunakan font sans-serif yang netral dan mudah dibaca.

Recommended:

```text
Inter
```

Fallback:

```css
font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

### Scale

```text
Display      40px / 48px / 700
H1           32px / 40px / 700
H2           24px / 32px / 700
H3           20px / 28px / 600
Body Large   18px / 28px / 400
Body         16px / 24px / 400
Body Small   14px / 20px / 400
Label        14px / 20px / 500
Caption      12px / 16px / 400
```

Gunakan maksimal 3 weight:

```text
400
500
700
```

Jangan gunakan bold untuk hampir semua teks.

---

## 5. Spacing

Gunakan skala 4px.

```text
4
8
12
16
20
24
32
40
48
64
80
```

Default:

- gap antar field: `16px`
- gap antar section kecil: `24px`
- gap antar section besar: `48px`
- padding card desktop: `24px`
- padding card mobile: `16px`
- page horizontal padding mobile: `16px`
- page horizontal padding desktop: `32px`

Jangan menggunakan angka acak seperti `13px`, `27px`, atau `37px` tanpa alasan.

---

## 6. Layout

### App Container

```css
max-width: 1280px;
margin-inline: auto;
padding-inline: 24px;
```

Mobile:

```css
padding-inline: 16px;
```

### Public Pages

Public page sebaiknya terasa lapang.

Recommended structure:

```text
Navbar
Main content
Footer
```

Gunakan section secara natural, bukan membungkus setiap section dengan background berbeda.

### Admin

Admin menggunakan:

```text
Sidebar
Topbar
Content
```

Content maksimal `1440px`.

Dashboard boleh lebih padat dibanding halaman customer.

---

## 7. Border Radius

Gunakan radius secukupnya.

```text
Small     6px
Default   8px
Card      12px
Large     16px
Pill      999px
```

Penggunaan pill hanya untuk:

- status
- tag
- chip/filter
- avatar

Jangan membuat setiap button, input, dan card berbentuk pill.

---

## 8. Borders

Border lebih diutamakan daripada shadow.

Default:

```css
border: 1px solid var(--neutral-200);
```

Strong:

```css
border: 1px solid var(--neutral-300);
```

Selected:

```css
border: 1px solid var(--primary);
```

---

## 9. Shadows

Gunakan shadow hanya saat hierarchy membutuhkan depth.

```css
--shadow-sm:
  0 1px 2px rgba(15, 23, 42, 0.06);

--shadow-md:
  0 8px 24px rgba(15, 23, 42, 0.08);
```

`shadow-md` sebaiknya hanya untuk:

- modal
- dropdown
- floating element

Card biasa cukup menggunakan border.

---

## 10. Buttons

### Primary

Digunakan untuk aksi utama.

Contoh:

- Book Now
- Continue to Payment
- Save Changes
- Confirm Booking

Style:

```text
background: primary
text: white
height: 44px
padding: 0 16px
radius: 8px
font-weight: 600
```

### Secondary

Untuk aksi pendukung.

Contoh:

- View Detail
- Back
- Edit

Style:

```text
background: white
border: neutral-300
text: neutral-800
```

### Destructive

Hanya untuk tindakan berisiko.

Contoh:

- Cancel Booking
- Delete Court

Gunakan warna danger.

### Ghost

Gunakan pada aksi low emphasis.

Contoh:

- Close
- More
- Clear Filter

### Button Rules

- satu area idealnya hanya memiliki satu primary action
- jangan gunakan icon tanpa label untuk aksi penting
- tombol submit memiliki loading state
- tombol loading tidak boleh bisa diklik berulang
- tombol disabled harus terlihat disabled

---

## 11. Forms

Input standard:

```text
height: 44px
border: neutral-300
radius: 8px
padding-inline: 12px
```

Focus:

```text
border: primary
ring: primary / low opacity
```

Field structure:

```text
Label
Input
Helper/Error text
```

Jangan menggunakan placeholder sebagai pengganti label.

### Error State

Gunakan:

- border danger
- message singkat
- jangan hanya menampilkan toast

Contoh:

```text
Jam tersebut sudah dibooking. Pilih slot lain.
```

Bukan:

```text
Something went wrong.
```

---

## 12. Cards

Gunakan card hanya ketika memang ada unit informasi yang berdiri sendiri.

Base card:

```text
background: white
border: neutral-200
radius: 12px
padding: 20–24px
```

Tidak perlu shadow default.

### Court Card

Minimal menampilkan:

- image
- nama court
- indoor/outdoor
- harga mulai
- status jika relevan
- CTA

Jangan memasukkan seluruh detail court ke dalam card list.

---

## 13. Court Images

Gunakan aspect ratio konsisten.

Recommended:

```text
16:10
```

Rules:

- `object-fit: cover`
- gunakan placeholder jika gambar gagal
- gallery detail court boleh menggunakan image utama + thumbnails
- hindari slider otomatis

---

## 14. Booking Slot

Booking slot adalah salah satu komponen paling penting.

Gunakan grid yang mudah dipindai.

Contoh:

```text
07:00
08:00
09:00
10:00
```

### Available

```text
white background
neutral border
dark text
```

Hover:

```text
brand-50 background
primary border
```

### Selected

```text
primary background
white text
primary border
```

### Booked

```text
neutral-100 background
neutral-400 text
disabled cursor
```

### Reserved

```text
warning light background
warning text
disabled
```

### Maintenance / Closed

```text
neutral-100
neutral-500
disabled
```

Slot unavailable tidak boleh terlihat seperti slot yang bisa dipilih.

---

## 15. Booking Flow

Booking flow sebaiknya menggunakan langkah sederhana:

```text
1. Pilih Jadwal
2. Konfirmasi
3. Pembayaran
```

Tidak perlu membuat 6–7 step jika informasinya dapat diselesaikan dalam 3 step.

User harus selalu dapat melihat:

- court
- tanggal
- waktu
- durasi
- harga

sebelum pembayaran.

---

## 16. Booking Summary

Booking summary harus memiliki hierarchy kuat.

Example:

```text
Court A

Sabtu, 30 Agustus 2026
19:00–21:00
2 jam

Subtotal            Rp500.000
Discount                  Rp0
--------------------------------
Total               Rp500.000
```

Total harus menjadi teks paling menonjol setelah nama court.

Jangan menyembunyikan fee tambahan sampai halaman pembayaran.

---

## 17. Payment State

### Pending

Tampilkan:

- metode pembayaran
- amount
- countdown
- instruksi pembayaran
- refresh/check status jika relevan

### Paid

Gunakan success state yang tenang.

Tampilkan:

```text
Pembayaran berhasil
Booking kamu sudah dikonfirmasi.
```

Jangan memenuhi layar dengan confetti atau animasi besar.

### Expired

Tampilkan dengan jelas:

```text
Waktu pembayaran sudah habis.
Slot booking telah dilepas.
```

CTA:

```text
Pilih Jadwal Lagi
```

---

## 18. Status Badge

Format:

```text
● Confirmed
```

Atau icon kecil + teks.

Badge tidak perlu uppercase penuh.

Gunakan:

```text
Confirmed
```

Bukan:

```text
CONFIRMED
```

kecuali di tabel yang memang membutuhkan format kompak.

---

## 19. Tables

Dipakai terutama di admin.

Rules:

- header jelas
- row height minimal 48px
- angka rata kanan jika perlu
- action column di kanan
- jangan tampilkan terlalu banyak kolom
- gunakan pagination jika data panjang

Contoh Booking Table:

```text
Code | Customer | Court | Schedule | Total | Payment | Status | Action
```

Mobile:

- ubah menjadi card/list jika tabel tidak usable
- jangan memaksa 8 kolom masuk layar 375px

---

## 20. Filters

Filter harus dekat dengan data yang difilter.

Booking admin:

```text
Search
Date
Court
Booking Status
Payment Status
```

Gunakan default value yang masuk akal.

Tambahkan `Reset` hanya jika filter cukup kompleks.

---

## 21. Modals

Gunakan modal untuk:

- confirmation
- small form
- destructive action

Jangan gunakan modal untuk halaman detail kompleks.

Maximum width umum:

```text
480–640px
```

Destructive modal harus menjelaskan konsekuensi.

Contoh:

```text
Batalkan booking?

Slot akan kembali tersedia setelah booking dibatalkan.
```

---

## 22. Toasts

Toast hanya untuk feedback singkat.

Contoh:

```text
Court berhasil diperbarui.
Booking berhasil dibatalkan.
```

Jangan menggunakan toast sebagai satu-satunya tempat untuk validation error.

---

## 23. Empty States

Empty state harus menjelaskan situasi dan menawarkan tindakan berikutnya.

Bagus:

```text
Belum ada booking.

Booking pertama kamu akan muncul di sini.
[Book a Court]
```

Hindari:

```text
No data found.
```

---

## 24. Loading States

Untuk page:

- gunakan skeleton pada struktur utama
- jangan spinner besar di tengah layar jika bisa dihindari

Untuk button:

```text
Saving...
Processing...
```

Booking/payment action harus disable saat request berjalan.

---

## 25. Navigation

### Customer

Recommended:

```text
Home
Courts
My Booking
```

Right side:

```text
Profile / Login
Book Now
```

### Mobile

Gunakan navbar compact atau bottom navigation jika memang dibutuhkan.

Jangan memenuhi navbar dengan terlalu banyak menu.

### Admin

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
```

Kelompokkan menu jika sidebar terlalu panjang.

---

## 26. Icons

Gunakan satu icon library secara konsisten.

Recommended:

```text
Lucide
```

Default size:

```text
16px
20px
24px
```

Jangan mencampur banyak style icon.

Icon dekoratif tidak perlu jika tidak menambah informasi.

---

## 27. Motion

Gunakan motion secukupnya.

Default transition:

```css
transition: 150ms ease;
```

Boleh digunakan untuk:

- button hover
- dropdown
- modal
- selected slot
- tab

Hindari:

- parallax
- excessive entrance animation
- element yang bergerak terus menerus
- loading animation yang ramai

---

## 28. Content Style

Gunakan bahasa yang pendek dan jelas.

### Button

Gunakan verb langsung:

```text
Book Now
Pilih Jadwal
Bayar Sekarang
Batalkan Booking
Simpan Perubahan
```

Hindari:

```text
Klik di sini
Lanjutkan proses Anda
Submit
```

jika ada label yang lebih spesifik.

### Confirmation

Bagus:

```text
Booking berhasil dibuat.
Selesaikan pembayaran dalam 10 menit.
```

Hindari:

```text
Selamat! Anda telah berhasil melakukan proses reservasi lapangan pada sistem kami.
```

### Error

Bagus:

```text
Slot 19:00–20:00 sudah diambil.
```

Hindari:

```text
Terjadi kesalahan. Silakan coba lagi.
```

jika sistem mengetahui error sebenarnya.

---

## 29. Date & Time Format

Gunakan format Indonesia pada UI.

Tanggal:

```text
30 Agustus 2026
```

Tanggal + hari:

```text
Minggu, 30 Agustus 2026
```

Waktu:

```text
19:00
```

Range:

```text
19:00–21:00
```

Hindari format campuran:

```text
08/30/2026
7 PM
```

---

## 30. Currency Format

Gunakan:

```text
Rp250.000
Rp1.250.000
```

Jangan tampilkan decimal yang tidak diperlukan:

```text
Rp250.000,00
```

kecuali memang ada kebutuhan accounting.

---

## 31. Responsive Rules

### Mobile

Prioritas:

1. availability
2. booking information
3. primary CTA

Booking summary pada mobile dapat sticky di bagian bawah jika membantu.

### Tablet

Gunakan 2-column layout jika cukup ruang.

### Desktop

Booking detail dapat menggunakan:

```text
Main content        Booking summary
```

Summary boleh sticky.

---

## 32. Accessibility

Minimum requirements:

- contrast text harus terbaca
- interactive target minimal 40×40px
- form memiliki label
- keyboard navigation harus bekerja
- focus state tidak boleh dihapus
- button harus menggunakan semantic `<button>`
- link menggunakan `<a>`
- modal harus menangani focus trap
- color bukan satu-satunya penanda status
- image memiliki alt text sesuai konteks

---

## 33. Dark Mode

Dark mode bukan prioritas MVP.

Jangan membuat dark mode setengah jadi hanya untuk menambah fitur.

Jika suatu saat dibuat, definisikan token secara terpisah dan jangan invert warna secara asal.

---

## 34. Public Page Examples

### Home

Recommended hierarchy:

```text
Navbar

Hero
Quick Booking

Court Preview
Facilities
Venue Information

Footer
```

Hero tidak perlu terlalu tinggi.

User harus melihat CTA booking tanpa scroll berlebihan.

### Court List

Recommended:

```text
Page Title
Date / Availability Filter

Court Cards
```

### Court Detail

Recommended:

```text
Gallery
Court information

Availability / Booking section
```

---

## 35. Admin Dashboard Examples

Gunakan layout:

```text
Page title + date range

Metric cards

Revenue chart

Upcoming bookings

Court utilization
```

Jangan membuat 10 metric card di atas layar.

Fokus pada 3–4 metric yang memang dipakai mengambil keputusan.

---

## 36. Component Naming

Gunakan nama berdasarkan fungsi, bukan berdasarkan tampilan.

Bagus:

```text
BookingSlot
BookingSummary
CourtCard
PaymentStatus
BookingStatusBadge
AvailabilityGrid
DateSelector
```

Hindari:

```text
BlueCard
BigBox
ModernSection
FancyButton
```

---

## 37. Component Rules

Satu component sebaiknya memiliki satu tanggung jawab jelas.

Hindari component besar yang mengurus:

- API fetch
- form
- modal
- pricing
- business logic
- rendering

dalam satu file jika sudah sulit dibaca.

Reusable component digunakan ketika memang ada pola berulang.

Jangan membuat abstraction hanya karena dua element kebetulan terlihat mirip.

---

## 38. Frontend State

Pisahkan:

```text
server state
UI state
form state
```

Contoh:

Server state:

- court list
- availability
- booking
- payment

UI state:

- selected slot
- active tab
- modal open

Form state:

- profile form
- login form

Jangan menyimpan semua hal di global store.

---

## 39. API Interaction

Setiap request harus menangani:

```text
loading
success
validation error
authorization error
network/server error
```

Jika booking mendapat `409 Conflict`, tampilkan pesan spesifik:

```text
Slot ini baru saja diambil pemain lain.
Pilih jadwal yang berbeda.
```

Kemudian refresh availability.

---

## 40. Design Review Checklist

Sebelum halaman dianggap selesai:

- [ ] CTA utama langsung terlihat.
- [ ] Tidak ada lebih dari satu aksi primary yang bersaing.
- [ ] Hierarchy teks jelas.
- [ ] Spacing konsisten.
- [ ] Semua field memiliki label.
- [ ] Loading state tersedia.
- [ ] Empty state tersedia.
- [ ] Error state tersedia.
- [ ] Mobile layout usable.
- [ ] Status tidak hanya dibedakan melalui warna.
- [ ] Tidak ada informasi harga yang tersembunyi.
- [ ] Tidak ada dekorasi yang mengganggu booking flow.

---

## 41. AI Coding Agent Rules

Jika implementasi dibantu coding agent:

1. Ikuti token warna, spacing, radius, dan typography di file ini.
2. Jangan menambahkan gradient kecuali ada kebutuhan visual nyata.
3. Jangan menambahkan glassmorphism.
4. Jangan menambahkan shadow besar pada card biasa.
5. Jangan menggunakan rounded `24px+` pada semua komponen.
6. Jangan menambahkan section marketing baru tanpa requirement.
7. Jangan membuat copy generik untuk mengisi ruang kosong.
8. Jangan menggunakan emoji sebagai icon UI.
9. Jangan mencampur icon library.
10. Jangan membuat layout berbeda-beda untuk halaman yang memiliki pola sama.
11. Gunakan komponen existing sebelum membuat komponen baru.
12. Jangan mengubah primary color hanya karena halaman tertentu.
13. Gunakan semantic status colors secara konsisten.
14. Jangan hide validation error hanya dalam toast.
15. Jangan menampilkan mock data pada production UI.
16. Jangan menambahkan fake statistic untuk membuat dashboard terlihat penuh.
17. Jangan menambahkan animasi hanya untuk terlihat “premium”.
18. Jangan mengorbankan usability mobile demi desktop appearance.

---

## 42. Final Principle

Interface ini tidak perlu terlihat seperti konsep Dribbble.

Interface harus terasa seperti produk yang benar-benar digunakan orang untuk:

- mencari court
- memilih waktu
- membayar
- datang bermain

Setiap elemen visual harus membantu salah satu aktivitas tersebut atau membantu staff menjalankan venue.

Kalau sebuah elemen tidak membantu user memahami informasi, mengambil keputusan, atau menyelesaikan tindakan, pertimbangkan untuk menghapusnya.
