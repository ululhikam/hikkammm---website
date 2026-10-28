-- Seed konten awal (mirror konten statis di frontend).
-- Aman dijalankan ulang: menggunakan ON CONFLICT.

insert into public.projects
  (slug, title, category, tech, year, status, description, full_description, image_url, repo_url, live_url, featured, sort_order)
values
  (
    'checker-hoax-scam',
    'System Checker Hoax & Scam',
    'Web App',
    array['Python', 'NLP', 'Web'],
    '2025',
    'in-progress',
    'Sistem untuk mengecek apakah sebuah pesan atau informasi termasuk hoax atau scam.',
    'System Checker Hoax & Scam membantu pengguna memverifikasi pesan atau informasi yang mencurigakan sebelum mempercayai atau menyebarkannya. Dibangun di sekitar NLP dan pendekatan klasifikasi teks sebagai langkah menuju pemanfaatan LLM yang lebih luas.',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000',
    null,
    null,
    true,
    1
  ),
  (
    'concern-ecosystem',
    'Concern Ecosystem',
    'Automation',
    array['Python', 'Node.js'],
    '2025',
    'in-progress',
    'Ekosistem internal Concern Dev: scraping data Google Maps, otomasi WhatsApp, dan project management.',
    'Concern Ecosystem adalah kumpulan tools internal untuk operasional Concern Dev — scraping data Google Maps untuk riset klien, otomasi pengiriman WhatsApp, dan sistem project management untuk menangani banyak klien sekaligus.',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000',
    null,
    null,
    true,
    2
  ),
  (
    'gis-stunting',
    'Website GIS — Pemetaan Anak Stunting',
    'Web App',
    array['Laravel', 'PostgreSQL', 'GIS'],
    '2025',
    'in-progress',
    'Website pemetaan sebaran anak stunting secara geografis dengan GIS.',
    'Sebuah website GIS untuk memetakan sebaran anak stunting per wilayah, sehingga data bisa dilihat secara visual di peta dan dipakai sebagai dasar evaluasi program kesehatan.',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000',
    null,
    null,
    false,
    3
  ),
  (
    'fess-n-curious',
    'Fess N Curious',
    'Web App',
    array['Vue', 'Laravel'],
    '2025',
    'live',
    'Web app untuk confess anonim — orang bisa mengirim cerita atau pengakuan tanpa nama.',
    'Fess N Curious adalah web app tempat pengguna bisa mengirim confess (pengakuan atau curhatan) secara anonim, membagikan momen tanpa harus menampilkan identitas.',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000',
    null,
    null,
    false,
    4
  ),
  (
    'kelola-umkm',
    'Kelola UMKM',
    'Web App',
    array['Laravel', 'MySQL'],
    '2025',
    'in-progress',
    'Aplikasi pengelolaan UMKM: barang masuk/keluar, karyawan, dan arus kas.',
    'Kelola UMKM membantu pelaku UMKM mencatat barang masuk dan keluar (keluar = terjual), mengelola data karyawan, serta memantau uang masuk dan keluar agar keuangan lebih rapi.',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000',
    null,
    null,
    false,
    5
  ),
  (
    'cathy',
    'Cathy — Aplikasi Kesehatan',
    'Mobile / App',
    array['App', 'Web'],
    '2025',
    'concept',
    'Aplikasi inovasi untuk kesehatan, dipresentasikan di lomba IIIREX.',
    'Cathy adalah aplikasi inovasi di bidang kesehatan yang dikembangkan untuk kompetisi IIIREX — inovasi aplikasi untuk kesehatan. Project ini mengasah kemampuan product thinking dan eksekusi ide.',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000',
    null,
    null,
    false,
    6
  )
on conflict (slug) do update set
  title = excluded.title,
  category = excluded.category,
  tech = excluded.tech,
  year = excluded.year,
  status = excluded.status,
  description = excluded.description,
  full_description = excluded.full_description,
  image_url = excluded.image_url,
  repo_url = excluded.repo_url,
  live_url = excluded.live_url,
  featured = excluded.featured,
  sort_order = excluded.sort_order;

insert into public.buildings
  (slug, title, tagline, description, detail, link_url, sort_order)
values
  (
    'concern-dev',
    'Concern Dev',
    'Software house',
    'Membangun website, aplikasi web, dan sistem digital untuk organisasi, bisnis, dan individu.',
    'Concern Dev adalah software house yang sedang dibangun sebagai inisiatif bisnis nyata — bukan sekadar portfolio project. Layanannya mencakup website, aplikasi web, dan sistem digital untuk organisasi, bisnis, maupun individu, dengan fokus pada sistem yang benar-benar dipakai dan mudah dirawat.',
    'https://concern.web.id',
    1
  ),
  (
    'necromancer-occultism',
    'Necromancer Occultism',
    'Clothing brand',
    'Brand clothing yang mengeksplorasi irisan fashion, identitas, filosofi, dan komunitas.',
    'Necromancer Occultism adalah clothing brand yang sedang dibangun sebagai sisi kreatif dan kewirausahaan di luar software — bermain di area branding, product building, creative direction, marketing, community, dan filosofi.',
    'https://instagram.com/necromanceroccultism',
    2
  )
on conflict (slug) do update set
  title = excluded.title,
  tagline = excluded.tagline,
  description = excluded.description,
  detail = excluded.detail,
  link_url = excluded.link_url,
  sort_order = excluded.sort_order;

insert into public.experiences
  (id, organization, title, description, type, sort_order)
values
  (
    '11111111-1111-4111-8111-111111111101',
    'Informatics Student Association',
    'Vice Chairman',
    'Led major programs — Syntax (intro workshops & competitions) and DeForka (academic & non-academic competitions + seminar).',
    'organization',
    1
  ),
  (
    '11111111-1111-4111-8111-111111111102',
    'BEM UST',
    'Staff — Ministry of Foreign Affairs',
    'Communication, external relations, networking, and organizational collaboration.',
    'organization',
    2
  ),
  (
    '11111111-1111-4111-8111-111111111103',
    'Teater',
    'Project Manager',
    'Coordinating teams, production, and execution under deadlines.',
    'organization',
    3
  ),
  (
    '11111111-1111-4111-8111-111111111104',
    'HMI (Himpunan Mahasiswa Islam)',
    'Staff — PTKP',
    'Student community involvement and leadership development.',
    'organization',
    4
  )
on conflict (id) do update set
  organization = excluded.organization,
  title = excluded.title,
  description = excluded.description,
  type = excluded.type,
  sort_order = excluded.sort_order;

insert into public.awards
  (id, title, issuer, year, description, sort_order)
values
  (
    '22222222-2222-4222-8222-222222222201',
    'Lomba Puisi',
    null,
    null,
    'Juara lomba puisi — kemampuan menulis kreatif di tingkat event.',
    1
  ),
  (
    '22222222-2222-4222-8222-222222222202',
    'IIIREX',
    null,
    null,
    'Lomba inovasi aplikasi untuk kesehatan — menghadirkan Cathy, aplikasi inovasi kesehatan.',
    2
  )
on conflict (id) do update set
  title = excluded.title,
  issuer = excluded.issuer,
  year = excluded.year,
  description = excluded.description,
  sort_order = excluded.sort_order;

insert into public.profile
  (id, name, headline, bio, location, email, avatar_url, socials)
values (
  1,
  'Ulul Hikam',
  'Software Developer & Builder',
  $bio$[
    "I'm Ulul Hikam — an Informatics student and software developer based in Indonesia, called Hikam. My primary focus is web development and software engineering: building things that actually work in the real world.",
    "My path started with web applications, then grew into backend development, databases, system architecture, and the fundamentals of software. I care more about understanding why things work than collecting frameworks.",
    "Right now I'm expanding into the data ecosystem — Data Science, Data Engineering, and Data Analytics — and exploring AI, especially Natural Language Processing. Software Development -> Data -> AI/NLP -> Product & Business is the direction I'm heading.",
    "I don't just study. I build — Concern Dev, a software house for websites and digital systems, and Necromancer Occultism, a clothing brand about identity and community. Leadership, events, and project management are part of the journey too."
  ]$bio$::jsonb,
  'Yogyakarta, Indonesia',
  'ululhikam13@gmail.com',
  null,
  $socials$[
    {"name": "Website", "url": "https://hikkammm.my.id"},
    {"name": "Concern Dev", "url": "https://concern.web.id"},
    {"name": "Instagram", "url": "https://instagram.com/hikkammm_"},
    {"name": "Instagram (Brand)", "url": "https://instagram.com/necromanceroccultism"},
    {"name": "LinkedIn", "url": "https://id.linkedin.com/in/ulul-hikam"},
    {"name": "GitHub", "url": "https://github.com/ululhikam"},
    {"name": "WhatsApp", "url": "https://wa.me/6285211435617"}
  ]$socials$::jsonb
)
on conflict (id) do update set
  name = excluded.name,
  headline = excluded.headline,
  bio = excluded.bio,
  location = excluded.location,
  email = excluded.email,
  avatar_url = excluded.avatar_url,
  socials = excluded.socials;
