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
├── api/
│   ├── health.ts
│   ├── profile.ts
│   ├── projects/
│   │   ├── index.ts          # GET /api/projects
│   │   └── [slug].ts         # GET /api/projects/:slug
│   ├── buildings/
│   │   ├── index.ts
│   │   └── [slug].ts
│   ├── experiences.ts
│   ├── awards.ts
│   └── contact/
│       ├── index.ts          # GET (admin) + POST (publik)
│       └── [id].ts           # PATCH (admin)
├── src/
│   ├── http.ts               # CORS, error handling, auth
│   ├── supabase.ts           # Supabase client
│   ├── validation.ts         # Zod schemas
│   ├── mappers.ts            # snake_case DB -> camelCase API
│   └── types.ts
├── supabase/
│   ├── migrations/
│   └── seed.sql
├── .env.example
└── vercel.json
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
| GET | `/api/health` | — | Status API + database |
| GET | `/api/profile` | — | Profil pemilik portfolio |
| GET | `/api/projects` | — | List project (filter `category`, `status`, `featured`, `q`, `limit`, `offset`) |
| GET | `/api/projects/:slug` | — | Detail project |
| GET | `/api/buildings` | — | List building |
| GET | `/api/buildings/:slug` | — | Detail building |
| GET | `/api/experiences` | — | List pengalaman |
| GET | `/api/awards` | — | List pencapaian |
| POST | `/api/contact` | — | Kirim pesan kontak |
| GET | `/api/contact` | Bearer | List pesan (filter `status`) |
| PATCH | `/api/contact/:id` | Bearer | Ubah status pesan |

Contoh:

```bash
# Pesan kontak
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Budi","email":"budi@example.com","subject":"Kerja sama","message":"Halo, saya ingin diskusi project."}'

# Endpoint admin
curl http://localhost:3000/api/contact \
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

## Deploy

1. Import repo ke Vercel.
2. Set **Root Directory** ke `backend`.
3. Tambahkan environment variables yang sama seperti `.env.example`.
4. Deploy. `vercel.json` sudah mengatur region `sin1`, durasi fungsi, dan
   rewrite `/` ke `/api/health`.

Setelah deploy, update `servers` di `apicontract.yaml` dan
`VITE_API_BASE_URL` di frontend dengan URL backend yang sebenarnya.
