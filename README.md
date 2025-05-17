# RememberMe - Aplikasi Manajemen Pengingat Obat

RememberMe adalah aplikasi web progresif (PWA) yang membantu penderita Alzheimer dan keluarganya untuk mengelola pengobatan, berkomunikasi dengan AI asisten, dan memberikan fitur SOS untuk situasi darurat.

## Fitur Utama

- 💊 Pengingat pengobatan untuk membantu pelacakan dosis dan jadwal obat
- 🤖 AI Chat untuk mendapatkan bantuan dan informasi tentang penyakit Alzheimer
- 🆘 Tombol SOS untuk keadaan darurat
- 👤 Profil pengguna untuk menyimpan informasi penting
- 📱 Desain responsif yang bekerja di semua perangkat
- ⚡ Dapat diinstal sebagai aplikasi (PWA)

## Teknologi yang Digunakan

- HTML, CSS, dan JavaScript untuk front-end
- TailwindCSS untuk styling
- PWA untuk kemampuan instalasi aplikasi
- LocalStorage untuk penyimpanan data lokal
- Vercel untuk deployment

## Cara Menggunakan

1. Buka website RememberMe
2. Daftar atau masuk ke akun Anda
3. Tambahkan jadwal obat di bagian Medicine
4. Gunakan fitur AI Chat jika memiliki pertanyaan
5. Atur kontak darurat untuk fitur SOS

## Cara Mengembangkan

1. Clone repository ini
2. Install dependencies dengan `npm install`
3. Jalankan server development dengan `npm run dev`
4. Build untuk production dengan `npm run build`

## Cara Menggunakan Inspect Element untuk Melihat Website dengan Ukuran iPhone

### Di Google Chrome atau Microsoft Edge

1. Buka website RememberMe di browser Anda
2. Klik kanan pada halaman dan pilih "Inspect" atau "Inspect Element" (atau tekan `F12` atau `Ctrl+Shift+I` di Windows / `Cmd+Option+I` di Mac)
3. Di panel Developer Tools yang muncul, klik ikon "Toggle Device Toolbar" yang terlihat seperti tablet dan smartphone (atau tekan `Ctrl+Shift+M` di Windows / `Cmd+Shift+M` di Mac)
4. Sekarang Anda akan melihat website dalam mode responsive
5. Di bagian atas, Anda akan melihat dropdown untuk memilih jenis perangkat. Pilih "iPhone SE", "iPhone 12 Pro", atau perangkat iPhone lainnya
6. Website akan otomatis menyesuaikan ke ukuran layar iPhone yang dipilih
7. Anda juga bisa mengganti orientasi dari portrait ke landscape dengan mengklik ikon rotasi di samping dropdown perangkat

### Di Mozilla Firefox

1. Buka website RememberMe di Firefox
2. Klik kanan pada halaman dan pilih "Inspect Element" (atau tekan `F12`)
3. Di panel Developer Tools, klik ikon "Responsive Design Mode" yang terlihat seperti tablet dan smartphone (atau tekan `Ctrl+Shift+M`)
4. Pilih "iPhone" dari dropdown perangkat yang tersedia
5. Sesuaikan orientasi atau ukuran sesuai kebutuhan

### Di Safari (Mac)

1. Pastikan menu Developer sudah diaktifkan di Safari (Preferences > Advanced > Show Develop menu)
2. Buka website RememberMe di Safari
3. Pilih menu Develop > Enter Responsive Design Mode (atau tekan `Ctrl+Cmd+R`)
4. Pilih jenis iPhone dari preset perangkat yang tersedia

### Tips Tambahan

- Anda bisa melihat bagaimana website berjalan dengan koneksi internet yang berbeda dengan menggunakan fitur throttling di tab Network
- Gunakan tab Console untuk melihat error atau log
- Anda bisa mengubah ukuran layar secara manual dengan menarik tepi area preview
- Mode Device Toolbar juga memungkinkan Anda mensimulasikan sentuhan pada perangkat seluler

## Menyesuaikan Desain Responsif

Jika Anda melihat masalah pada tampilan di ukuran iPhone:

1. Gunakan Inspect Element untuk mengidentifikasi elemen yang bermasalah
2. Periksa CSS yang diterapkan pada elemen tersebut
3. Coba ubah nilai properti di panel Styles untuk menguji perubahan
4. Setelah mendapatkan tampilan yang diinginkan, terapkan perubahan tersebut ke file CSS atau tambahkan inline style

## Kontribusi

Kontribusi selalu diterima. Silahkan fork repository ini dan buat pull request dengan fitur atau perbaikan Anda.

## Lisensi

MIT

## Deployment sebagai Aplikasi Mobile

Aplikasi RememberMe dapat di-deploy sebagai aplikasi mobile menggunakan dua pendekatan:

### Metode 1: Menggunakan PWA (Progressive Web App)

PWA sudah dikonfigurasi dan siap digunakan. Ikuti langkah berikut untuk hosting dan penggunaan:

1. Build aplikasi:
```bash
npm run build:prod
```

2. Deploy ke hosting web (Firebase, Netlify, Vercel, dll)

3. Buka di perangkat mobile dan pilih "Add to Home Screen" di browser

### Metode 2: Menggunakan Capacitor (Native Mobile App)

Untuk mengkonversi aplikasi web menjadi aplikasi native, ikuti langkah-langkah berikut:

1. Install dependencies:
```bash
npm install
```

2. Inisialisasi Capacitor:
```bash
npm run capacitor:init
```

3. Tambahkan platform:
```bash
# Untuk Android
npm run capacitor:add:android

# Untuk iOS (memerlukan macOS)
npm run capacitor:add:ios
```

4. Build aplikasi web:
```bash
npm run build:prod
```

5. Sync ke platform native:
```bash
npm run capacitor:sync
```

6. Buka project di Android Studio atau Xcode:
```bash
# Untuk Android
npm run capacitor:open:android

# Untuk iOS
npm run capacitor:open:ios
```

7. Build dan deploy dari IDE masing-masing platform

## Persyaratan

- Node.js 14+
- NPM 6+
- Android Studio (untuk build Android)
- Xcode (untuk build iOS, hanya macOS)

## Icon dan Splash Screen

Untuk menghasilkan icon dan splash screen yang sesuai untuk semua platform:
1. Letakkan file icon.png (1024x1024) dan splash.png (2732x2732) di folder `resources/`
2. Install Capacitor Assets:
```bash
npm install -g @capacitor/assets
```
3. Generate assets:
```bash
npx capacitor-assets generate
```

## Konfigurasi Push Notification

Untuk mengaktifkan push notification:
1. Install plugin push notification:
```bash
npm install @capacitor/push-notifications
```
2. Konfigurasi di capacitor.config.ts
3. Ikuti petunjuk untuk konfigurasi Firebase Cloud Messaging (Android) dan APN (iOS) 