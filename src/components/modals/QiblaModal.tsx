import React from 'react';
import {
  X,
  Compass,
  Navigation,
  MapPin,
  Sun,
  CheckCircle2,
  ShieldAlert,
  FileCheck2,
  Printer,
  FileDown,
} from 'lucide-react';
import { LocationInfo, QiblaInfo } from '../../types';
import { KemenagLogo } from '../KemenagLogo';

interface QiblaModalProps {
  isOpen: boolean;
  onClose: () => void;
  qibla: QiblaInfo;
  location: LocationInfo;
  onOpenCertificate?: () => void;
}

export const QiblaModal: React.FC<QiblaModalProps> = ({
  isOpen,
  onClose,
  qibla,
  location,
  onOpenCertificate,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/20">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Arah Kiblat & Rashdul Qiblah
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                  Kemenag RI
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Arah lurus menuju Ka'bah di Masjidil Haram dari {location.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Official Calibration Certificate Action Callout */}
          {onOpenCertificate && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-800 to-teal-800 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/10 p-1 flex items-center justify-center shrink-0">
                  <KemenagLogo className="w-8 h-8" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-200">
                    Layanan Falakiyah KUA Kec. Gerung
                  </div>
                  <div className="text-sm font-bold text-white leading-snug">
                    Cetak Sertifikat Kalibrasi Arah Kiblat
                  </div>
                  <div className="text-[11px] text-emerald-100/80 mt-0.5">
                    Format Berita Acara resmi Kemenag & simpan langsung sebagai PDF
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onOpenCertificate();
                }}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-white text-emerald-900 hover:bg-emerald-50 text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer shrink-0"
              >
                <FileDown className="w-4 h-4 text-emerald-700" />
                <span>Simpan PDF Sertifikat</span>
              </button>
            </div>
          )}

          {/* Compass Visual Representation */}
          <div className="flex flex-col items-center justify-center py-2">
            <div className="relative w-56 h-56 rounded-full border-4 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-center shadow-inner">
              
              {/* Compass Cardinal Markings */}
              <span className="absolute top-2 text-xs font-black text-rose-500">U (0°)</span>
              <span className="absolute bottom-2 text-xs font-black text-slate-400">S (180°)</span>
              <span className="absolute right-2 text-xs font-black text-slate-400">T (90°)</span>
              <span className="absolute left-2 text-xs font-black text-slate-400">B (270°)</span>

              {/* Angle Tick Marks */}
              <div className="absolute inset-4 rounded-full border border-dashed border-slate-300 dark:border-slate-700 pointer-events-none" />

              {/* Ka'bah Needle Indicator */}
              <div
                className="absolute w-full h-full flex items-center justify-center pointer-events-none transition-transform duration-700 ease-out"
                style={{ transform: `rotate(${qibla.azimuthDegrees}deg)` }}
              >
                {/* Pointer Arrow pointing to Qibla */}
                <div className="absolute top-4 flex flex-col items-center">
                  <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[24px] border-b-emerald-500 drop-shadow-md" />
                  <div className="w-1.5 h-16 bg-gradient-to-b from-emerald-500 to-transparent" />
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-600 text-white shadow-xs -mt-1">
                    Ka'bah
                  </span>
                </div>
              </div>

              {/* Center Pivot */}
              <div className="w-7 h-7 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center shadow-md z-10">
                <Navigation className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="text-center mt-3">
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
                {qibla.azimuthDegrees}°
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Azimut dari Titik Utara Sejati ({qibla.azimuthCompass})
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400">Jarak ke Ka'bah</span>
              <div className="font-mono text-base font-bold text-slate-900 dark:text-white mt-0.5">
                {qibla.distanceKm.toLocaleString('id-ID')} km
              </div>
              <span className="text-[10px] text-slate-400">Garis lurus geodesik</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400">Koordinat Ka'bah</span>
              <div className="font-mono text-xs font-bold text-slate-900 dark:text-white mt-1">
                21° 25' 21" LU, 39° 49' 34" BT
              </div>
              <span className="text-[10px] text-slate-400">Makkah al-Mukarramah</span>
            </div>
          </div>

          {/* Rashdul Qiblah (Istiwa A'zam) Section */}
          <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-200">
              <Sun className="w-4 h-4 text-amber-600" />
              <span>Fenomena Rashdul Qiblah (Istiwa A'zam)</span>
            </div>
            <p className="text-amber-800 dark:text-amber-300 leading-relaxed text-[11px]">
              Matahari berada tepat di atas Ka'bah. Pada waktu ini, semua bayangan benda tegak lurus di Indonesia secara otomatis mengarah tepat ke Ka'bah:
            </p>
            <ul className="space-y-1 text-slate-700 dark:text-slate-300 font-mono text-[11px] list-disc list-inside">
              {qibla.rashdulQiblahDates.map((d, idx) => (
                <li key={idx} className="font-bold text-emerald-700 dark:text-emerald-400">
                  {d}
                </li>
              ))}
            </ul>
          </div>

          {/* Observational Guidelines */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs space-y-1 text-slate-600 dark:text-slate-300">
            <div className="font-bold text-slate-900 dark:text-white">
              Petunjuk Pengukuran di Masjid / Musholla:
            </div>
            <p className="text-[11px] leading-relaxed">
              1. Gunakan kompas magnetik bebas dari interferensi logam besi dan kabel bertegangan tinggi.
            </p>
            <p className="text-[11px] leading-relaxed">
              2. Koreksi deklinasi magnetik lokal (True North vs Magnetic North) atau gunakan bayang-bayang tongkat Istiwa saat matahari mencapai azimut kiblat.
            </p>
            <p className="text-[11px] leading-relaxed text-emerald-600 dark:text-emerald-400 font-medium pt-1">
              3. Untuk pengesahan arah kiblat masjid, gunakan fitur <strong>Cetak Sertifikat Kalibrasi Arah Kiblat</strong> resmi Kemenag.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
