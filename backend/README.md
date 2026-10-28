# Hikkammm API

Backend portfolio Hikkammm. Berjalan sebagai Vercel Serverless Functions dengan
Supabase (PostgreSQL) sebagai database. Implementasi mengikuti
[`../apicontract.yaml`](../apicontract.yaml).

## Stack

- Node.js 22 + TypeScript
- Vercel Serverless Functions (`api/`)
- Supabase (`@supabase/supabase-js`, service role key di server)
- Zod untuk validasi request

## Struktur

```text
backend/
|-- api/
|   |-- health.ts
|   |-- profile.ts                 # GET publik + PATCH admin
|   |-- projects/
|   |   |-- index.ts               # GET publik + POST admin
|   |   `-- [slug].ts              # GET publik + PATCH/DELETE admin
|   |-- buildings/
|   |   |-- index.ts
|   |   `-- [slug].ts
|   |-- experiences/
|   |   |-- index.ts               # GET publik + POST admin
|   |   `-- [id].ts                # PATCH/DELETE admin
|   |-- awards/
|   |   |-- index.ts
|   |   `-- [id].ts
|   `-- contact/
|       |-- index.ts               # GET admin + POST publik
|       `-- [id].ts                # PATCH/DELETE admin
|-- src/
|   |-- http.ts                    # CORS, error handling, auth
|   |-- supabase.ts                # Supabase client + error mapping
|   |-- validation.ts              # Zod schemas create/update/query
|   |-- payloads.ts                # Mapping input camelCase -> kolom DB
|   |-- mappers.ts                 # snake_case DB -> camelCase API
|   `-- types.ts
|-- supabase/
|   |-- migrations/
|   `-- seed.sql
|-- .env.example
`-- vercel.json
```

## Setup

1. Install dependency:

   ```bash
   npm install
   ```

2. Buat project Supabase, lalu jalankan SQL berikut di **SQL Editor** secara
   berurutan:
   - `supabase/migrations/20261028000000_init.sql`
   - `supabase/seed.sql`

   Alternatif lewat Supabase CLI (setelah `supabase init` di folder ini):

   ```bash
   supabase link --project-ref <project-ref>
   supabase db push
   ```

3. Salin environment:

   ```bash
   cp .env.example .env.local
   ```

   Isi variabel berikut:

   | Variable | Keterangan |
   | --- | --- |
   | `SUPABASE_URL` | Project URL Supabase |
   | `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server-only) |
   | `ADMIN_API_TOKEN` | Token acak untuk endpoint admin |
   | `CORS_ORIGINS` | Origin frontend, pisahkan dengan koma |

4. Jalankan lokal:

   ```bash
   npx vercel dev
   ```

   API tersedia di `http://localhost:3000/api`.

## Endpoint

| Method | Path | Auth | Keterangan |
| --- | --- | --- | --- |
| GET | `/api/health` | - | Status API + database |
| GET | `/api/profile` | - | Profil pemilik portfolio |
| PATCH | `/api/profile` | Bearer | Update profil |
| GET | `/api/projects` | - | List project (filter `category`, `status`, `featured`, `q`, `limit`, `offset`) |
| POST | `/api/projects` | Bearer | Tambah project |
| GET | `/api/projects/:slug` | - | Detail project |
| PATCH | `/api/projects/:slug` | Bearer | Update project |
| DELETE | `/api/projects/:slug` | Bearer | Hapus project |
| GET | `/api/buildings` | - | List building |
| POST | `/api/buildings` | Bearer | Tambah building |
| GET | `/api/buildings/:slug` | - | Detail building |
| PATCH | `/api/buildings/:slug` | Bearer | Update building |
| DELETE | `/api/buildings/:slug` | Bearer | Hapus building |
| GET | `/api/experiences` | - | List pengalaman |
| POST | `/api/experiences` | Bearer | Tambah pengalaman |
| PATCH | `/api/experiences/:id` | Bearer | Update pengalaman |
| DELETE | `/api/experiences/:id` | Bearer | Hapus pengalaman |
| GET | `/api/awards` | - | List pencapaian |
| POST | `/api/awards` | Bearer | Tambah pencapaian |
| PATCH | `/api/awards/:id` | Bearer | Update pencapaian |
| DELETE | `/api/awards/:id` | Bearer | Hapus pencapaian |
| POST | `/api/contact` | - | Kirim pesan kontak |
| GET | `/api/contact` | Bearer | List pesan (filter `status`) |
| PATCH | `/api/contact/:id` | Bearer | Ubah status pesan |
| DELETE | `/api/contact/:id` | Bearer | Hapus pesan |

Semua endpoint admin memakai header:

```http
Authorization: Bearer <ADMIN_API_TOKEN>
```

Contoh:

```bash
# Pesan kontak
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Budi","email":"budi@example.com","subject":"Kerja sama","message":"Halo, saya ingin diskusi project."}'

# List pesan (admin)
curl http://localhost:3000/api/contact \
  -H "Authorization: Bearer $ADMIN_API_TOKEN"

# Tambah project (admin)
curl -X POST http://localhost:3000/api/projects \
  -H "Authorization: Bearer $ADMIN_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"slug":"demo-project","title":"Demo Project","category":"Web App","tech":["Vue"],"year":"2026","status":"in-progress","description":"Project contoh."}'

# Update project (admin)
curl -X PATCH http://localhost:3000/api/projects/demo-project \
  -H "Authorization: Bearer $ADMIN_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"featured":true}'

# Hapus project (admin)
curl -X DELETE http://localhost:3000/api/projects/demo-project \
  -H "Authorization: Bearer $ADMIN_API_TOKEN"
```

## Format response

```json
// List
{ "data": [], "meta": { "total": 0, "limit": 20, "offset": 0 } }

// Single
{ "data": {} }

// Error
{ "error": { "code": "validation_error", "message": "Request tidak valid", "details": [] } }
```

`DELETE` mengembalikan `204 No Content` jika berhasil. Slug yang sudah dipakai
akan menghasilkan `409 conflict`.

## Deploy

1. Import repo ke Vercel.
2. Set **Root Directory** ke `backend`.
3. Tambahkan environment variables yang sama seperti `.env.example`.
4. Deploy. `vercel.json` sudah mengatur region `sin1`, durasi fungsi, dan
   rewrite `/` ke `/api/health`.

URL production saat ini: `https://backend-eight-alpha-61.vercel.app`.
Pastikan `CORS_ORIGINS` di Vercel berisi domain frontend yang dipakai.