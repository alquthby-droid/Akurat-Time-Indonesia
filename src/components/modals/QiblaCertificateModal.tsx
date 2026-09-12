import React, { useState, useRef } from 'react';
import {
  X,
  Printer,
  Download,
  FileCheck2,
  Compass,
  MapPin,
  Calendar,
  User,
  ShieldCheck,
  CheckCircle2,
  Building2,
  QrCode,
  Sparkles,
  Award,
  FileDown,
  Loader2,
  Camera,
  Image as ImageIcon,
  Upload,
  RotateCcw,
  FileText,
  Layers,
} from 'lucide-react';
import { LocationInfo, QiblaInfo } from '../../types';
import { KemenagLogo } from '../KemenagLogo';
import { exportElementToA4Pdf } from '../../utils/pdfExport';
import { CalibrationPhoto, DEFAULT_CALIBRATION_PHOTOS } from '../../data/calibrationPhotos';
import { QiblaAttachmentSheet } from './QiblaAttachmentSheet';
import { DirectPrintDialog } from './DirectPrintDialog';

interface QiblaCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  qibla: QiblaInfo;
  location: LocationInfo;
  currentDate: Date;
}

export const QiblaCertificateModal: React.FC<QiblaCertificateModalProps> = ({
  isOpen,
  onClose,
  qibla,
  location,
  currentDate,
}) => {
  // Customizable Certificate Field States
  const [mosqueName, setMosqueName] = useState<string>("Masjid Jami' Baiturrahman");
  const [mosqueAddress, setMosqueAddress] = useState<string>(
    `Jl. Gatot Subroto, Gerung Utara, Kec. Gerung, Kab. Lombok Barat, NTB`
  );
  const [certNumber, setCertNumber] = useState<string>(
    `B-084/Kua.18.01/01/BA.01/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()}`
  );
  const [calibratorName, setCalibratorName] = useState<string>('Husni, S. Kom. I');
  const [calibratorRole, setCalibratorRole] = useState<string>('Penyuluh Agama Islam KUA Kec. Gerung');
  const [takmirName, setTakmirName] = useState<string>('H. Lalu Zulkifli, S.Pd.');
  const [witnessName, setWitnessName] = useState<string>('Ust. H. M. Ridwan, M.Pd.I');
  const [kuaHeadName, setKuaHeadName] = useState<string>('H. Lalu Muhtar, S.Ag., M.H.');
  const [methodUsed, setMethodUsed] = useState<string>(
    'Theodolite Geodetik & Bayang-Bayang Rashdul Qiblah (Istiwa A\'zam)'
  );
  const [measurementNotes, setMeasurementNotes] = useState<string>(
    'Arah kiblat telah ditandai dengan garis permanen dan saf salat telah disesuaikan 100% presisi mengarah ke Ka\'bah.'
  );

  // Helper to compute automatic falak accuracy based on calibration method and astronomical criteria
  const computeAutoFalakAccuracy = (method: string) => {
    const m = method.toLowerCase();
    if (m.includes('theodolite') || m.includes('teodolit') || m.includes('total station')) {
      return {
        value: '± 0° 00\' 01"',
        desc: 'Orde 1 Detik Busur (Theodolite Geodetik)',
      };
    }
    if (m.includes('rashdul') || m.includes('istiwa') || m.includes('bayang')) {
      return {
        value: '± 0° 00\' 05"',
        desc: 'Bayang-Bayang Rashdul Qiblah',
      };
    }
    if (m.includes('100%') || m.includes('saf') || m.includes('permanen')) {
      return {
        value: '± 0° 00\' 00"',
        desc: '100% Presisi Saf Sempurna',
      };
    }
    return {
      value: '± 0° 00\' 01"',
      desc: 'Standar Presisi Falakiyah Kemenag',
    };
  };

  // State for Akurasi Falak (Auto-filled by default based on initial method)
  const initialFalak = computeAutoFalakAccuracy('Theodolite Geodetik & Bayang-Bayang Rashdul Qiblah');
  const [falakAccuracy, setFalakAccuracy] = useState<string>(initialFalak.value);
  const [falakAccuracyDesc, setFalakAccuracyDesc] = useState<string>(initialFalak.desc);

  // Calibration Photos & Attachment States
  const [photos, setPhotos] = useState<CalibrationPhoto[]>(DEFAULT_CALIBRATION_PHOTOS);
  const [includeAttachment, setIncludeAttachment] = useState<boolean>(true);
  const [photoCount, setPhotoCount] = useState<number>(4);
  const [previewPage, setPreviewPage] = useState<'all' | 'certificate' | 'attachment'>('all');
  const [isPhotoManagerOpen, setIsPhotoManagerOpen] = useState<boolean>(false);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<'preview' | 'edit'>('preview');
  const [isSavingPdf, setIsSavingPdf] = useState<boolean>(false);
  const [savePdfMessage, setSavePdfMessage] = useState<string | null>(null);

  const certificateRef = useRef<HTMLDivElement>(null);
  const attachmentRef = useRef<HTMLDivElement>(null);

  const handleDirectPrint = () => {
    try {
      window.print();
    } catch {
      // ignore
    }
    setIsPrintDialogOpen(true);
  };

  // Photo handlers
  const handlePhotoUpload = (id: string, file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setPhotos((prev) =>
          prev.map((p) => (p.id === id ? { ...p, imageUrl: result, isCustom: true } : p))
        );
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetPhoto = (id: string) => {
    const defaultP = DEFAULT_CALIBRATION_PHOTOS.find((p) => p.id === id);
    if (defaultP) {
      setPhotos((prev) =>
        prev.map((p) => (p.id === id ? { ...defaultP, isCustom: false } : p))
      );
    }
  };

  const handleUpdatePhoto = (
    id: string,
    field: 'title' | 'caption' | 'category',
    value: string
  ) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  if (!isOpen) return null;

  // Formatting values
  const dateFormatted = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(currentDate);

  const deg = Math.floor(qibla.azimuthDegrees);
  const min = Math.floor((qibla.azimuthDegrees - deg) * 60);
  const sec = Math.round(((qibla.azimuthDegrees - deg) * 60 - min) * 60);
  const azimuthDMS = `${deg}° ${min}' ${sec}"`;

  // Active Save PDF handler with automatic download for single or multi-page F4 documents
  const handleSavePdf = async () => {
    if (activeTab !== 'preview') {
      setActiveTab('preview');
      await new Promise((r) => setTimeout(r, 120));
    }

    const elementsToExport: HTMLElement[] = [];
    if (certificateRef.current) {
      elementsToExport.push(certificateRef.current);
    }
    if (includeAttachment && attachmentRef.current) {
      elementsToExport.push(attachmentRef.current);
    }

    if (elementsToExport.length === 0) {
      window.print();
      return;
    }

    setIsSavingPdf(true);
    setSavePdfMessage(
      elementsToExport.length > 1
        ? 'Sedang memproses 2 Halaman PDF Resmi F4 (Sertifikat & Lampiran Foto)...'
        : 'Sedang memproses dokumen PDF resmi F4...'
    );

    try {
      const sanitizedName = mosqueName.trim().replace(/[^a-zA-Z0-9]/g, '_');
      const fileName = `Sertifikat_Kalibrasi_Kiblat_${sanitizedName}_F4.pdf`;

      const success = await exportElementToA4Pdf(elementsToExport, {
        fileName,
        paperFormat: 'f4',
        onSuccess: () => {
          setSavePdfMessage(
            `PDF Berhasil Disimpan! File ${fileName} (${elementsToExport.length} Halaman F4) telah diunduh.`
          );
          setTimeout(() => setSavePdfMessage(null), 5000);
        },
        onError: () => {
          setSavePdfMessage('Membuka pratinjau cetak browser...');
          setTimeout(() => setSavePdfMessage(null), 4000);
        },
      });

      if (!success) {
        window.print();
      }
    } catch (err) {
      console.error('Error saving PDF:', err);
      window.print();
    } finally {
      setIsSavingPdf(false);
    }
  };

  // Export standalone printable HTML document for instant offline saving (supporting multi-page F4)
  const handleDownloadHtml = () => {
    if (!certificateRef.current) return;
    const certHtml = certificateRef.current.innerHTML;
    const attachHtml =
      includeAttachment && attachmentRef.current ? attachmentRef.current.innerHTML : '';
    const fullDoc = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Sertifikat Kalibrasi Arah Kiblat & Lampiran - ${mosqueName}</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css">
  <style>
    @page { size: 215mm 330mm; margin: 8mm; }
    body { font-family: 'Times New Roman', Times, serif; color: #111; background: #f3f4f6; margin: 0; padding: 20px; }
    .doc-page { max-width: 820px; margin: 0 auto 30px auto; padding: 28px; border: 4px double #064e3b; background: #fff; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
    .page-break { page-break-before: always; break-before: page; margin-top: 25px; }
    @media print {
      body { margin: 0; padding: 0; background: #fff; }
      .no-print { display: none !important; }
      .doc-page { border: 3px double #064e3b; box-shadow: none; margin: 0; }
      .page-break { page-break-before: always; break-before: page; }
    }
  </style>
</head>
<body>
  <div class="no-print text-center py-4">
    <button onclick="window.print()" style="background:#059669;color:#fff;padding:10px 20px;border-radius:8px;font-weight:bold;cursor:pointer;border:none;font-size:14px;box-shadow:0 2px 4px rgba(0,0,0,0.2);">
      Cetak / Simpan PDF F4 (215 × 330 mm) Sekarang
    </button>
  </div>
  <div class="doc-page">
    ${certHtml}
  </div>
  ${
    attachHtml
      ? `
  <div class="doc-page page-break">
    ${attachHtml}
  </div>`
      : ''
  }
</body>
</html>`;
    const blob = new Blob([fullDoc], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Dokumen_Kiblat_Lengkap_${mosqueName.replace(/\s+/g, '_')}_F4.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      {/* Print Stylesheet injection to ensure pristine multi-page F4 (Folio) PDF layout */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          html, body {
            overflow: visible !important;
            height: auto !important;
            background: white !important;
            color: black !important;
          }
          body * {
            visibility: hidden !important;
          }
          .fixed, [class*="backdrop-blur"] {
            position: static !important;
            overflow: visible !important;
            padding: 0 !important;
            background: transparent !important;
          }
          .max-h-\[95vh\], [class*="overflow-hidden"], [class*="overflow-y-auto"] {
            max-height: none !important;
            overflow: visible !important;
            border: none !important;
            box-shadow: none !important;
            background: transparent !important;
          }
          #printable-qibla-certificate, #printable-qibla-certificate *,
          #printable-qibla-attachment, #printable-qibla-attachment * {
            visibility: visible !important;
          }
          #printable-qibla-certificate,
          #printable-qibla-attachment {
            display: block !important;
            position: relative !important;
            left: auto !important;
            top: auto !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 auto 0 auto !important;
            padding: 8mm !important;
            border: 3px double #047857 !important;
            box-shadow: none !important;
            background: white !important;
            color: black !important;
            font-size: 11pt !important;
            page-break-after: always !important;
            break-after: page !important;
          }
          #printable-qibla-attachment:last-child {
            page-break-after: auto !important;
            break-after: auto !important;
          }
          @page {
            size: 215mm 330mm;
            margin: 8mm;
          }
        }
      `}} />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden shadow-2xl flex flex-col my-auto">
        
        {/* Modal Top Header (Hidden on Print) */}
        <div className="p-3.5 sm:p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 sticky top-0 z-20 print:hidden">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center p-1 border border-slate-200 dark:border-slate-700 shadow-xs shrink-0">
              <KemenagLogo className="w-8 h-8 sm:w-9 sm:h-9" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Sertifikat &amp; Berita Acara Kalibrasi Kiblat
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  Format F4 / Folio (21.5 × 33 cm)
                </span>
                {includeAttachment && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-300 dark:border-blue-800 flex items-center gap-1">
                    <Camera className="w-3 h-3" />
                    <span>+ Lampiran Foto ({photoCount})</span>
                  </span>
                )}
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                KUA Kecamatan Gerung • Kantor Kementerian Agama Kabupaten Lombok Barat
              </p>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex rounded-lg bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  activeTab === 'preview'
                    ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Pratinjau Dokumen
              </button>
              <button
                onClick={() => setActiveTab('edit')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                  activeTab === 'edit'
                    ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <span>Edit Data &amp; Foto</span>
                {photos.some((p) => p.isCustom) && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                )}
              </button>
            </div>

            {/* Save PDF button */}
            <button
              id="btn-save-pdf-qibla"
              onClick={handleSavePdf}
              disabled={isSavingPdf}
              className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl text-white text-xs font-bold shadow-md cursor-pointer transition-all ${
                isSavingPdf
                  ? 'bg-emerald-800 opacity-90 cursor-wait'
                  : 'bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 shadow-emerald-700/20'
              }`}
              title="Simpan Dokumen Lengkap (Sertifikat & Lampiran Foto) sebagai PDF Resmi F4"
            >
              {isSavingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyimpan PDF F4...</span>
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4" />
                  <span>Simpan PDF ({includeAttachment ? '2 Lembar F4' : 'F4'})</span>
                </>
              )}
            </button>

            {/* Direct Print Button */}
            <button
              id="btn-print-qibla-cert"
              type="button"
              onClick={handleDirectPrint}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs font-bold cursor-pointer transition-colors shadow-2xs"
              title="Cetak Dokumen Lengkap F4 (Printer Fisik / PDF)"
            >
              <Printer className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              <span>Cetak Langsung</span>
            </button>

            {/* Download HTML Backup */}
            <button
              onClick={handleDownloadHtml}
              className="hidden md:flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
              title="Unduh Salinan Dokumen Mandiri (HTML)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Dokumen</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ml-1"
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

        {/* Tab switch for mobile */}
        <div className="flex sm:hidden border-b border-slate-200 dark:border-slate-800 p-2 bg-slate-50 dark:bg-slate-800/60 print:hidden">
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg text-center ${
              activeTab === 'preview' ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Pratinjau Dokumen
          </button>
          <button
            onClick={() => setActiveTab('edit')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg text-center ${
              activeTab === 'edit' ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Edit Data &amp; Foto
          </button>
        </div>

        {/* Page Switcher & Attachment Toolbar (Visible on Preview Mode) */}
        {activeTab === 'preview' && (
          <div className="bg-slate-50 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700 px-3.5 sm:px-5 py-2.5 flex flex-wrap items-center justify-between gap-2.5 print:hidden text-xs">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-semibold text-slate-600 dark:text-slate-300 mr-1 flex items-center gap-1 text-[11px] sm:text-xs">
                <Layers className="w-3.5 h-3.5 text-emerald-600" />
                <span>Tampilan:</span>
              </span>
              <button
                onClick={() => setPreviewPage('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                  previewPage === 'all'
                    ? 'bg-emerald-700 text-white font-bold shadow-xs'
                    : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600'
                }`}
              >
                Semua {includeAttachment ? '(2 Halaman F4)' : '(1 Halaman)'}
              </button>
              <button
                onClick={() => setPreviewPage('certificate')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                  previewPage === 'certificate'
                    ? 'bg-emerald-700 text-white font-bold shadow-xs'
                    : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600'
                }`}
              >
                Halaman 1: Sertifikat
              </button>
              {includeAttachment && (
                <button
                  onClick={() => setPreviewPage('attachment')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors flex items-center gap-1 ${
                    previewPage === 'attachment'
                      ? 'bg-emerald-700 text-white font-bold shadow-xs'
                      : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600'
                  }`}
                >
                  <Camera className="w-3 h-3 text-emerald-500" />
                  <span>Halaman 2: Lampiran Foto</span>
                </button>
              )}
            </div>

            {/* Attachment Quick Toggle in Preview */}
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-200 font-medium">
                <input
                  type="checkbox"
                  checked={includeAttachment}
                  onChange={(e) => setIncludeAttachment(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer accent-emerald-600"
                />
                <span className="text-[11.5px] sm:text-xs">Sertakan Lampiran Foto ({photoCount} Foto)</span>
              </label>
              {includeAttachment && (
                <button
                  type="button"
                  onClick={() => setIsPhotoManagerOpen(true)}
                  className="px-2.5 py-1 rounded-md bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950/80 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-300 font-bold text-[11px] sm:text-xs flex items-center gap-1.5 cursor-pointer ml-1 transition-colors border border-emerald-300 dark:border-emerald-800"
                  title="Ganti atau unggah foto dokumentasi kalibrasi"
                >
                  <Upload className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                  <span>Kelola / Unggah Foto</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-slate-100 dark:bg-slate-950 flex flex-col items-center">
          
          {/* Edit Form Panel */}
          {activeTab === 'edit' && (
            <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-md mb-6 space-y-4 print:hidden">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  Formulir Data Kalibrasi Lapangan
                </h4>
                <button
                  onClick={() => setActiveTab('preview')}
                  className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  Lihat Hasil Pratinjau →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Nama Masjid / Musholla:
                  </label>
                  <input
                    type="text"
                    value={mosqueName}
                    onChange={(e) => setMosqueName(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                    placeholder="Contoh: Masjid Jami' Baiturrahman"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Nomor Berita Acara / Sertifikat:
                  </label>
                  <input
                    type="text"
                    value={certNumber}
                    onChange={(e) => setCertNumber(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Alamat Lengkap Tempat Ibadah:
                  </label>
                  <input
                    type="text"
                    value={mosqueAddress}
                    onChange={(e) => setMosqueAddress(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Petugas Kalibrasi (Penyuluh Agama Islam):
                  </label>
                  <input
                    type="text"
                    value={calibratorName}
                    onChange={(e) => setCalibratorName(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Jabatan Petugas:
                  </label>
                  <input
                    type="text"
                    value={calibratorRole}
                    onChange={(e) => setCalibratorRole(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Nama Ketua Takmir / Pengurus:
                  </label>
                  <input
                    type="text"
                    value={takmirName}
                    onChange={(e) => setTakmirName(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Nama Saksi / Tokoh Agama:
                  </label>
                  <input
                    type="text"
                    value={witnessName}
                    onChange={(e) => setWitnessName(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Metode & Peralatan Pengukuran:
                  </label>
                  <input
                    type="text"
                    value={methodUsed}
                    onChange={(e) => {
                      const newMethod = e.target.value;
                      setMethodUsed(newMethod);
                      const auto = computeAutoFalakAccuracy(newMethod);
                      setFalakAccuracy(auto.value);
                      setFalakAccuracyDesc(auto.desc);
                    }}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Fitur Pengisian Otomatis Akurasi Falak */}
                <div className="sm:col-span-2 p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <label className="font-bold text-xs text-emerald-950 dark:text-emerald-300 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      Akurasi Falak (Kesimpulan & Status Kalibrasi):
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const auto = computeAutoFalakAccuracy(methodUsed);
                        setFalakAccuracy(auto.value);
                        setFalakAccuracyDesc(auto.desc);
                      }}
                      className="text-xs font-bold text-emerald-800 dark:text-emerald-300 hover:text-emerald-950 dark:hover:text-emerald-100 underline flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Hitung / Isi Otomatis</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
                        Toleransi Sudut (DMS):
                      </span>
                      <input
                        type="text"
                        value={falakAccuracy}
                        onChange={(e) => setFalakAccuracy(e.target.value)}
                        placeholder="Contoh: ± 0° 00' 01&quot;"
                        className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs font-bold focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
                        Keterangan Standar Falakiyah:
                      </span>
                      <input
                        type="text"
                        value={falakAccuracyDesc}
                        onChange={(e) => setFalakAccuracyDesc(e.target.value)}
                        placeholder="Keterangan Akurasi Falak"
                        className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Preset Pilihan Cepat Kemenag */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <span className="text-[10.5px] font-semibold text-slate-600 dark:text-slate-400">
                      Pilihan Cepat Standar:
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setFalakAccuracy('± 0° 00\' 01"');
                        setFalakAccuracyDesc('Orde 1 Detik Busur (Theodolite Geodetik)');
                      }}
                      className="px-2.5 py-1 rounded text-[11px] bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 font-mono text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 cursor-pointer font-bold shadow-2xs"
                    >
                      ± 0° 00' 01" (Theodolite)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFalakAccuracy('± 0° 00\' 00"');
                        setFalakAccuracyDesc('100% Presisi Saf Sempurna');
                      }}
                      className="px-2.5 py-1 rounded text-[11px] bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 font-mono text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 cursor-pointer font-bold shadow-2xs"
                    >
                      ± 0° 00' 00" (Saf Presisi 100%)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFalakAccuracy('± 0° 00\' 05"');
                        setFalakAccuracyDesc('Bayang-Bayang Rashdul Qiblah');
                      }}
                      className="px-2.5 py-1 rounded text-[11px] bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 font-mono text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 cursor-pointer font-bold shadow-2xs"
                    >
                      ± 0° 00' 05" (Rashdul Qiblah)
                    </button>
                  </div>
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Catatan Pelaksanaan &amp; Hasil Kalibrasi Saf:
                  </label>
                  <textarea
                    rows={2}
                    value={measurementNotes}
                    onChange={(e) => setMeasurementNotes(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Section: Lampiran Dokumentasi Foto Hasil Kalibrasi (Halaman 2 F4) */}
                <div className="sm:col-span-2 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center text-emerald-800 dark:text-emerald-300 shrink-0">
                        <Camera className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                          <span>Lampiran Foto Hasil Kalibrasi (Halaman 2 F4)</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                            Berita Acara Resmi
                          </span>
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Dokumentasi visual pengukuran lapangan, azimuth theodolite, dan saf kiblat untuk diikutsertakan pada cetak &amp; PDF.
                        </p>
                      </div>
                    </div>

                    {/* Enable / Disable Attachment Toggle */}
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={includeAttachment}
                          onChange={(e) => setIncludeAttachment(e.target.checked)}
                          className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
                        />
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          Sertakan Lampiran Foto
                        </span>
                      </label>
                    </div>
                  </div>

                  {includeAttachment && (
                    <div className="space-y-4">
                      {/* Photo count selector */}
                      <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          Jumlah Foto yang Ditampilkan di Lembar Lampiran:
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setPhotoCount(4)}
                            className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer text-xs ${
                              photoCount === 4
                                ? 'bg-emerald-700 text-white shadow-xs'
                                : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600'
                            }`}
                          >
                            4 Foto Lengkap (Grid 2×2 F4)
                          </button>
                          <button
                            type="button"
                            onClick={() => setPhotoCount(2)}
                            className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer text-xs ${
                              photoCount === 2
                                ? 'bg-emerald-700 text-white shadow-xs'
                                : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600'
                            }`}
                          >
                            2 Foto Utama (Vertikal F4)
                          </button>
                        </div>
                      </div>

                      {/* Photo Edit List */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                        {photos.slice(0, photoCount).map((p, idx) => (
                          <div
                            key={p.id}
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-xs space-y-2.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wide">
                                Foto #{idx + 1}: {p.category}
                              </span>
                              {p.isCustom ? (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                                  Foto Kustom Unggahan
                                </span>
                              ) : (
                                <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                  Ilustrasi Falak Resmi
                                </span>
                              )}
                            </div>

                            {/* Thumbnail & Upload Trigger */}
                            <div className="flex gap-3 items-center">
                              <div className="w-24 h-16 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shrink-0 relative group">
                                <img
                                  src={p.imageUrl}
                                  alt={p.title}
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              </div>

                              <div className="flex-1 space-y-1.5">
                                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 text-xs font-semibold cursor-pointer transition-colors shadow-2xs">
                                  <Upload className="w-3.5 h-3.5" />
                                  <span>Ganti / Unggah Foto</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) handlePhotoUpload(p.id, file);
                                    }}
                                  />
                                </label>

                                {p.isCustom && (
                                  <button
                                    type="button"
                                    onClick={() => handleResetPhoto(p.id)}
                                    className="block text-[10.5px] text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 flex items-center gap-1 cursor-pointer transition-colors"
                                    title="Kembalikan ke ilustrasi falak bawaan sistem"
                                  >
                                    <RotateCcw className="w-3 h-3" />
                                    <span>Reset ke Ilustrasi Falak</span>
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Caption & Title inputs */}
                            <div className="space-y-1.5 pt-1">
                              <div>
                                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-0.5">
                                  Judul Foto:
                                </label>
                                <input
                                  type="text"
                                  value={p.title}
                                  onChange={(e) => handleUpdatePhoto(p.id, 'title', e.target.value)}
                                  className="w-full p-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-1 focus:ring-emerald-500"
                                />
                              </div>
                              <div>
                                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-0.5">
                                  Keterangan / Deskripsi:
                                </label>
                                <textarea
                                  rows={2}
                                  value={p.caption}
                                  onChange={(e) => handleUpdatePhoto(p.id, 'caption', e.target.value)}
                                  className="w-full p-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-1 focus:ring-emerald-500"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  onClick={() => setActiveTab('preview')}
                  className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-600 transition-colors shadow-xs"
                >
                  Terapkan &amp; Lihat Dokumen (2 Halaman F4)
                </button>
              </div>
            </div>
          )}

          {/* Printable Official Certificate Sheet (Format Kertas F4 / Folio: 215 × 330 mm) */}
          <div
            id="printable-qibla-certificate"
            ref={certificateRef}
            className={`w-full max-w-[820px] bg-white text-slate-900 px-6 py-6 sm:px-8 sm:py-7 pb-8 sm:pb-10 shadow-2xl rounded-sm border-4 border-double border-emerald-900 relative mb-8 select-text box-border ${
              previewPage === 'attachment' ? 'hidden print:block' : 'block'
            }`}
            style={{ minHeight: '1060px', fontFamily: "'Times New Roman', Times, serif" }}
          >
            {/* Background Watermark Official Emblem */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04]">
              <KemenagLogo className="w-[450px] h-[450px]" />
            </div>

            {/* 1. KOP SURAT DINAS KEMENTERIAN AGAMA */}
            <div className="border-b-2 border-slate-900 pb-3 mb-4">
              <div className="flex items-center justify-between gap-2 sm:gap-4">
                <div className="shrink-0">
                  <KemenagLogo className="w-16 h-16 sm:w-20 sm:h-20" />
                </div>
                <div className="flex-1 text-center font-serif text-slate-900 px-1 sm:px-2">
                  <h4 className="text-[11.5px] sm:text-[13px] md:text-[14px] font-bold tracking-wider uppercase leading-tight text-slate-800">
                    KEMENTERIAN AGAMA REPUBLIK INDONESIA
                  </h4>
                  <h3 className="text-[11px] sm:text-[12.5px] md:text-[13.5px] font-bold uppercase leading-tight text-emerald-950 mt-0.5 tracking-normal whitespace-normal sm:whitespace-nowrap">
                    KANTOR KEMENTERIAN AGAMA KABUPATEN LOMBOK BARAT
                  </h3>
                  <h2 className="text-[13px] sm:text-[14.5px] md:text-[15.5px] font-black uppercase leading-tight text-emerald-900 mt-0.5 tracking-wide whitespace-normal sm:whitespace-nowrap">
                    KANTOR URUSAN AGAMA KECAMATAN GERUNG
                  </h2>
                  <p className="text-[10px] sm:text-[11px] text-slate-700 mt-1 leading-snug">
                    Jl. Gatot Subroto, Gerung Utara, Kecamatan Gerung, Kabupaten Lombok Barat, NTB
                  </p>
                  <p className="text-[9.5px] sm:text-[10.5px] text-slate-600 leading-snug font-mono">
                    Email: <span className="font-semibold text-emerald-800">kuagerung2025@gmail.com</span> • Kode Pos: 83363
                  </p>
                </div>
                <div className="shrink-0 w-16 sm:w-20 flex justify-center">
                  {/* QR Code Verifikasi Berita Acara */}
                  <div className="w-14 h-14 sm:w-16 sm:h-16 border border-slate-300 p-1 flex flex-col items-center justify-center text-center bg-slate-50">
                    <QrCode className="w-9 h-9 sm:w-10 sm:h-10 text-emerald-900" />
                    <span className="text-[7px] font-sans font-bold text-slate-600">VERIFIKASI</span>
                  </div>
                </div>
              </div>
              {/* Double Horizontal Line */}
              <div className="border-b-4 border-slate-900 mt-3" />
              <div className="border-b border-slate-900 mt-0.5" />
            </div>

            {/* 2. JUDUL DOKUMEN & NOMOR */}
            <div className="text-center my-3 sm:my-4">
              <h1 className="text-[13px] sm:text-[15px] md:text-[16.5px] font-bold uppercase tracking-normal sm:tracking-wide text-emerald-950 underline decoration-1 decoration-slate-900 underline-offset-4 leading-normal sm:whitespace-nowrap">
                SERTIFIKAT & BERITA ACARA KALIBRASI ARAH KIBLAT
              </h1>
              <p className="text-xs sm:text-[12.5px] font-bold text-slate-800 mt-1 font-mono">
                Nomor: {certNumber}
              </p>
            </div>

            {/* 3. MUKADIMAH / PENGANTAR RESMI */}
            <div className="text-xs sm:text-[13px] text-slate-900 leading-relaxed text-justify space-y-2 mb-4">
              <p>
                Pada hari ini, <strong className="font-bold">{dateFormatted}</strong>, berdasarkan permohonan pengukuran kiblat dari pengurus takmir masjid/musholla setempat serta mengacu pada kriteria hisab astronomi dan falakiyah Kementerian Agama Republik Indonesia, telah dilaksanakan pengukuran dan kalibrasi arah kiblat oleh Petugas Kantor Urusan Agama (KUA) Kecamatan Gerung, terhadap:
              </p>
            </div>

            {/* 4. TABEL IDENTITAS MASJID & DATA TEKNIS GEODETIS */}
            <div className="border border-slate-800 my-3 text-xs sm:text-[12.5px]">
              <div className="bg-emerald-950 text-white font-bold py-1 px-3 text-center uppercase tracking-wide text-xs">
                I. IDENTITAS TEMPAT IBADAH & LOKASI
              </div>
              <table className="w-full border-collapse">
                <tbody>
                  <tr className="border-b border-slate-300">
                    <td className="w-48 py-1.5 px-3 font-bold bg-slate-50 border-r border-slate-300">Nama Tempat Ibadah</td>
                    <td className="py-1.5 px-3 font-extrabold text-emerald-950 text-sm">{mosqueName}</td>
                  </tr>
                  <tr className="border-b border-slate-300">
                    <td className="py-1.5 px-3 font-bold bg-slate-50 border-r border-slate-300">Alamat Lengkap</td>
                    <td className="py-1.5 px-3 text-slate-800">{mosqueAddress}</td>
                  </tr>
                  <tr className="border-b border-slate-300">
                    <td className="py-1.5 px-3 font-bold bg-slate-50 border-r border-slate-300">Koordinat Geografis (GPS)</td>
                    <td className="py-1.5 px-3 font-mono font-bold text-slate-900">
                      Lintang: {location.latitude}° ({location.latitude < 0 ? 'LS' : 'LU'}) • Bujur: {location.longitude}° BT • Elevasi: {location.elevationMeters} mdpl
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-3 font-bold bg-slate-50 border-r border-slate-300">Wilayah Administratif</td>
                    <td className="py-1.5 px-3 text-slate-800">{location.name}, {location.province} ({location.timezoneName})</td>
                  </tr>
                </tbody>
              </table>

              <div className="bg-emerald-950 text-white font-bold py-1 px-3 text-center uppercase tracking-wide text-xs border-t border-slate-800">
                II. HASIL HISAB & KALIBRASI ARAH KIBLAT
              </div>
              <table className="w-full border-collapse">
                <tbody>
                  <tr className="border-b border-slate-300">
                    <td className="w-48 py-2 px-3 font-bold bg-slate-50 border-r border-slate-300">Azimut Arah Kiblat</td>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-base font-black text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                          {azimuthDMS} ({qibla.azimuthDegrees}°)
                        </span>
                        <span className="text-xs text-slate-600 font-semibold">
                          Dihitung dari Titik Utara Sejati (True North) ke Arah Barat
                        </span>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-slate-300">
                    <td className="py-1.5 px-3 font-bold bg-slate-50 border-r border-slate-300">Jarak Geodesik ke Ka'bah</td>
                    <td className="py-1.5 px-3 font-mono font-bold text-slate-800">
                      {qibla.distanceKm.toLocaleString('id-ID')} Kilometer (Garis Lurus Spherical Trigonometry)
                    </td>
                  </tr>
                  <tr className="border-b border-slate-300">
                    <td className="py-1.5 px-3 font-bold bg-slate-50 border-r border-slate-300">Fenomena Rashdul Qiblah</td>
                    <td className="py-1.5 px-3 text-slate-700">
                      Istiwa A'zam: 28 Mei (16:18 WITA) & 16 Juli (16:27 WITA) - Matahari tepat di atas Ka'bah
                    </td>
                  </tr>
                  <tr className="border-b border-slate-300">
                    <td className="py-1.5 px-3 font-bold bg-slate-50 border-r border-slate-300">Metode & Peralatan</td>
                    <td className="py-1.5 px-3 text-slate-800">{methodUsed}</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-3 font-bold bg-slate-50 border-r border-slate-300">Hasil & Penyesuaian Saf</td>
                    <td className="py-1.5 px-3 text-slate-800 italic">{measurementNotes}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 5. PERNYATAAN STATUS KEABSAHAN */}
            <div className="p-3 my-3 border border-emerald-800 bg-emerald-50/60 rounded flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-8 h-8 text-emerald-800 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                    KESIMPULAN &amp; STATUS KALIBRASI:
                  </div>
                  <div className="text-xs text-emerald-900 leading-snug">
                    Arah kiblat bangunan dan saf salat dinyatakan <strong className="font-extrabold text-emerald-950">TELAH AKURAT, VALID, DAN SAH</strong> sesuai tuntunan Syariat Islam dan Pedoman Penentuan Arah Kiblat Direktorat Urusan Agama Islam dan Pembinaan Syariah Kementerian Agama RI.
                  </div>
                </div>
              </div>
              <div className="shrink-0 text-center font-mono pl-3 border-l border-emerald-300">
                <div className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">Akurasi Falak</div>
                <div className="text-sm sm:text-base font-black text-emerald-950 tracking-tight whitespace-nowrap">
                  {falakAccuracy}
                </div>
                <div className="text-[8.5px] font-sans font-semibold text-emerald-700 leading-tight">
                  {falakAccuracyDesc}
                </div>
              </div>
            </div>

            {/* Catatan Lampiran Foto Dokumentasi Lapangan Resmi */}
            {includeAttachment && (
              <div className="flex items-center justify-between text-[11px] text-emerald-950 bg-emerald-50/90 border border-emerald-300 rounded px-2.5 py-1.5 my-2 font-sans">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>
                    <strong>Dokumentasi Kalibrasi:</strong> Dilengkapi Lembar Lampiran Foto Dokumentasi Pengukuran Lapangan &amp; Penataan Saf Kiblat (Halaman 2 Berita Acara).
                  </span>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide bg-white px-2 py-0.5 rounded border border-emerald-300 shrink-0 font-sans">
                  Terlampir ({photoCount} Foto)
                </span>
              </div>
            )}

            {/* 6. KOLOM TANDA TANGAN 3 PIHAK DENGAN STEMPEL RESMI */}
            <div className="mt-6 pt-1">
              <div className="text-right text-xs text-slate-800 mb-3 font-serif">
                Gerung, {dateFormatted}
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs text-slate-900 font-serif">
                {/* Kolom 1: Takmir Masjid */}
                <div className="flex flex-col justify-between h-32">
                  <div>
                    <div className="font-bold">Pengurus / Takmir Masjid</div>
                    <div className="text-[11px] text-slate-600">{mosqueName}</div>
                  </div>
                  <div>
                    <div className="font-bold underline uppercase">{takmirName}</div>
                    <div className="text-[10px] text-slate-500">Ketua Takmir</div>
                  </div>
                </div>

                {/* Kolom 2: Petugas Kalibrasi (Husni, S. Kom. I) */}
                <div className="flex flex-col justify-between h-32 relative">
                  <div>
                    <div className="font-bold">Petugas Kalibrasi Arah Kiblat</div>
                    <div className="text-[11px] text-slate-600">Penyuluh Agama Islam KUA Gerung</div>
                  </div>

                  {/* Digital Signature Simulation */}
                  <div className="my-auto text-emerald-800 font-serif italic text-sm select-none opacity-80">
                    [Tanda Tangan Digital]
                  </div>

                  <div>
                    <div className="font-bold underline uppercase text-emerald-950">
                      {calibratorName}
                    </div>
                    <div className="text-[10px] text-slate-600">NIP / Reg. Penyuluh Agama Islam</div>
                  </div>
                </div>

                {/* Kolom 3: Kepala KUA Kecamatan Gerung */}
                <div className="flex flex-col justify-between h-32 relative">
                  <div>
                    <div className="font-bold">Mengetahui:</div>
                    <div className="font-bold leading-tight">Kepala KUA Kecamatan Gerung</div>
                  </div>

                  {/* Official Circular Stamp Simulation */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                    <div className="w-24 h-24 rounded-full border-2 border-dashed border-emerald-900 flex flex-col items-center justify-center p-1 text-center transform -rotate-12">
                      <span className="text-[7px] font-black uppercase text-emerald-900">KEMENTERIAN AGAMA</span>
                      <span className="text-[6px] font-extrabold text-emerald-950">KUA KEC. GERUNG</span>
                      <span className="text-[5px] text-emerald-800">LOMBOK BARAT</span>
                    </div>
                  </div>

                  <div>
                    <div className="font-bold underline uppercase">{kuaHeadName}</div>
                    <div className="text-[10px] text-slate-600">Kepala KUA Kec. Gerung</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 7. FOOTER RESMI DOKUMEN */}
            <div className="mt-6 pt-2.5 border-t border-slate-400 flex items-center justify-between text-[10px] text-slate-500 font-sans">
              <div>
                Dokumen resmi diterbitkan melalui <strong>Akurat Time Indonesia v5.7 ID</strong> • Pengembang: <strong>Husni, S. Kom. I</strong>
              </div>
              <div>
                Berita Acara Kalibrasi Kiblat KUA Gerung • Halaman 1 dari {includeAttachment ? '2' : '1'}
              </div>
            </div>

          </div>

          {/* Lembar 2: Lampiran Foto Hasil Kalibrasi (Format Kertas F4 / Folio: 215 × 330 mm) */}
          {includeAttachment && (
            <div
              className={`w-full max-w-[820px] flex flex-col items-center mb-8 ${
                previewPage === 'certificate' ? 'hidden print:block' : 'block'
              }`}
            >
              {/* Screen Visual Divider */}
              <div className="w-full mb-4 py-2.5 px-3.5 sm:px-5 bg-emerald-50 dark:bg-emerald-950/80 border-2 border-emerald-400 dark:border-emerald-700 rounded-xl text-xs text-emerald-950 dark:text-emerald-100 print:hidden flex flex-wrap items-center justify-between gap-2 shadow-xs font-sans relative z-10">
                <div className="flex items-center gap-2 font-bold">
                  <Camera className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                  <span>Halaman 2: Lampiran Dokumentasi Foto Hasil Kalibrasi &amp; Penataan Saf</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10.5px] font-mono px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 font-bold">
                    Kertas F4 (215 × 330 mm)
                  </span>
                  <button
                    id="btn-manage-photos-attachment"
                    type="button"
                    onClick={() => setIsPhotoManagerOpen(true)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                    title="Buka panel untuk memilih dan mengunggah foto kalibrasi"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Ganti / Unggah Foto</span>
                  </button>

                  <button
                    id="btn-print-attachment"
                    type="button"
                    onClick={handleDirectPrint}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
                    title="Cetak langsung dokumen F4 (Sertifikat & Lampiran Foto)"
                  >
                    <Printer className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                    <span>Cetak Langsung</span>
                  </button>
                </div>
              </div>

              {/* Sheet 2 Content Component */}
              <QiblaAttachmentSheet
                attachmentRef={attachmentRef}
                mosqueName={mosqueName}
                mosqueAddress={mosqueAddress}
                certNumber={certNumber}
                dateFormatted={dateFormatted}
                location={location}
                qibla={qibla}
                azimuthDMS={azimuthDMS}
                falakAccuracy={falakAccuracy}
                calibratorName={calibratorName}
                takmirName={takmirName}
                kuaHeadName={kuaHeadName}
                photos={photos}
                showCount={photoCount}
                onPhotoUpload={handlePhotoUpload}
                onResetPhoto={handleResetPhoto}
                onOpenPhotoManager={() => setIsPhotoManagerOpen(true)}
              />
            </div>
          )}

          {/* Helper Tips Under Preview */}
          <div className="max-w-[820px] w-full mt-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden shadow-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Format Standar Dokumen:</strong> Lembar Kertas F4 / Folio (215 × 330 mm) Portrait
                {includeAttachment ? (
                  <strong className="text-emerald-800 dark:text-emerald-300"> • 2 Halaman (Sertifikat &amp; Lampiran Foto Kalibrasi)</strong>
                ) : (
                  ' • 1 Halaman (Sertifikat)'
                )}
                , siap simpan sebagai file PDF dan dicetak untuk arsip takmir masjid &amp; KUA.
              </span>
            </div>
            <button
              onClick={handleSavePdf}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow-xs cursor-pointer shrink-0 transition-colors"
            >
              <FileDown className="w-4 h-4" />
              <span>Simpan PDF ({includeAttachment ? '2 Lembar F4' : 'F4'})</span>
            </button>
          </div>

        </div>

      </div>

      {/* Dedicated Photo Upload & Management Dialog (Rendered at root z-70 for unconstrained interaction) */}
      {isPhotoManagerOpen && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/80">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white leading-tight">
                    Kelola &amp; Unggah Foto Kalibrasi Lapangan
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Pilih foto dari galeri/kamera perangkat untuk dilampirkan pada Halaman 2 F4
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPhotoManagerOpen(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-700 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {photos.slice(0, photoCount).map((p, idx) => {
                  const mgrInputId = `photo-mgr-input-${p.id}`;
                  return (
                    <div
                      key={p.id}
                      className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 flex flex-col justify-between gap-3 shadow-2xs relative"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-xs text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
                            <Camera className="w-3.5 h-3.5" />
                            <span>Foto #{idx + 1}: {p.category}</span>
                          </span>
                          {p.isCustom ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                              Foto Kustom Unggahan
                            </span>
                          ) : (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                              Ilustrasi Falak Resmi
                            </span>
                          )}
                        </div>

                        {/* Preview Box with Direct Click-to-Upload */}
                        <div
                          onClick={() => {
                            const input = document.getElementById(mgrInputId) as HTMLInputElement | null;
                            input?.click();
                          }}
                          className="relative rounded-lg overflow-hidden border border-slate-300 dark:border-slate-600 bg-black aspect-video flex items-center justify-center cursor-pointer group block"
                          title="Klik untuk memilih foto baru dari galeri atau kamera"
                        >
                          <img
                            src={p.imageUrl}
                            alt={p.title}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-emerald-950/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1 p-2 text-center">
                            <Upload className="w-6 h-6 text-emerald-300" />
                            <span className="text-xs font-bold">Pilih Gambar / Ambil Foto</span>
                          </div>
                        </div>

                        {/* Shared Hidden File Input */}
                        <input
                          id={mgrInputId}
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handlePhotoUpload(p.id, file);
                            e.target.value = '';
                          }}
                        />

                        {/* Upload & Reset Buttons */}
                        <div className="mt-2.5 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const input = document.getElementById(mgrInputId) as HTMLInputElement | null;
                              input?.click();
                            }}
                            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white text-xs font-bold cursor-pointer transition-colors shadow-2xs select-none"
                            title="Unggah atau ganti foto dokumentasi"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Unggah / Ganti Foto #{idx + 1}</span>
                          </button>

                          {p.isCustom && (
                            <button
                              type="button"
                              onClick={() => handleResetPhoto(p.id)}
                              className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-700 hover:bg-rose-50 hover:text-rose-700 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-600 text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors"
                              title="Kembalikan ke gambar ilustrasi falak bawaan"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Reset</span>
                            </button>
                          )}
                        </div>

                        {/* Edit fields */}
                        <div className="space-y-1.5 mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                          <div>
                            <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-0.5">
                              Judul Foto:
                            </label>
                            <input
                              type="text"
                              value={p.title}
                              onChange={(e) => handleUpdatePhoto(p.id, 'title', e.target.value)}
                              className="w-full p-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-1 focus:ring-emerald-500"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-0.5">
                              Keterangan:
                            </label>
                            <textarea
                              rows={2}
                              value={p.caption}
                              onChange={(e) => handleUpdatePhoto(p.id, 'caption', e.target.value)}
                              className="w-full p-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-1 focus:ring-emerald-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Foto akan langsung terpasang pada Lembar Lampiran Halaman 2 F4.
              </span>
              <button
                type="button"
                onClick={() => setIsPhotoManagerOpen(false)}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow-xs cursor-pointer transition-colors"
              >
                Selesai &amp; Tampilkan di Dokumen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Direct Print Dialog for Iframe and Standalone Printing */}
      <DirectPrintDialog
        isOpen={isPrintDialogOpen}
        onClose={() => setIsPrintDialogOpen(false)}
        documentTitle="Sertifikat Kalibrasi Arah Kiblat & Lampiran Foto Saf"
        documentSubtitle="Kementerian Agama RI • KUA Kecamatan Gerung (Format F4 / Folio)"
        onTriggerBrowserPrint={() => {
          try {
            window.print();
          } catch (e) {
            console.warn(e);
          }
        }}
        onDownloadPdf={handleSavePdf}
        isSavingPdf={isSavingPdf}
        printQueryParam="qibla"
        paperSize="F4 / Folio (215 × 330 mm)"
      />
    </div>
  );
};
