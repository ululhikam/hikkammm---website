export interface Project {
  slug: string
  title: string
  category: string
  tech: string
  year: string
  status: 'Live' | 'In Progress' | 'Concept' | 'Archived'
  desc: string
  fullDesc: string
  img: string
  repo?: string
  live?: string
}

// TODO: sesuaikan tech / year / links dengan project aslimu.
export const projects: Project[] = [
  {
    slug: 'checker-hoax-scam',
    title: 'System Checker Hoax & Scam',
    category: 'Web App',
    tech: 'Python / NLP / Web',
    year: '2025',
    status: 'In Progress',
    desc: 'Sistem untuk mengecek apakah sebuah pesan atau informasi termasuk hoax atau scam.',
    fullDesc:
      'System Checker Hoax & Scam membantu pengguna memverifikasi pesan atau informasi yang mencurigakan sebelum mempercayai atau menyebarkannya. Dibangun di sekitar NLP dan pendekatan klasifikasi teks sebagai langkah menuju pemanfaatan LLM yang lebih luas.',
    img: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000',
  },
  {
    slug: 'concern-ecosystem',
    title: 'Concern Ecosystem',
    category: 'Automation',
    tech: 'Python / Node.js',
    year: '2025',
    status: 'In Progress',
    desc: 'Ekosistem internal Concern Dev: scraping data Google Maps, otomasi WhatsApp, dan project management.',
    fullDesc:
      'Concern Ecosystem adalah kumpulan tools internal untuk operasional Concern Dev — scraping data Google Maps untuk riset klien, otomasi pengiriman WhatsApp, dan sistem project management untuk menangani banyak klien sekaligus.',
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000',
  },
  {
    slug: 'gis-stunting',
    title: 'Website GIS — Pemetaan Anak Stunting',
    category: 'Web App',
    tech: 'Laravel / PostgreSQL / GIS',
    year: '2025',
    status: 'In Progress',
    desc: 'Website pemetaan sebaran anak stunting secara geografis dengan GIS.',
    fullDesc:
      'Sebuah website GIS untuk memetakan sebaran anak stunting per wilayah, sehingga data bisa dilihat secara visual di peta dan dipakai sebagai dasar evaluasi program kesehatan.',
    img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000',
  },
  {
    slug: 'fess-n-curious',
    title: 'Fess N Curious',
    category: 'Web App',
    tech: 'Vue / Laravel',
    year: '2025',
    status: 'Live',
    desc: 'Web app untuk confess anonim — orang bisa mengirim cerita atau pengakuan tanpa nama.',
    fullDesc:
      'Fess N Curious adalah web app tempat pengguna bisa mengirim confess (pengakuan atau curhatan) secara anonim, membagikan momen tanpa harus menampilkan identitas.',
    img: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000',
  },
  {
    slug: 'kelola-umkm',
    title: 'Kelola UMKM',
    category: 'Web App',
    tech: 'Laravel / MySQL',
    year: '2025',
    status: 'In Progress',
    desc: 'Aplikasi pengelolaan UMKM: barang masuk/keluar, karyawan, dan arus kas.',
    fullDesc:
      'Kelola UMKM membantu pelaku UMKM mencatat barang masuk dan keluar (keluar = terjual), mengelola data karyawan, serta memantau uang masuk dan keluar agar keuangan lebih rapi.',
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000',
  },
  {
    slug: 'cathy',
    title: 'Cathy — Aplikasi Kesehatan',
    category: 'Mobile / App',
    tech: 'App / Web',
    year: '2025',
    status: 'Concept',
    desc: 'Aplikasi inovasi untuk kesehatan, dipresentasikan di lomba IIIREX.',
    fullDesc:
      'Cathy adalah aplikasi inovasi di bidang kesehatan yang dikembangkan untuk kompetisi IIIREX — inovasi aplikasi untuk kesehatan. Project ini mengasah kemampuan product thinking dan eksekusi ide.',
    img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000',
  },
]

// Yang sedang dibangun — ditampilkan di section Building.
export const buildings = [
  {
    slug: 'concern-dev',
    title: 'Concern Dev',
    tagline: 'Software house',
    desc: 'Membangun website, aplikasi web, dan sistem digital untuk organisasi, bisnis, dan individu.',
    link: 'https://concern.web.id',
    detail:
      'Concern Dev adalah software house yang sedang dibangun sebagai inisiatif bisnis nyata — bukan sekadar portfolio project. Layanannya mencakup website, aplikasi web, dan sistem digital untuk organisasi, bisnis, maupun individu, dengan fokus pada sistem yang benar-benar dipakai dan mudah dirawat.',
  },
  {
    slug: 'necromancer-occultism',
    title: 'Necromancer Occultism',
    tagline: 'Clothing brand',
    desc: 'Brand clothing yang mengeksplorasi irisan fashion, identitas, filosofi, dan komunitas.',
    link: 'https://instagram.com/necromanceroccultism',
    detail:
      'Necromancer Occultism adalah clothing brand yang sedang dibangun sebagai sisi kreatif dan kewirausahaan di luar software — bermain di area branding, product building, creative direction, marketing, community, dan filosofi.',
  },
]

export const getProject = (slug: string) => projects.find((p) => p.slug === slug)
export const getBuilding = (slug: string) => buildings.find((b) => b.slug === slug)
