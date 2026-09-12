import React from 'react';
import { Clock, Calendar, Volume2, ArrowRight, Bell, Sparkles } from 'lucide-react';
import { LocationInfo, PrayerTimes } from '../types';

interface PrayerTimesCardProps {
  prayerTimes: PrayerTimes;
  location: LocationInfo;
  currentDate: Date;
  onOpenMonthlyModal: () => void;
  onTestAdzan: () => void;
  classicTheme?: boolean;
}

export const PrayerTimesCard: React.FC<PrayerTimesCardProps> = ({
  prayerTimes,
  location,
  currentDate,
  onOpenMonthlyModal,
  onTestAdzan,
  classicTheme = false,
}) => {
  // Determine current active prayer & next prayer
  const currentHour = currentDate.getHours() + currentDate.getMinutes() / 60 + currentDate.getSeconds() / 3600;

  const scheduleList = [
    { key: 'imsak', name: 'Imsak', ar: 'الإمساك', time: prayerTimes.imsak, raw: prayerTimes.rawTimes.imsak, isOptional: true },
    { key: 'fajr', name: 'Subuh', ar: 'الفجر', time: prayerTimes.fajr, raw: prayerTimes.rawTimes.fajr, isMain: true },
    { key: 'sunrise', name: 'Terbit', ar: 'الشروق', time: prayerTimes.sunrise, raw: prayerTimes.rawTimes.sunrise },
    { key: 'dhuha', name: 'Dhuha', ar: 'الضحى', time: prayerTimes.dhuha, raw: prayerTimes.rawTimes.dhuha, isOptional: true },
    { key: 'dhuhr', name: 'Dzuhur', ar: 'الظهر', time: prayerTimes.dhuhr, raw: prayerTimes.rawTimes.dhuhr, isMain: true },
    { key: 'asr', name: 'Ashar', ar: 'العصر', time: prayerTimes.asr, raw: prayerTimes.rawTimes.asr, isMain: true },
    { key: 'maghrib', name: 'Maghrib', ar: 'المغرب', time: prayerTimes.maghrib, raw: prayerTimes.rawTimes.maghrib, isMain: true },
    { key: 'isha', name: 'Isya', ar: 'العشاء', time: prayerTimes.isha, raw: prayerTimes.rawTimes.isha, isMain: true },
  ];

  // Find next main prayer
  const mainPrayers = scheduleList.filter(p => p.isMain);
  let nextPrayer = mainPrayers.find(p => p.raw > currentHour);
  if (!nextPrayer) {
    // Wrap around to next day's Fajr
    nextPrayer = mainPrayers[0];
  }

  // Calculate countdown
  let diffHours = nextPrayer.raw - currentHour;
  if (diffHours < 0) diffHours += 24;
  const totalSecondsRemaining = Math.floor(diffHours * 3600);
  const cdHours = Math.floor(totalSecondsRemaining / 3600);
  const cdMins = Math.floor((totalSecondsRemaining % 3600) / 60);
  const cdSecs = totalSecondsRemaining % 60;
  const countdownFormatted = `${String(cdHours).padStart(2, '0')}:${String(cdMins).padStart(2, '0')}:${String(cdSecs).padStart(2, '0')}`;

  // Classic Theme rendering (exact replica of user's uploaded Accurate Times 5.7 screenshot)
  if (classicTheme) {
    const classicItems = [
      { label: 'Fajer', time: prayerTimes.fajr },
      { label: 'Shuroq', time: prayerTimes.sunrise },
      { label: 'Dhohur', time: prayerTimes.dhuhr },
      { label: 'Aser', time: prayerTimes.asr },
      { label: 'Maghreb', time: prayerTimes.maghrib },
      { label: 'Isha', time: prayerTimes.isha },
    ];

    return (
      <div className="bg-slate-200 border-2 border-slate-400 p-4 rounded shadow-md my-4">
        <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 border-b border-slate-300 pb-1">
          Prayer Times (Tampilan Retro Accurate Times 5.7)
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {classicItems.map((item) => (
            <div key={item.label} className="text-center">
              <div className="bg-green-500 text-black font-bold py-1 px-2 border border-slate-700 text-sm">
                {item.label}
              </div>
              <div className="bg-yellow-300 text-black font-bold py-1.5 px-2 border border-slate-700 text-lg font-mono">
                {item.time}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between items-center text-xs">
          <button
            onClick={onOpenMonthlyModal}
            className="bg-slate-300 hover:bg-slate-400 border border-slate-600 px-3 py-1 font-semibold text-slate-800"
          >
            Jadwal Bulanan (Imsakiyah)
          </button>
          <span className="font-mono text-slate-700 font-bold">
            Menuju {nextPrayer.name}: {countdownFormatted}
          </span>
        </div>
      </div>
    );
  }

  // Modern Clean Theme
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm mb-6 transition-all">
      
      {/* Top Bar: Title & Next Prayer Countdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Jadwal Waktu Sholat Hari Ini
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 font-medium">
              Standar Kemenag RI
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Dihitung presisi berdasarkan hisab astronomis & koordinat {location.name}
          </p>
        </div>

        {/* Countdown to next prayer badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-200">
            <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <div className="text-xs">
              <span className="font-medium text-slate-600 dark:text-slate-300">Menuju </span>
              <strong className="font-bold text-emerald-700 dark:text-emerald-400">{nextPrayer.name}</strong>
              <span className="font-mono font-bold text-slate-900 dark:text-white ml-2 text-sm">
                -{countdownFormatted}
              </span>
            </div>
          </div>

          <button
            onClick={onTestAdzan}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
            title="Uji Suara Nada Adzan"
          >
            <Bell className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid of Prayer Times */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mt-5">
        {scheduleList.map((item) => {
          const isNext = nextPrayer.key === item.key;
          return (
            <div
              key={item.key}
              className={`relative rounded-xl p-3.5 flex flex-col items-center justify-center transition-all ${
                isNext
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 scale-[1.02] border border-emerald-500'
                  : 'bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white border border-slate-100 dark:border-slate-800'
              }`}
            >
              {isNext && (
                <span className="absolute -top-2 px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-400 text-amber-950 uppercase tracking-wider shadow-xs">
                  Berikutnya
                </span>
              )}

              <span
                className={`text-xs font-semibold ${
                  isNext ? 'text-emerald-100' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {item.name}
              </span>

              <span
                className={`text-[11px] font-arabic my-0.5 ${
                  isNext ? 'text-emerald-200' : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {item.ar}
              </span>

              <span
                className={`font-mono text-xl font-bold tracking-tight mt-1 ${
                  isNext ? 'text-white' : 'text-slate-900 dark:text-white'
                }`}
              >
                {item.time}
              </span>
            </div>
          );
        })}
      </div>

      {/* Action Footer */}
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="text-slate-500 dark:text-slate-400 text-center sm:text-left">
          Ihtiyat (Pengaman): <strong className="text-slate-700 dark:text-slate-200">+2 Menit</strong> | Sudut Subuh: <strong className="text-slate-700 dark:text-slate-200">-20.0°</strong> | Sudut Isya: <strong className="text-slate-700 dark:text-slate-200">-18.0°</strong>
        </div>

        <button
          onClick={onOpenMonthlyModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 font-semibold transition-colors cursor-pointer"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Lihat & Cetak Jadwal Imsakiyah Bulanan</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

    </div>
  );
};
