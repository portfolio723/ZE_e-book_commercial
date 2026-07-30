import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  LayoutGrid,
  Loader2,
  Maximize2,
  Printer,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { PAGES, PAGE_ASSETS } from "./pages";

/* A4 portrait at 960px width (960 x 1358 ≈ 1 : √2). */
const PAGE_W = 960;
const PAGE_H = 1358;

export function Flipbook() {
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState<"next" | "prev">("next");
  const [grid, setGrid] = useState(false);
  const [fitScale, setFitScale] = useState(0.5);
  const [zoomFactor, setZoomFactor] = useState(1);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [isPreloaded, setIsPreloaded] = useState(false);

  const frameRef = useRef<HTMLDivElement>(null);
  const touchX = useRef<number | null>(null);

  // Preload all page images and assets on mount
  useEffect(() => {
    let loadedCount = 0;
    PAGE_ASSETS.forEach((src) => {
      const img = new Image();
      img.onload = img.onerror = () => {
        loadedCount++;
        if (loadedCount >= PAGE_ASSETS.length) {
          setIsPreloaded(true);
        }
      };
      img.src = src;
    });
  }, []);

  const triggerBrowserPrint = () => {
    toast.info("Opening browser print dialog (Save as A4 Vector PDF)...");
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const downloadPDF = async () => {
    if (isExporting) return;
    setIsExporting(true);
    setExportProgress(1);
    toast.info("Preparing print-ready A4 PDF...");

    try {
      const { default: jsPDF } = await import("jspdf");
      const { default: html2canvas } = await import("html2canvas");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      for (let i = 0; i < PAGES.length; i++) {
        const pageIndex = i + 1;
        setExportProgress(pageIndex);

        const pageEl = document.getElementById(`pdf-page-${pageIndex}`);
        if (!pageEl) continue;

        const canvas = await html2canvas(pageEl, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false,
          backgroundColor: "#ffffff",
        });

        const imgData = canvas.toDataURL("image/jpeg", 0.95);
        if (i > 0) {
          pdf.addPage("a4", "portrait");
        }
        pdf.addImage(imgData, "JPEG", 0, 0, 210, 297);
      }

      pdf.save("Zenith_Energy_Commercial_Solar_eBook.pdf");
      toast.success("eBook PDF downloaded successfully!");
    } catch (err) {
      console.error("PDF generation failed:", err);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const go = useCallback((to: number, direction: "next" | "prev") => {
    setDir(direction);
    setCurrent((c) => {
      const next = Math.min(PAGES.length - 1, Math.max(0, to));
      return next === c ? c : next;
    });
  }, []);

  const next = useCallback(() => go(current + 1, "next"), [current, go]);
  const prev = useCallback(() => go(current - 1, "prev"), [current, go]);

  const zoomIn = useCallback(() => {
    setZoomFactor((z) => Math.min(2.5, Math.round((z + 0.25) * 100) / 100));
  }, []);

  const zoomOut = useCallback(() => {
    setZoomFactor((z) => Math.max(0.5, Math.round((z - 0.25) * 100) / 100));
  }, []);

  const resetZoom = useCallback(() => {
    setZoomFactor(1);
  }, []);

  useLayoutEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const measure = () => {
      const cs = getComputedStyle(el);
      const width = el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const height = el.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
      if (!width || !height) return;
      // Desktop/tablet: fit the whole A4 page, centered.
      // Narrow screens: fit the width and let the page scroll vertically.
      const fitBoth = Math.min(width / PAGE_W, height / PAGE_H);
      const fitWidth = width / PAGE_W;
      setFitScale(width < 700 ? fitWidth : fitBoth);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [grid]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key.toLowerCase() === "g") setGrid((g) => !g);
      if (e.key === "Escape") setGrid(false);
      if (e.key === "+" || e.key === "=") zoomIn();
      if (e.key === "-") zoomOut();
      if (e.key === "0") resetZoom();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, zoomIn, zoomOut, resetZoom]);

  const effectiveScale = fitScale * zoomFactor;
  const page = PAGES[current];

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="flex flex-none items-center justify-between border-b border-rule bg-paper px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="block h-4 w-4 flex-none rounded-[4px] bg-brand-red" />
          <span className="page-kicker text-navy">Zenith Energy</span>
          <span className="hidden h-4 w-px bg-rule sm:block" />
          <span className="hidden text-sm text-ink-muted sm:block">Commercial Solar eBook</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Zoom Controls Bar */}
          {!grid && (
            <div className="flex items-center rounded-full border border-rule bg-secondary/50 p-1">
              <button
                type="button"
                onClick={zoomOut}
                disabled={zoomFactor <= 0.5}
                className="flex h-8 w-8 items-center justify-center rounded-full text-navy transition-colors hover:bg-paper disabled:opacity-40"
                aria-label="Zoom Out"
                title="Zoom Out (-)"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={resetZoom}
                className="px-2 text-xs font-semibold tabular-nums text-navy transition-colors hover:text-brand-red"
                aria-label="Reset Zoom"
                title="Reset Zoom (0)"
              >
                {Math.round(zoomFactor * 100)}%
              </button>
              <button
                type="button"
                onClick={zoomIn}
                disabled={zoomFactor >= 2.5}
                className="flex h-8 w-8 items-center justify-center rounded-full text-navy transition-colors hover:bg-paper disabled:opacity-40"
                aria-label="Zoom In"
                title="Zoom In (+)"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={triggerBrowserPrint}
            className="flex min-h-[40px] items-center gap-2 rounded-full border border-rule bg-paper px-3 py-2 text-xs font-medium text-navy shadow-sm transition-all hover:bg-secondary sm:px-4 sm:text-sm"
            aria-label="Print or save as 300DPI vector PDF"
            title="Print or save as 300DPI Vector PDF"
          >
            <Printer className="h-4 w-4" />
            <span className="hidden min-[540px]:inline">Print Vector PDF</span>
            <span className="min-[540px]:hidden">Print</span>
          </button>

          <button
            type="button"
            onClick={downloadPDF}
            disabled={isExporting}
            className="flex min-h-[40px] items-center gap-2 rounded-full bg-navy px-3 py-2 text-xs font-medium text-white shadow-sm transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:px-4 sm:text-sm"
            aria-label="Download flipbook as print-ready A4 PDF"
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            <span className="hidden min-[480px]:inline">
              {isExporting ? `Generating (${exportProgress}/${PAGES.length})...` : "Download PDF"}
            </span>
            <span className="min-[480px]:hidden">Download</span>
          </button>

          <button
            type="button"
            onClick={() => setGrid((g) => !g)}
            className="flex min-h-[40px] items-center gap-2 rounded-full border border-rule px-3 py-2 text-xs text-navy transition-colors hover:bg-secondary sm:px-4 sm:text-sm"
            aria-label={grid ? "Close page overview" : "Open page overview"}
          >
            {grid ? <X className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
            <span className="hidden sm:inline">{grid ? "Close" : "All pages"}</span>
          </button>
        </div>
      </header>

      {grid ? (
        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
            {PAGES.map((p, i) => (
              <button
                key={p.index}
                type="button"
                onClick={() => {
                  go(i, i > current ? "next" : "prev");
                  setGrid(false);
                }}
                className={cn(
                  "group text-left",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                )}
              >
                <div
                  className={cn(
                    "relative overflow-hidden rounded-lg border transition-shadow",
                    i === current ? "border-brand-red shadow-card" : "border-rule",
                  )}
                  style={{ aspectRatio: `${PAGE_W} / ${PAGE_H}` }}
                >
                  <div
                    className="absolute left-0 top-0 origin-top-left"
                    style={{ transform: "scale(0.24)", width: PAGE_W, height: PAGE_H }}
                  >
                    <p.render />
                  </div>
                </div>
                <p className="mt-2 truncate text-xs text-ink-muted">
                  {String(p.index).padStart(2, "0")} · {p.title}
                </p>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="relative min-h-0 flex-1">
          <div
            ref={frameRef}
            onTouchStart={(e) => {
              if (zoomFactor === 1) {
                touchX.current = e.touches[0].clientX;
              }
            }}
            onTouchEnd={(e) => {
              if (zoomFactor !== 1) return;
              const start = touchX.current;
              touchX.current = null;
              if (start === null) return;
              const delta = e.changedTouches[0].clientX - start;
              if (delta < -48) next();
              if (delta > 48) prev();
            }}
            className="absolute inset-0 flex items-start justify-center overflow-auto overscroll-contain p-2 sm:items-center sm:p-6"
          >
            <div
              style={{ width: PAGE_W * effectiveScale, height: PAGE_H * effectiveScale }}
              className="relative mx-auto flex-none overflow-hidden rounded-lg shadow-page transition-[width,height] duration-300 ease-out"
            >
              <div
                className="absolute left-0 top-0 origin-top-left"
                style={{ transform: `scale(${effectiveScale})`, width: PAGE_W, height: PAGE_H }}
              >
                <div
                  key={current}
                  className={cn("h-full w-full", dir === "next" ? "turn-next" : "turn-prev")}
                >
                  <page.render />
                </div>
              </div>
            </div>
          </div>

          {/* Side Floating Navigation Buttons */}
          <NavButton side="left" onClick={prev} disabled={current === 0} />
          <NavButton side="right" onClick={next} disabled={current === PAGES.length - 1} />
        </div>
      )}

      {/* Footer Navigation Bar */}
      <footer className="grid flex-none grid-cols-12 items-center gap-2 border-t border-rule bg-paper px-4 py-3 sm:px-6 sm:py-4">
        {/* Left Section: Mobile Direct Prev/Next + Page Counter */}
        <div className="col-span-4 flex items-center gap-2 sm:col-span-3 sm:gap-3">
          <div className="flex items-center gap-1 sm:hidden">
            <button
              type="button"
              onClick={prev}
              disabled={current === 0}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-rule bg-paper text-navy shadow-sm transition-colors hover:bg-secondary disabled:opacity-30"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={next}
              disabled={current === PAGES.length - 1}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-rule bg-paper text-navy shadow-sm transition-colors hover:bg-secondary disabled:opacity-30"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <span className="text-sm font-semibold tabular-nums text-navy">
            {String(current + 1).padStart(2, "0")} / {PAGES.length}
          </span>
        </div>

        {/* Center Section: Progress Bar (Center Aligned) */}
        <div className="col-span-4 flex items-center justify-center sm:col-span-6">
          <div className="flex w-full max-w-md items-center gap-1">
            {PAGES.map((p, i) => (
              <button
                key={p.index}
                type="button"
                aria-label={`Go to page ${p.index}: ${p.title}`}
                onClick={() => go(i, i > current ? "next" : "prev")}
                className={cn(
                  "h-2 flex-1 rounded-full transition-colors",
                  i === current ? "bg-brand-red" : "bg-rule hover:bg-navy/30",
                )}
              />
            ))}
          </div>
        </div>

        {/* Right Section: Page Title & Optional Fit Button */}
        <div className="col-span-4 flex items-center justify-end gap-2 sm:col-span-3">
          <span className="truncate text-xs text-ink-muted sm:text-sm">{page.title}</span>
          {zoomFactor !== 1 && (
            <button
              type="button"
              onClick={resetZoom}
              className="hidden items-center gap-1 rounded-lg border border-rule px-2.5 py-1 text-xs text-navy hover:bg-secondary sm:flex"
            >
              <Maximize2 className="h-3.5 w-3.5" />
              <span>Fit</span>
            </button>
          )}
        </div>
      </footer>

      {/* Offscreen A4 container used for both browser vector print and client-side PDF generation */}
      <div
        id="print-container"
        className="pointer-events-none fixed -left-[9999px] top-0 opacity-100"
        aria-hidden="true"
      >
        {PAGES.map((p) => (
          <div
            key={p.index}
            id={`pdf-page-${p.index}`}
            className="print-page page-canvas overflow-hidden"
          >
            <p.render />
          </div>
        ))}
      </div>
    </div>
  );
}

function NavButton({
  side,
  onClick,
  disabled,
}: {
  side: "left" | "right";
  onClick: () => void;
  disabled: boolean;
}) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={side === "left" ? "Previous page" : "Next page"}
      className={cn(
        "absolute top-1/2 z-10 flex min-h-[44px] min-w-[44px] h-11 w-11 sm:h-12 sm:w-12 -translate-y-1/2 items-center justify-center rounded-full border border-rule bg-paper text-navy shadow-card transition-all active:scale-95",
        side === "left" ? "left-2 sm:left-6" : "right-2 sm:right-6",
        disabled ? "pointer-events-none opacity-0" : "hover:bg-secondary",
      )}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}
