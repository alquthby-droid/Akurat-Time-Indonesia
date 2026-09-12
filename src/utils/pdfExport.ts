import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';

export type PaperFormat = 'f4' | 'a4';

export interface ExportPdfOptions {
  fileName?: string;
  paperFormat?: PaperFormat;
  onStart?: () => void;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

/**
 * Exports an HTML element or array of elements as a multi-page high-quality PDF file (default: F4 / Folio 215mm x 330mm) and triggers automatic download.
 * Uses html-to-image which natively supports modern CSS features, avoiding cross-origin font/cssRules errors.
 */
export async function exportElementToPdf(
  target: HTMLElement | HTMLElement[],
  options: ExportPdfOptions = {}
): Promise<boolean> {
  const {
    fileName = 'Dokumen_Resmi_Kemenag.pdf',
    paperFormat = 'f4',
    onStart,
    onSuccess,
    onError,
  } = options;

  const elements = Array.isArray(target) ? target.filter(Boolean) : [target];
  if (elements.length === 0) return false;

  try {
    if (onStart) onStart();

    // Paper dimensions in millimeters:
    // F4 / Folio (Standar HVS Folio di Indonesia): 215 mm x 330 mm (21.5 cm x 33.0 cm)
    // A4 (ISO 216): 210 mm x 297 mm
    const isF4 = paperFormat === 'f4';
    const pdfWidth = isF4 ? 215 : 210;
    const pdfHeight = isF4 ? 330 : 297;

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: isF4 ? [215, 330] : 'a4',
      compress: true,
    });

    const margin = 8; // 8mm safe margin on all sides for printing
    const usableWidth = pdfWidth - margin * 2;
    const usableHeight = pdfHeight - margin * 2;

    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      if (i > 0) {
        pdf.addPage(isF4 ? [215, 330] : 'a4', 'portrait');
      }

      // Measure element exact full bounds including scrollable overflow, padding, and outer border strokes
      const rect = element.getBoundingClientRect();
      const exactWidth = Math.ceil(Math.max(element.scrollWidth, element.offsetWidth, rect.width));
      // Add +10px vertical buffer so bottom border-double strokes and bottom padding are captured completely
      const exactHeight = Math.ceil(Math.max(element.scrollHeight, element.offsetHeight, rect.height)) + 10;

      // Render HTML element to high-res PNG data URL using native browser SVG/canvas engine
      const imgDataUrl = await toPng(element, {
        quality: 0.98,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        cacheBust: true,
        skipFonts: true,
        fontEmbedCSS: '',
        width: exactWidth,
        height: exactHeight,
        canvasWidth: exactWidth,
        canvasHeight: exactHeight,
        filter: (node: Node) => {
          // Exclude elements with 'no-print' or buttons from the rendered output
          if (node instanceof HTMLElement && (node.classList.contains('no-print') || node.getAttribute('data-no-print') === 'true')) {
            return false;
          }
          return true;
        },
      });

      // Create an image element to read the rendered pixel dimensions
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = (e) => reject(e);
        img.src = imgDataUrl;
      });

      const imgWidth = img.naturalWidth || img.width;
      const imgHeight = img.naturalHeight || img.height;

      // Uniform proportional fit: guarantees complete visibility of all 4 borders with safety margins
      const scale = Math.min(usableWidth / imgWidth, usableHeight / imgHeight);
      const fitW = imgWidth * scale;
      const fitH = imgHeight * scale;
      const posX = (pdfWidth - fitW) / 2;
      const posY = (pdfHeight - fitH) / 2;

      pdf.addImage(imgDataUrl, 'PNG', posX, posY, fitW, fitH, undefined, 'FAST');
    }

    // Trigger direct download of the PDF file
    const safeFileName = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
    pdf.save(safeFileName);

    if (onSuccess) onSuccess();
    return true;
  } catch (err) {
    console.error('PDF export failed with html-to-image, attempting iframe fallback:', err);

    // Fallback: Create printable hidden iframe to trigger browser print
    try {
      const printIframe = document.createElement('iframe');
      printIframe.style.position = 'fixed';
      printIframe.style.right = '0';
      printIframe.style.bottom = '0';
      printIframe.style.width = '0';
      printIframe.style.height = '0';
      printIframe.style.border = '0';
      document.body.appendChild(printIframe);

      const iframeDoc = printIframe.contentDocument || printIframe.contentWindow?.document;
      if (iframeDoc) {
        const pageSizeRule = paperFormat === 'f4' ? '215mm 330mm' : 'A4 portrait';
        const innerContent = elements
          .map((el, idx) => `
            <div class="print-page" style="${idx > 0 ? 'page-break-before: always; break-before: page; margin-top: 20px;' : ''}">
              ${el.outerHTML}
            </div>
          `)
          .join('');

        iframeDoc.open();
        iframeDoc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${fileName.replace('.pdf', '')}</title>
              <style>
                @page { size: ${pageSizeRule}; margin: 8mm; }
                body { font-family: 'Times New Roman', serif; margin: 0; padding: 0; background: #fff; color: #000; }
                * { box-sizing: border-box; }
                .no-print { display: none !important; }
              </style>
            </head>
            <body>
              ${innerContent}
              <script>
                window.onload = function() {
                  window.focus();
                  window.print();
                };
              </script>
            </body>
          </html>
        `);
        iframeDoc.close();

        // Remove iframe after printing
        setTimeout(() => {
          if (document.body.contains(printIframe)) {
            document.body.removeChild(printIframe);
          }
        }, 3000);
      }
    } catch {
      // Fallback to window.print if iframe is restricted
      try {
        window.print();
      } catch {
        // silent
      }
    }

    if (onError) onError(err);
    return false;
  }
}

/**
 * Backward compatibility alias for exportElementToPdf (defaulting to F4/Folio).
 */
export const exportElementToA4Pdf = exportElementToPdf;
export const exportElementToF4Pdf = exportElementToPdf;
