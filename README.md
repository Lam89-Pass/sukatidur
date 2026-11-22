# Portofolio Muhamad Nur Salam (Alam)

Website portofolio resmi **Muhamad Nur Salam** (Teknik Informatika Universitas Pasundan) dengan spesialisasi pada **Network Engineering**, **IT Infrastructure**, dan **Cybersecurity**.

Didesain dengan tampilan elegan, cepat, ringan (zero lag, 100% static HTML), dan arsitektur modular yang rapi agar proses perawatan/maintenance sangat mudah dan tidak membingungkan.

---

## 📁 Struktur Folder & File Modular

Setiap section website dipisahkan ke dalam filenya masing-masing di dalam folder `src/sections/`. Anda tidak perlu lagi mencari-cari di dalam satu file HTML raksasa yang panjang.

```text
├── index.html                  # File produksi utama (hasil kompilasi, siap deploy)
├── build.js                    # Script kompilasi super cepat (~10ms, tanpa dependensi)
├── dev.js                      # Server lokal & auto-rebuild saat file diedit
├── package.json                # Perintah npm run build & npm run dev
├── cv-muhamad-nur-salam.pdf    # File CV resmi (diunduh saat tombol diklik)
├── assets/
│   └── images/
│       ├── profile.png         # Foto / Avatar profil utama
│       └── certificate-wpu.png # Contoh sertifikat
└── src/
    ├── template.html           # Template induk (head, style, skrip, dan penampung)
    └── sections/               # SATU FILE PER SECTION (Ubah di sini!)
        ├── header.html         # Navbar, logo brand, menu navigasi & sidebar
        ├── hero.html           # Banner utama (Nama, headline, tombol CV & WhatsApp)
        ├── highlights.html     # 5 Kartu kompetensi inti
        ├── about.html          # Tentang saya, statistik IPK, pengalaman & domisili
        ├── services.html       # 5 Layanan & solusi teknis
        ├── skills.html         # Progress bar keahlian & badge tech stack lengkap
        ├── experience.html     # Pengalaman kerja & organisasi (GDG, PT Berkah, dll.)
        ├── education.html      # Pendidikan (S1 UNPAS & SMKN 1 Cidaun)
        ├── certifications.html # Sertifikasi LSP & 12 Pelatihan Teknis
        ├── portfolios.html     # Highlight 4 proyek teknis unggulan
        ├── cta.html            # Ajakan kolaborasi & tombol kontak
        └── footer.html         # Footer, tautan cepat, dan copyright
```

---

## 🛠️ Cara Maintenance & Menjalankan

### 1. Menjalankan Mode Pengembangan (Development Server)
Jalankan perintah berikut:
```bash
npm run dev
# atau
node dev.js
```
Server lokal akan aktif di `http://localhost:3000`. Setiap kali Anda mengedit file di dalam `src/sections/`, sistem akan otomatis melakukan kompilasi ulang secara instan!

### 2. Melakukan Kompilasi Manual (Build)
Jika Anda hanya ingin menyusun ulang `index.html`:
```bash
npm run build
# atau
node build.js
```

### 3. Deploy ke Hosting (GitHub Pages / Vercel / Netlify / Cloudflare Pages / Hosting cPanel)
Website ini menghasilkan file `index.html` murni yang sangat ringan dan cepat:
- **GitHub Pages / cPanel / Shared Hosting**: Cukup upload seluruh isi folder ini. File `index.html` langsung terbaca tanpa perlu server khusus.
- **Vercel / Netlify**: Konfigurasikan build command `npm run build` dan output directory `.` (root), atau deploy langsung secara statis.

---

## 📝 Panduan Mengubah Konten

| Yang Ingin Diubah | Lokasi File |
|---|---|
| Menu Navigasi / Logo / Menu HP | `src/sections/header.html` |
| Nama / Headline / Tombol Hero | `src/sections/hero.html` |
| Ringkasan Kompetensi Inti | `src/sections/highlights.html` |
| Biodata / Domisili / Statistik | `src/sections/about.html` |
| Bidang Layanan & Solusi | `src/sections/services.html` |
| Nilai Keahlian & Daftar Skill | `src/sections/skills.html` |
| Pengalaman Kerja & Organisasi | `src/sections/experience.html` |
| Riwayat Pendidikan & IPK | `src/sections/education.html` |
| Sertifikasi LSP & Pelatihan | `src/sections/certifications.html` |
| Proyek & Portofolio Teknis | `src/sections/portfolios.html` |
| Kontak WhatsApp & Email | `src/sections/cta.html` dan `src/sections/footer.html` |
| Foto Profil Utama (Hero & Sidebar) | Ganti file `assets/images/profile.png` (atau `.webp`) |
| Foto Profil Ke-2 (Bagian Layanan) | Ganti file `assets/images/profile-2.png` (atau `.webp`) |
| File CV PDF | Ganti file `cv-muhamad-nur-salam.pdf` |
