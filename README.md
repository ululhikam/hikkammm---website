# Hikkammm — Portfolio

Website portfolio Ulul Hikam, dipisah menjadi dua aplikasi:

- `frontend/` — Vue 3 + Vite + Tailwind (deploy ke Vercel)
- `backend/` — Vercel Serverless Functions + Supabase (deploy ke Vercel)

Kontrak API ada di [`apicontract.yaml`](./apicontract.yaml) dan menjadi acuan
implementasi backend.

## Struktur

```text
.
├── apicontract.yaml          # OpenAPI 3.1 — sumber kebenaran API
├── frontend/
│   ├── src/
│   │   ├── components/       # komponen UI
│   │   ├── sections/         # section halaman Home
│   │   ├── views/            # halaman route
│   │   ├── router/           # vue-router
│   │   ├── data/             # fallback data statis
│   │   └── lib/              # typed API client
│   ├── public/
│   └── vercel.json           # SPA rewrite
└── backend/
    ├── api/                  # Vercel Serverless Functions
    ├── src/                  # helper, mapper, validasi, tipe
    ├── supabase/
    │   ├── migrations/       # schema database
    │   └── seed.sql          # data awal
    └── vercel.json
```

## Quick start

### 1. Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Frontend berjalan di `http://localhost:5173`. Request ke `/api` di-proxy ke
`http://localhost:3000` (bisa diubah lewat `VITE_API_PROXY_TARGET`).

### 2. Supabase

1. Buat project baru di [supabase.com](https://supabase.com).
2. Buka **SQL Editor**, jalankan isi
   `backend/supabase/migrations/20261028000000_init.sql`.
3. Jalankan `backend/supabase/seed.sql` untuk mengisi konten awal.
4. Ambil **Project URL** dan **service_role key** dari
   *Project Settings → API*.

> `service_role` hanya dipakai di backend. Jangan pernah memasukkannya ke
> frontend atau commit ke git.

### 3. Backend

```bash
cd backend
npm install
cp .env.example .env.local
# isi SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_API_TOKEN
npx vercel dev
```

API berjalan di `http://localhost:3000`. Cek:

```bash
curl http://localhost:3000/api/health
curl http://localhost:3000/api/projects
```

### 4. Admin panel

Buka `http://localhost:5173/admin`, lalu masukkan nilai `ADMIN_API_TOKEN`
dari environment backend. Token disimpan di browser (localStorage atau
sessionStorage, tergantung opsi "Ingat sesi") dan dikirim sebagai Bearer token
ke endpoint admin.

Admin panel bisa dipakai untuk CRUD:

- projects
- buildings
- experiences
- awards
- profile
- pesan kontak (ubah status dan hapus)

Halaman admin memakai layout terpisah dan tidak menampilkan navbar/efek
public site. Semua endpoint mutasi tetap dilindungi Bearer token di backend.

## Deploy ke Vercel

Deploy sebagai dua project terpisah dari repo yang sama:

| Project  | Root Directory | Build Command   | Output |
| -------- | -------------- | --------------- | ------ |
| Frontend | `frontend`     | `npm run build` | `dist` |
| Backend  | `backend`      | —               | —      |

Environment variables backend: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`,
`ADMIN_API_TOKEN`, `CORS_ORIGINS`.

Environment variable frontend:

```env
VITE_API_BASE_URL=https://backend-eight-alpha-61.vercel.app/api
```

Nilai production ini sudah disimpan di `frontend/.env.production`, jadi build
Vercel otomatis memakai backend tersebut.

Setelah backend punya domain, tambahkan domain frontend ke `CORS_ORIGINS`.

## Integrasi konten publik

Halaman publik (projects, buildings, experiences, awards, about, hero, dan
contact) mengambil data dari API lewat helper di
`frontend/src/lib/publicContent.ts`. Data statis di `frontend/src/data/` tetap
disimpan sebagai fallback, sehingga website masih tampil normal kalau API
sedang tidak bisa diakses.

```ts
import { loadProjects } from '@/lib/publicContent'

const projects = await loadProjects()
```

Kalau backend mengembalikan data kosong, halaman akan menampilkan kosong
(mengikuti isi database). Fallback statis hanya dipakai saat request gagal.

## Dokumentasi

- Kontrak API: [`apicontract.yaml`](./apicontract.yaml)
- Setup backend & daftar endpoint: [`backend/README.md`](./backend/README.md)
