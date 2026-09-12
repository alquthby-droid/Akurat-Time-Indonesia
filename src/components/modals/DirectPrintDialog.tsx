import React from 'react';
import { Printer, ExternalLink, FileDown, X, AlertCircle, CheckCircle2, SlidersHorizontal, Loader2 } from 'lucide-react';

interface DirectPrintDialogProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle: string;
  documentSubtitle?: string;
  onTriggerBrowserPrint: () => void;
  onDownloadPdf: () => void;
  isSavingPdf?: boolean;
  printQueryParam: 'monthly' | 'qibla';
  paperSize?: string;
}

export const DirectPrintDialog: React.FC<DirectPrintDialogProps> = ({
  isOpen,
  onClose,
  documentTitle,
  documentSubtitle,
  onTriggerBrowserPrint,
  onDownloadPdf,
  isSavingPdf = false,
  printQueryParam,
  paperSize = 'F4 / Folio (215 × 330 mm)',
}) => {
  if (!isOpen) return null;

  const isInIframe = typeof window !== 'undefined' && window.self !== window.top;

  const getStandalonePrintUrl = () => {
    if (typeof window === 'undefined') return '';
    const url = new URL(window.location.href);
    url.searchParams.set('print', printQueryParam);
    return url.toString();
  };

  const handleOpenStandaloneTab = () => {
    const standaloneUrl = getStandalonePrintUrl();
    window.open(standaloneUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col text-slate-900 dark:text-white">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white leading-tight">
                Menu Cetak Langsung &amp; Simpan Dokumen
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {documentTitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto max-h-[75vh]">
          
          {/* Iframe Notice if detected */}
          {isInIframe && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5 shadow-2xs">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold block">Pemberitahuan Pratinjau Browser:</span>
                Aplikasi sedang berada dalam mode frame (iframe). Kebijakan keamanan browser membatasi jendela cetak otomatis di dalam frame. Gunakan tombol <strong>Buka di Tab Baru</strong> atau <strong>Unduh PDF F4</strong> untuk cetak langsung ke printer Anda.
              </div>
            </div>
          )}

          {/* Action Grid */}
          <div className="space-y-3">
            
            {/* Action 1: Standalone Tab (Recommended for iframe) */}
            <div className="p-4 rounded-xl border-2 border-emerald-500/40 bg-emerald-50/50 dark:bg-emerald-950/30 hover:border-emerald-500 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <ExternalLink className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-emerald-950 dark:text-emerald-300">
                      Buka di Tab Baru &amp; Cetak Otomatis
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100">
                      Paling Lancar
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    Membuka halaman di tab mandiri browser bebas frame, dialog printer langsung muncul otomatis.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleOpenStandaloneTab}
                className="shrink-0 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Buka Tab &amp; Cetak</span>
              </button>
            </div>

            {/* Action 2: Direct Browser Print */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-600 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800 dark:bg-slate-700 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Printer className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-sm text-slate-900 dark:text-white block">
                    Panggil Jendela Cetak Browser (Ctrl + P)
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Memicu perintah cetak browser langsung pada halaman aktif saat ini.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onTriggerBrowserPrint();
                }}
                className="shrink-0 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Sekarang</span>
              </button>
            </div>

            {/* Action 3: Download High-Res PDF */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-600 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <FileDown className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-sm text-slate-900 dark:text-white block">
                    Unduh Dokumen PDF Siap Cetak (F4)
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    File PDF resmi beresolusi tinggi dengan tata letak presisi kertas F4 (215 × 330 mm).
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onDownloadPdf}
                disabled={isSavingPdf}
                className={`shrink-0 px-4 py-2 rounded-xl text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                  isSavingPdf ? 'bg-blue-800 cursor-wait' : 'bg-blue-700 hover:bg-blue-600 active:bg-blue-800'
                }`}
              >
                {isSavingPdf ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Memproses PDF...</span>
                  </>
                ) : (
                  <>
                    <FileDown className="w-4 h-4" />
                    <span>Unduh PDF F4</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* Recommended Print Settings Box */}
          <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 mb-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Panduan Pengaturan Printer Resmi:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 dark:text-slate-300 text-[11px]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Ukuran Kertas: <strong>{paperSize}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Orientasi: <strong>Potret (Portrait)</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Margin: <strong>Minimum atau 6 - 8 mm</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Centang opsi: <strong>Grafik Latar Belakang (Background Graphics)</strong></span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 flex items-center justify-between text-xs text-slate-500">
          <span>Kemenag RI • KUA Kecamatan Gerung</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
