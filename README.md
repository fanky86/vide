# Admin Video Panel

Panel video dengan Supabase: upload video, tampilkan, dan hapus khusus admin.

## Fitur
- Login/Register menggunakan Supabase Auth
- Upload video ke Supabase Storage
- Tampilkan daftar video (klik untuk play)
- Hapus video hanya oleh admin (user yang login)

## Cara Jalankan
1. Clone repo
2. Buat project di Supabase, buat table `videos` dan aktifkan storage `videos`
3. Salin `.env.local.example` ke `.env.local` dan isi dengan key Supabase kamu
4. Jalankan:
```bash
npm install
npm run dev
