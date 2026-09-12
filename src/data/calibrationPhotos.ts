export interface CalibrationPhoto {
  id: string;
  title: string;
  caption: string;
  category: string;
  imageUrl: string;
  isCustom?: boolean;
}

const svgToDataUri = (svgContent: string): string => {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent.trim())}`;
};

const theodoliteSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
  <defs>
    <linearGradient id="bg1" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#064e3b" />
      <stop offset="50%" stop-color="#022c22" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
    <radialGradient id="sunGlow" cx="75%" cy="25%" r="40%">
      <stop offset="0%" stop-color="#fbbf24" stop-opacity="0.8" />
      <stop offset="50%" stop-color="#f59e0b" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#f59e0b" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="laser" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#ef4444" stop-opacity="0.9" />
      <stop offset="80%" stop-color="#fbbf24" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#22c55e" stop-opacity="0.9" />
    </linearGradient>
  </defs>

  <rect width="600" height="400" fill="url(#bg1)" />
  <circle cx="450" cy="100" r="140" fill="url(#sunGlow)" />

  <g stroke="#10b981" stroke-opacity="0.2" stroke-width="1" stroke-dasharray="4,4">
    <line x1="0" y1="200" x2="600" y2="200" />
    <line x1="300" y1="0" x2="300" y2="400" />
    <circle cx="300" cy="200" r="160" />
    <circle cx="300" cy="200" r="110" />
    <circle cx="300" cy="200" r="60" />
  </g>

  <path d="M0,260 L600,260 L600,400 L0,400 Z" fill="#065f46" fill-opacity="0.35" />
  <line x1="0" y1="260" x2="600" y2="260" stroke="#34d399" stroke-width="2" stroke-opacity="0.4" />

  <text x="300" y="30" fill="#a7f3d0" font-size="12" font-family="monospace" text-anchor="middle" font-weight="bold">U (0&#176; True North)</text>
  <text x="560" y="205" fill="#a7f3d0" font-size="12" font-family="monospace" text-anchor="end" font-weight="bold">T (90&#176;)</text>
  <text x="300" y="385" fill="#a7f3d0" font-size="12" font-family="monospace" text-anchor="middle" font-weight="bold">S (180&#176;)</text>
  <text x="40" y="205" fill="#34d399" font-size="13" font-family="monospace" text-anchor="start" font-weight="bold">B (270&#176; Barat)</text>

  <line x1="300" y1="200" x2="110" y2="110" stroke="url(#laser)" stroke-width="4" />
  <circle cx="110" cy="110" r="14" fill="#ef4444" fill-opacity="0.2" stroke="#ef4444" stroke-width="2" />
  <circle cx="110" cy="110" r="4" fill="#fef08a" />
  <text x="110" y="85" fill="#fef08a" font-size="13" font-family="sans-serif" font-weight="900" text-anchor="middle">ARAH KIBLAT: 295&#176; 15&apos; 12&quot;</text>
  <text x="110" y="100" fill="#a7f3d0" font-size="10" font-family="sans-serif" text-anchor="middle">Azimut Ka&apos;bah Mekkah</text>

  <g stroke="#475569" stroke-width="6" stroke-linecap="round">
    <line x1="300" y1="210" x2="210" y2="360" />
    <line x1="300" y1="210" x2="300" y2="370" />
    <line x1="300" y1="210" x2="390" y2="360" />
  </g>
  <line x1="240" y1="310" x2="360" y2="310" stroke="#94a3b8" stroke-width="2" />

  <rect x="270" y="195" width="60" height="18" rx="4" fill="#eab308" stroke="#ca8a04" stroke-width="2" />
  <circle cx="280" cy="204" r="4" fill="#0f172a" />
  <circle cx="320" cy="204" r="4" fill="#0f172a" />

  <rect x="275" y="150" width="50" height="45" rx="6" fill="#facc15" stroke="#a16207" stroke-width="2" />
  <rect x="282" y="162" width="36" height="20" rx="3" fill="#0f172a" />
  <text x="300" y="176" fill="#4ade80" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">295&#176;15&apos;</text>

  <g transform="translate(300, 155) rotate(-25)">
    <rect x="-45" y="-9" width="90" height="18" rx="3" fill="#1e293b" stroke="#475569" stroke-width="2" />
    <circle cx="-45" cy="0" r="11" fill="#0ea5e9" stroke="#38bdf8" stroke-width="2" />
    <circle cx="45" cy="0" r="7" fill="#0284c7" />
    <rect x="-10" y="-12" width="20" height="24" rx="2" fill="#ca8a04" />
  </g>

  <rect x="15" y="15" width="210" height="26" rx="5" fill="#0f172a" fill-opacity="0.85" stroke="#059669" stroke-width="1.5" />
  <circle cx="28" cy="28" r="5" fill="#10b981" />
  <text x="40" y="32" fill="#ecfdf5" font-size="11" font-family="sans-serif" font-weight="bold">DOKUMENTASI THEODOLITE</text>

  <rect x="15" y="355" width="260" height="30" rx="4" fill="#022c22" fill-opacity="0.9" stroke="#10b981" stroke-width="1" />
  <text x="25" y="374" fill="#a7f3d0" font-size="11" font-family="monospace" font-weight="bold">AKURASI FALAK: &#177; 0&#176; 00&apos; 01&quot;</text>
</svg>`;

const safSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
  <defs>
    <linearGradient id="carpetBg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#047857" />
      <stop offset="60%" stop-color="#064e3b" />
      <stop offset="100%" stop-color="#022c22" />
    </linearGradient>
    <linearGradient id="laserSaf" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#fbbf24" stop-opacity="1" />
      <stop offset="50%" stop-color="#34d399" stop-opacity="1" />
      <stop offset="100%" stop-color="#fbbf24" stop-opacity="1" />
    </linearGradient>
  </defs>

  <rect width="600" height="400" fill="url(#carpetBg)" />

  <path d="M0,0 L600,0 L600,120 L0,120 Z" fill="#0f172a" />
  <path d="M220,120 Q300,10 380,120 Z" fill="#047857" stroke="#fbbf24" stroke-width="2" />
  <text x="300" y="85" fill="#fef08a" font-size="14" font-family="serif" font-weight="bold" text-anchor="middle">Mihrab &amp; Pengimaman Masjid</text>
  <text x="300" y="106" fill="#a7f3d0" font-size="10" font-family="sans-serif" text-anchor="middle">Arah Kiblat Menghadap Ka&apos;bah</text>

  <g stroke="#065f46" stroke-width="8" stroke-opacity="0.8">
    <line x1="0" y1="180" x2="600" y2="180" />
    <line x1="0" y1="240" x2="600" y2="240" />
    <line x1="0" y1="300" x2="600" y2="300" />
    <line x1="0" y1="360" x2="600" y2="360" />
  </g>

  <line x1="20" y1="210" x2="580" y2="210" stroke="#f87171" stroke-width="2" stroke-dasharray="6,6" />
  <text x="430" y="200" fill="#fca5a5" font-size="10" font-family="sans-serif">Kemiringan Dinding Eksisting</text>

  <line x1="20" y1="232" x2="580" y2="188" stroke="url(#laserSaf)" stroke-width="6" stroke-linecap="round" />
  <circle cx="300" cy="210" r="7" fill="#fbbf24" stroke="#ffffff" stroke-width="2" />

  <line x1="20" y1="292" x2="580" y2="248" stroke="url(#laserSaf)" stroke-width="5" stroke-linecap="round" />
  <line x1="20" y1="352" x2="580" y2="308" stroke="url(#laserSaf)" stroke-width="5" stroke-linecap="round" />

  <rect x="180" y="270" width="240" height="14" rx="2" fill="#fbbf24" stroke="#b45309" stroke-width="1.5" />
  <g stroke="#000" stroke-width="1">
    <line x1="200" y1="270" x2="200" y2="277" />
    <line x1="220" y1="270" x2="220" y2="282" />
    <line x1="240" y1="270" x2="240" y2="277" />
    <line x1="260" y1="270" x2="260" y2="282" />
    <line x1="280" y1="270" x2="280" y2="277" />
    <line x1="300" y1="270" x2="300" y2="284" />
    <line x1="320" y1="270" x2="320" y2="277" />
    <line x1="340" y1="270" x2="340" y2="282" />
    <line x1="360" y1="270" x2="360" y2="277" />
    <line x1="380" y1="270" x2="380" y2="282" />
    <line x1="400" y1="270" x2="400" y2="277" />
  </g>
  <text x="300" y="263" fill="#fef08a" font-size="11" font-family="sans-serif" font-weight="bold" text-anchor="middle">PENARIKAN BENANG SAF TEGAK LURUS KIBLAT</text>

  <rect x="15" y="15" width="220" height="26" rx="5" fill="#0f172a" fill-opacity="0.85" stroke="#10b981" stroke-width="1.5" />
  <circle cx="28" cy="28" r="5" fill="#34d399" />
  <text x="40" y="32" fill="#ecfdf5" font-size="11" font-family="sans-serif" font-weight="bold">DOKUMENTASI PENATAAN SAF</text>

  <rect x="350" y="340" width="230" height="42" rx="6" fill="#022c22" fill-opacity="0.92" stroke="#fbbf24" stroke-width="1.5" />
  <text x="365" y="358" fill="#fef08a" font-size="11" font-family="sans-serif" font-weight="bold">SAF KALIBRASI RESMI</text>
  <text x="365" y="373" fill="#a7f3d0" font-size="9.5" font-family="sans-serif">Telah Ditandai Permanen Sesuai Ka&apos;bah</text>
</svg>`;

const istiwaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0284c7" />
      <stop offset="60%" stop-color="#0369a1" />
      <stop offset="100%" stop-color="#0c4a6e" />
    </linearGradient>
  </defs>

  <rect width="600" height="400" fill="url(#sky)" />

  <circle cx="120" cy="100" r="45" fill="#fbbf24" />
  <circle cx="120" cy="100" r="65" fill="#f59e0b" fill-opacity="0.3" />
  <g stroke="#fef08a" stroke-width="2" stroke-dasharray="8,4">
    <line x1="120" y1="25" x2="120" y2="175" />
    <line x1="45" y1="100" x2="195" y2="100" />
    <line x1="67" y1="47" x2="173" y2="153" />
    <line x1="67" y1="153" x2="173" y2="47" />
  </g>
  <text x="120" y="105" fill="#78350f" font-size="11" font-family="sans-serif" font-weight="900" text-anchor="middle">MATAHARI</text>

  <polygon points="180,260 540,260 480,380 120,380" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2" />
  <g stroke="#94a3b8" stroke-width="1" stroke-dasharray="3,3">
    <line x1="200" y1="290" x2="510" y2="290" />
    <line x1="170" y1="320" x2="480" y2="320" />
    <line x1="140" y1="350" x2="450" y2="350" />
  </g>

  <line x1="320" y1="280" x2="320" y2="180" stroke="#0f172a" stroke-width="8" stroke-linecap="round" />
  <circle cx="320" cy="180" r="6" fill="#ef4444" />
  <text x="320" y="168" fill="#ffffff" font-size="11" font-family="sans-serif" font-weight="bold" text-anchor="middle">Tongkat Istiwa 90&#176; Tegak Lurus</text>

  <line x1="320" y1="280" x2="440" y2="345" stroke="#1e293b" stroke-width="6" stroke-linecap="round" />
  <line x1="320" y1="280" x2="440" y2="345" stroke="#22c55e" stroke-width="2" stroke-dasharray="4,2" />
  <text x="445" y="360" fill="#166534" font-size="11" font-family="sans-serif" font-weight="extrabold">Bayangan Rashdul Qiblah</text>
  <text x="445" y="375" fill="#334155" font-size="9" font-family="sans-serif">Matahari Tepat di Atas Ka&apos;bah</text>

  <g transform="translate(480, 110)">
    <circle cx="0" cy="0" r="50" fill="#0f172a" stroke="#fbbf24" stroke-width="3" />
    <circle cx="0" cy="0" r="42" fill="#022c22" stroke="#10b981" stroke-width="1" />
    <text x="0" y="-28" fill="#f87171" font-size="10" font-family="sans-serif" font-weight="bold" text-anchor="middle">N</text>
    <text x="28" y="4" fill="#a7f3d0" font-size="9" font-family="sans-serif" font-weight="bold" text-anchor="middle">E</text>
    <text x="0" y="34" fill="#a7f3d0" font-size="9" font-family="sans-serif" font-weight="bold" text-anchor="middle">S</text>
    <text x="-28" y="4" fill="#facc15" font-size="9" font-family="sans-serif" font-weight="bold" text-anchor="middle">W</text>
    <polygon points="0,-35 6,0 -6,0" fill="#ef4444" />
    <polygon points="0,35 6,0 -6,0" fill="#e2e8f0" />
    <circle cx="0" cy="0" r="4" fill="#fbbf24" />
  </g>

  <rect x="15" y="15" width="220" height="26" rx="5" fill="#0f172a" fill-opacity="0.85" stroke="#38bdf8" stroke-width="1.5" />
  <circle cx="28" cy="28" r="5" fill="#38bdf8" />
  <text x="40" y="32" fill="#ecfdf5" font-size="11" font-family="sans-serif" font-weight="bold">VERIFIKASI BAYANG ISTIWA</text>
</svg>`;

const takmirSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
  <defs>
    <linearGradient id="officeBg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
  </defs>

  <rect width="600" height="400" fill="url(#officeBg)" />

  <path d="M0,220 L600,220 L600,400 L0,400 Z" fill="#334155" />
  <line x1="0" y1="220" x2="600" y2="220" stroke="#64748b" stroke-width="3" />

  <rect x="190" y="150" width="220" height="210" rx="4" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" />
  <rect x="200" y="160" width="200" height="190" fill="none" stroke="#065f46" stroke-width="2" />
  
  <rect x="230" y="170" width="140" height="6" fill="#0f172a" />
  <rect x="250" y="180" width="100" height="4" fill="#64748b" />
  <line x1="210" y1="192" x2="390" y2="192" stroke="#0f172a" stroke-width="1.5" />

  <text x="300" y="210" fill="#064e3b" font-size="9" font-family="serif" font-weight="bold" text-anchor="middle">BERITA ACARA KALIBRASI KIBLAT</text>
  
  <g fill="#94a3b8">
    <rect x="215" y="222" width="170" height="3" />
    <rect x="215" y="230" width="150" height="3" />
    <rect x="215" y="238" width="165" height="3" />
    <rect x="215" y="246" width="140" height="3" />
    <rect x="215" y="254" width="155" height="3" />
  </g>

  <circle cx="350" cy="300" r="22" fill="none" stroke="#059669" stroke-width="2" stroke-dasharray="4,2" />
  <circle cx="350" cy="300" r="17" fill="none" stroke="#059669" stroke-width="1" />
  <text x="350" y="303" fill="#059669" font-size="6" font-family="sans-serif" font-weight="black" text-anchor="middle">KEMENAG KUA</text>

  <line x1="225" y1="318" x2="275" y2="318" stroke="#334155" stroke-width="1" />
  <text x="250" y="328" fill="#475569" font-size="7" font-family="sans-serif" text-anchor="middle">Takmir Masjid</text>

  <line x1="325" y1="332" x2="375" y2="332" stroke="#334155" stroke-width="1" />
  <text x="350" y="342" fill="#065f46" font-size="7" font-family="sans-serif" font-weight="bold" text-anchor="middle">Petugas KUA</text>

  <rect x="15" y="15" width="220" height="26" rx="5" fill="#0f172a" fill-opacity="0.85" stroke="#fbbf24" stroke-width="1.5" />
  <circle cx="28" cy="28" r="5" fill="#fbbf24" />
  <text x="40" y="32" fill="#ecfdf5" font-size="11" font-family="sans-serif" font-weight="bold">PENGESAHAN DOKUMEN</text>
</svg>`;

export const DEFAULT_CALIBRATION_PHOTOS: CalibrationPhoto[] = [
  {
    id: 'photo-theodolite',
    title: 'Pengukuran Azimut Kiblat (Theodolite Geodetik)',
    caption: 'Pembacaan sudut horizontal theodolite diarahkan ke azimut Ka\'bah dari titik acuan utara sejati (True North).',
    category: 'Instrumen Falak',
    imageUrl: svgToDataUri(theodoliteSvg),
  },
  {
    id: 'photo-saf',
    title: 'Penandaan & Penarikan Garis Saf Salat',
    caption: 'Pemasangan garis panduan saf salat permanen menggunakan benang bidik dan laser level tegak lurus arah kiblat.',
    category: 'Penataan Saf',
    imageUrl: svgToDataUri(safSvg),
  },
  {
    id: 'photo-istiwa',
    title: 'Verifikasi Kompas Falak & Rashdul Qiblah',
    caption: 'Verifikasi meridian bayang-bayang matahari (Istiwa A\'zam) dan kompas bidik presisi oleh tim falakiyah Kemenag.',
    category: 'Verifikasi Falak',
    imageUrl: svgToDataUri(istiwaSvg),
  },
  {
    id: 'photo-takmir',
    title: 'Penyerahan Dokumen & Pengesahan Bersama Takmir',
    caption: 'Penandatanganan Berita Acara pengukuran arah kiblat di hadapan pengurus takmir masjid dan saksi-saksi.',
    category: 'Administrasi & Takmir',
    imageUrl: svgToDataUri(takmirSvg),
  },
];
