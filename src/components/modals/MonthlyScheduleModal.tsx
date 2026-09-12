import React, { useState, useRef } from 'react';
import {
  X,
  Printer,
  Download,
  Calendar,
  MapPin,
  ChevronLeft,
  ChevronRight,
  FileDown,
  FileSpreadsheet,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { CalculationPreferences, LocationInfo } from '../../types';
import { calculatePrayerTimes } from '../../utils/astronomy';
import { gregorianToHijri } from '../../utils/hijri';
import { KemenagLogo } from '../KemenagLogo';
import { exportElementToA4Pdf } from '../../utils/pdfExport';
import { DirectPrintDialog } from './DirectPrintDialog';

interface MonthlyScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: LocationInfo;
  preferences: CalculationPreferences;
  currentDate: Date;
}

export const MonthlyScheduleModal: React.FC<MonthlyScheduleModalProps> = ({
  isOpen,
  onClose,
  location,
  preferences,
  currentDate,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());
  const [isSavingPdf, setIsSavingPdf] = useState<boolean>(false);
  const [savePdfMessage, setSavePdfMessage] = useState<string | null>(null);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState<boolean>(false);

  const scheduleRef = useRef<HTMLDivElement>(null);

  const handleDirectPrint = () => {
    try {
      window.print();
    } catch {
      // ignore
    }
    setIsPrintDialogOpen(true);
  };

  if (!isOpen) return null;

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  // Number of days in selected month
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();

  // Generate schedule for all days
  const scheduleRows = Array.from({ length: daysInMonth }, (_, idx) => {
    const day = idx + 1;
    const date = new Date(selectedYear, selectedMonth, day, 12, 0, 0);
    const times = calculatePrayerTimes(date, location, preferences);
    const hijri = gregorianToHijri(date);

    return {
      day,
      date,
      dayName: ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at", 'Sabtu'][date.getDay()],
      hijriFormatted: `${hijri.day} ${hijri.monthName}`,
      pasaran: hijri.pasaran,
      times,
    };
  });

  const handlePrintOrPdf = async () => {
    if (!scheduleRef.current) {
      window.print();
      return;
    }

    setIsSavingPdf(true);
    setSavePdfMessage('Sedang memproses dan mengunduh file PDF...');

    try {
      const sanitizedLoc = location.name.replace(/[^a-zA-Z0-9]/g, '_');
      const fileName = `Jadwal_Sholat_${sanitizedLoc}_${monthNames[selectedMonth]}_${selectedYear}.pdf`;
      const success = await exportElementToA4Pdf(scheduleRef.current, {
        fileName,
        onSuccess: () => {
          setSavePdfMessage(`Jadwal Sholat berhasil disimpan! File ${fileName} telah diunduh.`);
          setTimeout(() => setSavePdfMessage(null), 5000);
        },
        onError: () => {
          setSavePdfMessage('Membuka dialog cetak browser...');
          setTimeout(() => setSavePdfMessage(null), 4000);
        },
      });

      if (!success) {
        window.print();
      }
    } catch (err) {
      console.error('PDF export error:', err);
      window.print();
    } finally {
      setIsSavingPdf(false);
    }
  };

  const handleExportCsv = () => {
    const headers = [
      'No',
      'Hari',
      'Tanggal Masehi',
      'Tanggal Hijriah',
      'Pasaran',
      'Imsak',
      'Subuh',
      'Terbit',
      'Dhuha',
      'Dzuhur',
      'Ashar',
      'Maghrib',
      'Isya',
    ];

    const rows = scheduleRows.map((r) => [
      r.day,
      r.dayName,
      `${r.day} ${monthNames[selectedMonth]} ${selectedYear}`,
      r.hijriFormatted,
      r.pasaran,
      r.times.imsak,
      r.times.fajr,
      r.times.sunrise,
      r.times.dhuha,
      r.times.dhuhr,
      r.times.asr,
      r.times.maghrib,
      r.times.isha,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      `JADWAL WAKTU SHOLAT & IMSAKIYAH BULANAN - KEMENAG RI\n` +
      `Lokasi: ${location.name} (${location.province}) - Zona: ${location.timezoneName}\n` +
      `Bulan: ${monthNames[selectedMonth]} ${selectedYear}\n` +
      `Pengembang: Husni, S. Kom. I (Penyuluh Agama Islam KUA Kec. Gerung, Lombok Barat)\n` +
      `Email: kuagerung2025@gmail.com\n\n` +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Jadwal_Sholat_${location.name}_${monthNames[selectedMonth]}_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs">
      {/* Specific Print Rules for Monthly Schedule */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          html, body {
            background-color: #ffffff !important;
            color: #000000 !important;
          }
          /* Reset modal fixed overlay for normal print flow */
          .fixed {
            position: static !important;
            background: transparent !important;
            padding: 0 !important;
            overflow: visible !important;
            display: block !important;
          }
          .max-h-\[92vh\], .overflow-hidden, .overflow-y-auto {
            max-height: none !important;
            height: auto !important;
            overflow: visible !important;
          }
          body * {
            visibility: hidden !important;
          }
          #printable-monthly-schedule, #printable-monthly-schedule * {
            visibility: visible !important;
            color: #000000 !important;
            background-color: transparent !important;
            text-shadow: none !important;
            box-shadow: none !important;
          }
          #printable-monthly-schedule {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 6mm !important;
            background-color: #ffffff !important;
            font-size: 8pt !important;
          }
          #printable-monthly-schedule th {
            background-color: #f1f5f9 !important;
            color: #0f172a !important;
            font-weight: bold !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          #printable-monthly-schedule tr:nth-child(even) {
            background-color: #f8fafc !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          @page {
            size: 215mm 330mm;
            margin: 6mm;
          }
        }
      `}} />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-5xl max-h-[92vh] overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header (hidden in print) */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center p-1 border border-slate-200 dark:border-slate-700 shadow-xs">
              <KemenagLogo className="w-9 h-9" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Jadwal Sholat & Imsakiyah Bulanan
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  Standar Kemenag RI
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-600" />
                <span>{location.name}, {location.province} ({location.timezoneName})</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor CSV</span>
            </button>
            
            {/* Active Save PDF Button with prominent icon */}
            <button
              id="btn-save-pdf-monthly"
              onClick={handlePrintOrPdf}
              disabled={isSavingPdf}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-white text-xs font-bold shadow-xs cursor-pointer transition-all ${
                isSavingPdf
                  ? 'bg-emerald-800 opacity-90 cursor-wait'
                  : 'bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800'
              }`}
              title="Simpan Jadwal Imsakiyah Sebulan Penuh sebagai File PDF Kertas F4 (Folio)"
            >
              {isSavingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyimpan PDF F4...</span>
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4" />
                  <span>Simpan PDF (F4)</span>
                </>
              )}
            </button>

            {/* Direct Print Button - Always Active & Visible */}
            <button
              id="btn-print-monthly"
              type="button"
              onClick={handleDirectPrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100 shadow-2xs cursor-pointer transition-colors"
              title="Cetak langsung menggunakan printer atau buka opsi cetak mandiri"
            >
              <Printer className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              <span>Cetak</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dynamic Save Notification Banner */}
        {savePdfMessage && (
          <div className="bg-emerald-50 dark:bg-emerald-950/80 border-b border-emerald-200 dark:border-emerald-800 px-4 py-2 flex items-center justify-between text-xs text-emerald-900 dark:text-emerald-200 print:hidden animate-fade-in">
            <div className="flex items-center gap-2">
              {isSavingPdf ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              )}
              <span className="font-medium">{savePdfMessage}</span>
            </div>
            <button
              onClick={() => setSavePdfMessage(null)}
              className="text-emerald-700 hover:text-emerald-900 dark:text-emerald-400 text-xs font-bold ml-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* Month Selector Bar */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (selectedMonth === 0) {
                  setSelectedMonth(11);
                  setSelectedYear(y => y - 1);
                } else {
                  setSelectedMonth(m => m - 1);
                }
              }}
              className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            </button>
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              {monthNames[selectedMonth]} {selectedYear}
            </span>
            <button
              onClick={() => {
                if (selectedMonth === 11) {
                  setSelectedMonth(0);
                  setSelectedYear(y => y + 1);
                } else {
                  setSelectedMonth(m => m + 1);
                }
              }}
              className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            </button>
          </div>

          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Koreksi Ihtiyat: +{preferences.ihtiyatMinutes} menit | Subuh: -{preferences.fajrAngle}° | Isya: -{preferences.ishaAngle}°
          </span>
        </div>

        {/* Table Content */}
        <div
          id="printable-monthly-schedule"
          ref={scheduleRef}
          className="overflow-y-auto flex-1 p-4 print:p-0 bg-white dark:bg-slate-900"
        >
          {/* Header with Official Kemenag RI Letterhead */}
          <div className="text-center mb-4 pb-3 border-b-2 border-slate-900 dark:border-slate-700">
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="shrink-0">
                <KemenagLogo className="w-14 h-14 sm:w-16 sm:h-16" />
              </div>
              <div className="flex-1 text-center font-serif">
                <div className="text-[11px] sm:text-[12px] font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  KEMENTERIAN AGAMA REPUBLIK INDONESIA
                </div>
                <div className="text-[10.5px] sm:text-[11.5px] font-bold uppercase text-emerald-950 dark:text-emerald-400 mt-0.5">
                  KANTOR KEMENTERIAN AGAMA KABUPATEN LOMBOK BARAT
                </div>
                <div className="text-[12px] sm:text-[13px] font-black uppercase text-emerald-900 dark:text-emerald-300 mt-0.5">
                  KANTOR URUSAN AGAMA KECAMATAN GERUNG
                </div>
                <div className="text-[9px] sm:text-[10px] text-slate-600 dark:text-slate-400 mt-0.5 font-sans">
                  Jl. Gatot Subroto Gerung Utara, Lombok Barat • Email: kuagerung2025@gmail.com
                </div>
              </div>
              <div className="w-14 sm:w-16 text-[9px] font-mono text-right text-slate-500 shrink-0">
                v5.7 ID
              </div>
            </div>
            <div className="border-t border-slate-900 dark:border-slate-700 pt-2">
              <h2 className="text-sm sm:text-base font-black uppercase tracking-wide text-slate-900 dark:text-white">
                JADWAL WAKTU SHOLAT & IMSAKIYAH BULANAN
              </h2>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-300 mt-0.5">
                Wilayah: {location.name} ({location.province}) • Zona: {location.timezoneName} • Bulan: {monthNames[selectedMonth]} {selectedYear}
              </p>
              <p className="text-[10px] text-slate-600 dark:text-slate-400">
                Penyusun: Husni, S. Kom. I (Penyuluh Agama Islam KUA Kec. Gerung)
              </p>
            </div>
          </div>

          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 sticky top-0 font-bold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-2 text-center">Tgl</th>
                <th className="p-2">Hari</th>
                <th className="p-2">Hijriah</th>
                <th className="p-2">Pasaran</th>
                <th className="p-2 text-center font-mono">Imsak</th>
                <th className="p-2 text-center font-mono text-emerald-600 dark:text-emerald-400">Subuh</th>
                <th className="p-2 text-center font-mono">Terbit</th>
                <th className="p-2 text-center font-mono">Dhuha</th>
                <th className="p-2 text-center font-mono text-emerald-600 dark:text-emerald-400">Dzuhur</th>
                <th className="p-2 text-center font-mono text-emerald-600 dark:text-emerald-400">Ashar</th>
                <th className="p-2 text-center font-mono text-emerald-600 dark:text-emerald-400">Maghrib</th>
                <th className="p-2 text-center font-mono text-emerald-600 dark:text-emerald-400">Isya</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-mono text-[11px] text-slate-700 dark:text-slate-300">
              {scheduleRows.map((r) => {
                const isToday =
                  currentDate.getDate() === r.day &&
                  currentDate.getMonth() === selectedMonth &&
                  currentDate.getFullYear() === selectedYear;

                return (
                  <tr
                    key={r.day}
                    className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 ${
                      isToday ? 'bg-emerald-50 dark:bg-emerald-950/40 font-bold text-emerald-900 dark:text-emerald-200' : ''
                    }`}
                  >
                    <td className="p-2 text-center font-bold font-sans">{r.day}</td>
                    <td className="p-2 font-sans">{r.dayName}</td>
                    <td className="p-2 font-sans">{r.hijriFormatted}</td>
                    <td className="p-2 font-sans">{r.pasaran}</td>
                    <td className="p-2 text-center">{r.times.imsak}</td>
                    <td className="p-2 text-center font-bold text-emerald-700 dark:text-emerald-300">{r.times.fajr}</td>
                    <td className="p-2 text-center text-slate-400">{r.times.sunrise}</td>
                    <td className="p-2 text-center text-slate-500">{r.times.dhuha}</td>
                    <td className="p-2 text-center font-bold text-emerald-700 dark:text-emerald-300">{r.times.dhuhr}</td>
                    <td className="p-2 text-center font-bold text-emerald-700 dark:text-emerald-300">{r.times.asr}</td>
                    <td className="p-2 text-center font-bold text-emerald-700 dark:text-emerald-300">{r.times.maghrib}</td>
                    <td className="p-2 text-center font-bold text-emerald-700 dark:text-emerald-300">{r.times.isha}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Print Footer Note */}
          <div className="hidden print:flex items-center justify-between mt-4 pt-2 border-t text-[9px] text-slate-600">
            <div>
              Standar Hisab Falak Kemenag RI • Dihitung dengan Akurat Time Indonesia
            </div>
            <div>
              Pengembang: Husni, S. Kom. I (KUA Gerung, Lombok Barat)
            </div>
          </div>
        </div>

      </div>

      {/* Dedicated Direct Print Dialog */}
      <DirectPrintDialog
        isOpen={isPrintDialogOpen}
        onClose={() => setIsPrintDialogOpen(false)}
        documentTitle={`Jadwal Waktu Sholat & Imsakiyah ${monthNames[selectedMonth]} ${selectedYear}`}
        documentSubtitle={`${location.name}, ${location.province} (${location.timezoneName})`}
        onTriggerBrowserPrint={() => {
          try {
            window.print();
          } catch {
            // ignore
          }
        }}
        onDownloadPdf={handlePrintOrPdf}
        isSavingPdf={isSavingPdf}
        printQueryParam="monthly"
        paperSize="F4 / Folio (215 × 330 mm)"
      />
    </div>
  );
};
