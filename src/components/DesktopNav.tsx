import React from 'react';
import {
  Compass,
  Moon,
  Sun,
  Eye,
  Calendar,
  Settings,
  MapPin,
  Bell,
  Clock,
  UserCheck,
  Radio,
  FileSpreadsheet,
  FileCheck2,
  FileDown,
} from 'lucide-react';

interface DesktopNavProps {
  onOpenPreferences: () => void;
  onOpenLocation: () => void;
  onOpenDate: () => void;
  onOpenPrayerAlerts: () => void;
  onOpenMonthlySchedule: () => void;
  onOpenMoonTimes: () => void;
  onOpenMoonPhases: () => void;
  onOpenCrescentVisibility: () => void;
  onOpenEphemeris: () => void;
  onOpenQiblah: () => void;
  onOpenQiblaCertificate: () => void;
  onOpenHijriConverter: () => void;
  onOpenAtomicSync: () => void;
  onOpenDeveloperInfo: () => void;
  classicTheme?: boolean;
}

export const DesktopNav: React.FC<DesktopNavProps> = ({
  onOpenPreferences,
  onOpenLocation,
  onOpenDate,
  onOpenPrayerAlerts,
  onOpenMonthlySchedule,
  onOpenMoonTimes,
  onOpenMoonPhases,
  onOpenCrescentVisibility,
  onOpenEphemeris,
  onOpenQiblah,
  onOpenQiblaCertificate,
  onOpenHijriConverter,
  onOpenAtomicSync,
  onOpenDeveloperInfo,
  classicTheme = false,
}) => {
  // Classic 1990s desktop style if toggle enabled
  if (classicTheme) {
    const classicButtons = [
      { label: 'Preferences', action: onOpenPreferences },
      { label: 'Location', action: onOpenLocation },
      { label: 'Date', action: onOpenDate },
      { label: 'Prayer Alerts', action: onOpenPrayerAlerts },
      { label: 'Prayer Times (Imsakiyah)', action: onOpenMonthlySchedule },
      { label: 'Sertifikat Kiblat (PDF)', action: onOpenQiblaCertificate },
      { label: 'Moon Times', action: onOpenMoonTimes },
      { label: 'Moon Phases', action: onOpenMoonPhases },
      { label: 'Crescent Visibility', action: onOpenCrescentVisibility },
      { label: 'Sun Moon Ephemeris', action: onOpenEphemeris },
      { label: 'Atomic Sync (Jam Atom)', action: onOpenAtomicSync },
      { label: 'Hejric Gregorian', action: onOpenHijriConverter },
      { label: 'Qiblah', action: onOpenQiblah },
      { label: 'Developer: Husni, S. Kom. I', action: onOpenDeveloperInfo },
    ];

    return (
      <div className="bg-slate-200 border-2 border-slate-400 p-4 rounded shadow-md mb-6">
        <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 border-b border-slate-300 pb-1 flex items-center justify-between">
          <span>Desktop Functions (Versi Klasik Accurate Times)</span>
          <span className="text-[10px] font-mono text-emerald-800 font-bold">Kemenag RI • KUA Gerung</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {classicButtons.map((btn) => (
            <button
              key={btn.label}
              onClick={btn.action}
              className="bg-slate-100 hover:bg-slate-300 active:bg-slate-400 text-slate-900 font-semibold py-2 px-3 border-2 border-t-white border-l-white border-r-slate-500 border-b-slate-500 shadow-sm text-xs text-center cursor-pointer active:translate-y-px"
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Modern Clean Dashboard Navigation
  const modules = [
    {
      id: 'qibla-certificate',
      title: 'Sertifikat Kalibrasi Kiblat',
      description: 'Cetak berita acara resmi Kemenag & simpan format PDF',
      icon: FileCheck2,
      badge: 'Simpan PDF',
      badgeColor: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 font-extrabold border border-emerald-300 dark:border-emerald-800',
      action: onOpenQiblaCertificate,
      highlight: true,
    },
    {
      id: 'atomic-sync',
      title: 'Sinkronisasi Jam Atom',
      description: 'Presisi NTP, drift milidetik, & kalibrasi waktu',
      icon: Radio,
      badge: 'Presisi Tinggi',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
      action: onOpenAtomicSync,
    },
    {
      id: 'qiblah',
      title: 'Arah Kiblat & Rashdul',
      description: 'Kompas Ka\'bah, azimut, jarak, & bayangan kiblat',
      icon: Compass,
      badge: 'Kompas',
      badgeColor: 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300',
      action: onOpenQiblah,
    },
    {
      id: 'monthly-schedule',
      title: 'Jadwal Sholat & Imsakiyah',
      description: 'Tabel sebulan penuh dengan cetak PDF / Excel',
      icon: FileSpreadsheet,
      badge: 'Cetak Imsakiyah',
      badgeColor: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300',
      action: onOpenMonthlySchedule,
    },
    {
      id: 'hilal',
      title: 'Visibilitas Hilal (MABIMS)',
      description: 'Analisis kriteria awal bulan Hijriah 3° & 6.4°',
      icon: Eye,
      badge: 'Hisab Rukyat',
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
      action: onOpenCrescentVisibility,
    },
    {
      id: 'moon-phases',
      title: 'Fase & Umur Bulan',
      description: 'Visualisasi fase, iluminasi %, & orbit synodic',
      icon: Moon,
      badge: 'Astronomis',
      badgeColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300',
      action: onOpenMoonPhases,
    },
    {
      id: 'ephemeris',
      title: 'Ephemeris Matahari & Bulan',
      description: 'Deklinasi, Asensio Rekta, Azimuth, & EoT',
      icon: Sun,
      badge: 'Ephemeris',
      badgeColor: 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300',
      action: onOpenEphemeris,
    },
    {
      id: 'hijri-converter',
      title: 'Konversi Hijriah - Masehi',
      description: 'Kalender Islam & kalender Jawa pasaran',
      icon: Calendar,
      badge: 'Pasaran Jawa',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
      action: onOpenHijriConverter,
    },
    {
      id: 'location',
      title: 'Pilih Lokasi & GPS',
      description: 'Kota se-Indonesia atau koordinat kustom',
      icon: MapPin,
      badge: 'Indonesia',
      badgeColor: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300',
      action: onOpenLocation,
    },
    {
      id: 'preferences',
      title: 'Preferensi Hisab & Ihtiyat',
      description: 'Metode Kemenag, IAC Odeh, sudut Subuh/Isya',
      icon: Settings,
      badge: 'Pengaturan',
      badgeColor: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
      action: onOpenPreferences,
    },
    {
      id: 'alerts',
      title: 'Peringatan Adzan & Bip',
      description: 'Pengingat suara adzan melodis & sinyal detik atom',
      icon: Bell,
      badge: 'Audio',
      badgeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300',
      action: onOpenPrayerAlerts,
    },
    {
      id: 'developer',
      title: 'Profil Pengembang Kemenag',
      description: 'Husni, S. Kom. I • KUA Kecamatan Gerung',
      icon: UserCheck,
      badge: 'Kemenag RI',
      badgeColor: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 font-bold',
      action: onOpenDeveloperInfo,
    },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Modul Falakiyah, Sertifikat, & Fitur Desktop
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Peralatan hisab astronomis akurat terintegrasi standar Kementerian Agama RI
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
        {modules.map((m) => {
          const Icon = m.icon;
          return (
            <button
              key={m.id}
              onClick={m.action}
              className={`group p-4 rounded-xl border transition-all text-left flex flex-col justify-between cursor-pointer ${
                m.highlight
                  ? 'bg-gradient-to-br from-emerald-50/90 to-white dark:from-emerald-950/40 dark:to-slate-900 border-emerald-300 dark:border-emerald-700 shadow-xs hover:shadow-md'
                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-md'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform ${
                    m.highlight
                      ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-600/30'
                      : 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${m.badgeColor}`}>
                    {m.badge}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {m.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {m.description}
                </p>
              </div>

              <div className="mt-3.5 pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                <span>{m.highlight ? 'Cetak & Simpan PDF' : 'Buka Modul'}</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
