import React from 'react';
import { X, Sun, Moon, Sparkles, Orbit } from 'lucide-react';
import { LocationInfo, MoonInfo, SunEphemeris } from '../../types';

interface EphemerisModalProps {
  isOpen: boolean;
  onClose: () => void;
  sun: SunEphemeris;
  moon: MoonInfo;
  location: LocationInfo;
  currentDate: Date;
}

export const EphemerisModal: React.FC<EphemerisModalProps> = ({
  isOpen,
  onClose,
  sun,
  moon,
  location,
  currentDate,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-md shadow-orange-600/20">
              <Orbit className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Ephemeris Astronomi Matahari & Bulan
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Koordinat bola langit real-time untuk pengamat di {location.name}
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
          
          {/* Sun Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
              <Sun className="w-4 h-4 text-amber-500" />
              <span>Koordinat & Data Ephemeris Matahari (Asy-Syams)</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Deklinasi (Declination)</span>
                <div className="font-mono text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {sun.declination.toFixed(2)}°
                </div>
                <span className="text-[10px] text-slate-400">Sudut utara/selatan ekuator</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Asensio Rekta (RA)</span>
                <div className="font-mono text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {sun.rightAscension.toFixed(2)} jam
                </div>
                <span className="text-[10px] text-slate-400">Titik Aries (Vernal Equinox)</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Perata Waktu (EoT)</span>
                <div className="font-mono text-base font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                  {sun.equationOfTimeMinutes > 0 ? `+${sun.equationOfTimeMinutes.toFixed(2)}` : sun.equationOfTimeMinutes.toFixed(2)} mnt
                </div>
                <span className="text-[10px] text-slate-400">Koreksi Equation of Time</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Ketinggian (Altitude)</span>
                <div className="font-mono text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {sun.altitude.toFixed(2)}°
                </div>
                <span className="text-[10px] text-slate-400">Dari ufuk/cakrawala</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Azimuth Matahari</span>
                <div className="font-mono text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {sun.azimuth.toFixed(2)}°
                </div>
                <span className="text-[10px] text-slate-400">Dari Utara sejati</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Waktu Istiwa (Zawal)</span>
                <div className="font-mono text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {sun.transitTime}
                </div>
                <span className="text-[10px] text-slate-400">Matahari di meridian langit</span>
              </div>
            </div>
          </div>

          {/* Moon Section */}
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
              <Moon className="w-4 h-4 text-indigo-400" />
              <span>Koordinat & Data Ephemeris Bulan (Al-Qamar)</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Sudut Elongasi</span>
                <div className="font-mono text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {moon.elongation}°
                </div>
                <span className="text-[10px] text-slate-400">Jarak sudut Bulan - Matahari</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Fraksi Iluminasi</span>
                <div className="font-mono text-base font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                  {moon.illumination}%
                </div>
                <span className="text-[10px] text-slate-400">Cahaya piringan bulan</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Umur Bulan</span>
                <div className="font-mono text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {moon.ageDays} hari
                </div>
                <span className="text-[10px] text-slate-400">Siklus sinodik 29.53 hari</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Terbit Bulan</span>
                <div className="font-mono text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {moon.moonrise}
                </div>
                <span className="text-[10px] text-slate-400">Waktu lokal ({location.timezoneName})</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Transit Bulan</span>
                <div className="font-mono text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {moon.moonTransit}
                </div>
                <span className="text-[10px] text-slate-400">Kulminasi atas</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Terbenam Bulan</span>
                <div className="font-mono text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {moon.moonset}
                </div>
                <span className="text-[10px] text-slate-400">Waktu lokal ({location.timezoneName})</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
