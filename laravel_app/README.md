# 🃏 PHANTOM AFICIONADO (THE PHANSITE) 🎭
### *~ A Persona 5 Royal Themed Interactive Developer Portfolio & Metaverse Platform ~*

<p align="center">
  <img src="public/assets/img/joker_mask.webp" alt="Phantom Thieves Mask" width="160" />
</p>

<p align="center">
  <b>"Wake up, get up, get out there!"</b><br>
  <i>If you hold on, life won't change... Steal back your future!</i>
</p>

---

## 🎩 Penjelasan Singkat (Brief Overview)

**Phantom Aficionado (The Phansite)** adalah website portofolio interaktif dan platform komunitas web developer yang dirancang dengan estetika visual serta tata suara khas **Persona 5 Royal (P5R)**.

Terinspirasi dari forum bawah tanah *"The Phansite"* karya Yuuki Mishima di dalam jagat Persona 5, website ini bukan sekadar etalase portofolio statis. Pengunjung diajak seolah-olah memasuki Metaverse:
- Melewati layar pembuka bergaya **"Take Your Time"** dengan Joker berputar 2D untuk mengisi *Codename*.
- Menikmati alunan lo-fi legendaris **"Beneath the Mask"** melalui *Metaverse Audio Engine*.
- Mengisi suara dalam polling publik interaktif: *"Apakah Phantom Thieves benar-benar ada?"*.
- Mengobrol dan meninggalkan jejak di **The Metaverse Archive (Live Chat / Comment Board)** berbalut *speech bubble* putih tebal dan huruf *cutout ransom tiles* khas P5.
- Mengirim pesan atau tawaran kerja sama sebagai **Official Calling Card** lengkap dengan kuota anti-spam.
- Mengunjungi showcase proyek (**Palaces**), rekam jejak pengalaman (**Confidants**), dan sertifikasi (**Treasures**).

---

## 🌟 Fitur-Fitur Utama (Metaverse Features)

### 1. ⏱️ Take Your Time — Loader & Codename Registration
- Layar pemuatan awal dengan animasi Joker 2D berputar di sudut kanan bawah.
- Formulir memasukkan nama/codename dengan gaya tipografi menu Persona 5.
- Transisi meluncur ke atas (*straight upward warp*) tanpa hambatan langsung ke beranda.

### 2. 🎵 Metaverse Audio Engine
- **Background Music (BGM)**: Pemutar lagu latar terintegrasi memainkan *"Beneath the Mask"*, lengkap dengan kontrol toggle play/pause dan volume.
- **Sound Effects (SFX)**: Respons audio taktil instan untuk aksi pengguna (hover tombol, klik menu, slash tab, switch, dan notifikasi).

### 3. 📊 Phansite Public Poll ("The Voice of the People")
- Fitur polling interaktif bertema Persona 5: *"Apakah Phantom Thieves benar-benar ada?"*.
- Kalkulasi persentase suara real-time dengan bar indikator dinamis *Crimson Red* dan *Shadow Black*.
- Validasi suara agar setiap pengunjung dapat berpartisipasi secara adil.

### 4. 💬 The Metaverse Archive (Live Comment & Discussion Board)
- Forum diskusi publik tempat para *Phantom Aficionados* saling bertukar pesan.
- **Ransom Letter Tiles**: Nama pengguna dirender layaknya potongan huruf acak majalah bergaya Persona 5 yang miring dan dinamis.
- **P5 White Speech Bubble**: Balon obrolan putih tebal dengan border hitam kontras, drop shadow komik, dan penanda waktu relatif.
- Tampilan input bersih tanpa gangguan outline biru bawaan peramban.

### 5. 💌 Send a Calling Card (Contact & Inquiry)
- Formulir kontak khusus untuk merekrut atau menghubungi developer layaknya mengirim **Surat Peringatan (Calling Card)** para Pencuri Hati.
- Sistem batas kuota harian (maksimum 3 Calling Card per 24 jam per IP) untuk mencegah spam.

### 6. 🏰 Palace Missions & Confidants (Projects & Experience)
- **Projects (Palace Infiltrations)**: Showcase karya dan aplikasi web dengan badge teknologi, screenshot, deskripsi, serta tautan repositori dan demo langsung.
- **Experience (Confidant Cooperations)**: Riwayat karier, magang, dan organisasi yang dianalogikan sebagai tingkatan kerja sama Confidant.
- **Certificates (Treasures)**: Koleksi sertifikat dan keahlian yang telah diraih.

### 7. 👑 Velvet Room / Palace Ruler Dashboard (Admin CMS)
- Panel kendali admin aman berbasis autentikasi (Laravel Breeze):
  - Kelola data Projects (Tambah, Edit, Hapus, Upload Gambar).
  - Kelola riwayat Experience dan Sertifikat.
  - Kelola dan pantau Calling Cards yang masuk dari calon klien/recruiter.
  - Manajemen komentar dan arsip Metaverse.

---

## 🎨 Desain & Estetika (Persona 5 Royal Aesthetics)

- **Palet Warna**: Crimson Red (`#E60012` / `#E8003D`), Shadow Black (`#0a0a0a`), Pure White (`#FFFFFF`), Halftone Grayscale Stars Wallpaper.
- **Tipografi**: Font khusus *Persona 5 Menu Prototype*, *Persona 5 Main Font*, dan *P5 Slanted Serif*.
- **Gaya Geometris**: Sudut kemiringan ekstrem (`skewX(-12deg)`), strip diagonal, halftone dot patterns, dan potongan koran acak.
- **Mikro-Interaksi**: Animasi hover tegas, efek getar halus, dan transisi dramatis ala panel komik.

---

## 🛠️ Teknologi yang Digunakan (Tech Stack)

| Komponen | Teknologi |
| :--- | :--- |
| **Backend** | [Laravel 11](https://laravel.com) (PHP 8.2+) |
| **Frontend** | [React 18](https://react.dev) + [Inertia.js](https://inertiajs.com) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com) + Custom Persona 5 Stylesheet |
| **Bundler** | [Vite 6](https://vitejs.dev) |
| **Database** | SQLite (Default) / MySQL Support |
| **Autentikasi**| Laravel Breeze (Inertia React) |
| **Audio Engine** | Custom Web Audio Handler (BGM & SFX) |

---

## 🚀 Panduan Menjalankan Proyek (Getting Started)

### Prasyarat
- **PHP** versi 8.2 atau lebih tinggi
- **Composer**
- **Node.js** (LTS disarankan, >= 18) & **npm**

### Langkah Instalasi

1. **Masuk ke folder proyek Laravel**:
   ```bash
   cd laravel_app
   ```

2. **Install dependensi PHP & JavaScript**:
   ```bash
   composer install
   npm install
   ```

3. **Salin file konfigurasi environment**:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Persiapkan Database & Jalankan Migrasi**:
   ```bash
   # Buat database SQLite jika belum tersedia
   touch database/database.sqlite

   # Jalankan migrasi dan seeder
   php artisan migrate --seed
   ```

5. **Kompilasi Aset Frontend**:
   ```bash
   npm run build
   ```

6. **Jalankan Server**:
   ```bash
   composer run dev
   ```
   *Atau jalankan pada dua terminal terpisah:*
   ```bash
   # Terminal 1:
   php artisan serve

   # Terminal 2:
   npm run dev
   ```

7. **Buka di Browser**:
   Akses alamat lokal:
   ```
   http://localhost:8000
   ```

---

## 🛡️ Hak Cipta & Penafian (Disclaimer)

*Persona 5*, *Persona 5 Royal*, karakter Joker, logo Phantom Thieves, ilustrasi, efek suara, dan lagu *"Beneath the Mask"* merupakan hak cipta dan merek dagang milik **ATLUS / SEGA Corporation**. Proyek ini dikembangkan semata-mata untuk tujuan edukasi, demonstrasi teknis pengembangan web, dan portofolio non-komersial.

---

<p align="center">
  <b>PHANTOM AFICIONADO — TAKE YOUR HEART!</b><br>
  <i>Designed and built for all Phantom Thieves at heart.</i>
</p>
