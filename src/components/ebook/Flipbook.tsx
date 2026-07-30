import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, LayoutGrid, Maximize2, Printer, X } from "lucide-react";
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
  const [isPinching, setIsPinching] = useState(false);
  const [isPreloaded, setIsPreloaded] = useState(false);

  const frameRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{
    x: number;
    y: number;
    dist: number | null;
    zoomStart: number;
  } | null>(null);

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

  const go = useCallback((to: number, direction: "next" | "prev") => {
    setDir(direction);
    setCurrent((c) => {
      const next = Math.min(PAGES.length - 1, Math.max(0, to));
      return next === c ? c : next;
    });
  }, []);

  const next = useCallback(() => go(current + 1, "next"), [current, go]);
  const prev = useCallback(() => go(current - 1, "prev"), [current, go]);

  const resetZoom = useCallback(() => {
    setZoomFactor(1);
  }, []);

  // Touch handlers for swipe slide & smooth hand touch pinch zoom in / zoom out
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      setIsPinching(false);
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        dist: null,
        zoomStart: zoomFactor,
      };
    } else if (e.touches.length === 2) {
      setIsPinching(true);
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      touchStartRef.current = {
        x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
        dist,
        zoomStart: zoomFactor,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStartRef.current) return;

    if (e.touches.length === 2 && touchStartRef.current.dist !== null) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const currentDist = Math.hypot(dx, dy);
      if (touchStartRef.current.dist > 0) {
        const scaleChange = currentDist / touchStartRef.current.dist;
        const newZoom = Math.min(2.5, Math.max(0.8, touchStartRef.current.zoomStart * scaleChange));
        setZoomFactor(newZoom);
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStartRef.current) return;
    const { x, y, dist } = touchStartRef.current;
    touchStartRef.current = null;
    setIsPinching(false);

    if (dist === null && e.changedTouches.length > 0) {
      const deltaX = e.changedTouches[0].clientX - x;
      const deltaY = e.changedTouches[0].clientY - y;
      if (Math.abs(deltaX) > 40 && Math.abs(deltaY) < 80) {
        if (deltaX < 0) {
          next();
        } else {
          prev();
        }
      }
    }
  };

  useLayoutEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const measure = () => {
      const cs = getComputedStyle(el);
      const width = el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const height = el.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
      if (!width || !height) return;
      const fitBoth = Math.min(width / PAGE_W, height / PAGE_H);
      setFitScale(fitBoth);
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
      if (e.key === "0") resetZoom();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, resetZoom]);

  const effectiveScale = fitScale * zoomFactor;
  const page = PAGES[current];

  return (
    <div className="flex h-screen flex-col bg-background select-none">
      <header className="flex flex-none items-center justify-between border-b border-rule bg-paper px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="block h-4 w-4 flex-none rounded-[4px] bg-brand-red" />
          <span className="page-kicker text-navy">Zenith Energy</span>
          <span className="hidden h-4 w-px bg-rule sm:block" />
          <span className="hidden text-sm text-ink-muted sm:block">Commercial Solar eBook</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
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
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="absolute inset-0 flex items-center justify-center overflow-auto overscroll-contain p-2 sm:p-6"
          >
            <div
              style={{ width: PAGE_W * effectiveScale, height: PAGE_H * effectiveScale }}
              className={cn(
                "relative mx-auto flex-none overflow-hidden rounded-lg shadow-page",
                !isPinching && "transition-[width,height] duration-200 ease-out",
              )}
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
        </div>
      )}

      {/* Footer Navigation Bar with Left/Right icons brought to bottom middle */}
      <footer className="flex flex-none flex-col items-center justify-between gap-1.5 border-t border-rule bg-paper px-3 py-2 sm:flex-row sm:px-6 sm:py-3.5">
        <div className="hidden min-w-0 flex-1 items-center gap-2 sm:flex">
          <span className="truncate text-xs font-medium text-ink-muted sm:text-sm">
            {page.title}
          </span>
        </div>

        {/* Bottom Middle Controls: Left Arrow, Page Counter, Right Arrow + Progress Bar */}
        <div className="flex w-full flex-col items-center justify-center gap-1.5 sm:w-auto">
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={prev}
              disabled={current === 0}
              className="flex h-9 w-9 min-h-[36px] min-w-[36px] items-center justify-center rounded-full border border-rule bg-paper text-navy shadow-sm transition-all hover:bg-secondary active:scale-95 disabled:pointer-events-none disabled:opacity-30 sm:h-10 sm:w-10"
              aria-label="Previous page"
              title="Previous Page"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <span className="text-sm font-bold tabular-nums text-navy px-1">
              {String(current + 1).padStart(2, "0")} / {PAGES.length}
            </span>

            <button
              type="button"
              onClick={next}
              disabled={current === PAGES.length - 1}
              className="flex h-9 w-9 min-h-[36px] min-w-[36px] items-center justify-center rounded-full border border-rule bg-paper text-navy shadow-sm transition-all hover:bg-secondary active:scale-95 disabled:pointer-events-none disabled:opacity-30 sm:h-10 sm:w-10"
              aria-label="Next page"
              title="Next Page"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="flex w-full max-w-[260px] sm:max-w-xs items-center gap-1">
            {PAGES.map((p, i) => (
              <button
                key={p.index}
                type="button"
                aria-label={`Go to page ${p.index}: ${p.title}`}
                onClick={() => go(i, i > current ? "next" : "prev")}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-all",
                  i === current ? "bg-brand-red" : "bg-rule hover:bg-navy/30",
                )}
              />
            ))}
          </div>
        </div>

        <div className="hidden min-w-0 flex-1 items-center justify-end gap-2 sm:flex">
          {zoomFactor !== 1 && (
            <button
              type="button"
              onClick={resetZoom}
              className="flex items-center gap-1.5 rounded-full border border-rule bg-paper px-3 py-1.5 text-xs font-medium text-navy shadow-sm transition-all hover:bg-secondary"
            >
              <Maximize2 className="h-3.5 w-3.5" />
              <span>Fit Page</span>
            </button>
          )}
        </div>
      </footer>

      {/* Offscreen A4 container used for browser vector print generation */}
      <div
        id="print-container"
        className="pointer-events-none fixed -left-[9999px] top-0 opacity-100"
        aria-hidden="true"
      >
        {PAGES.map((p) => (
          <div key={p.index} id={`pdf-page-${p.index}`} className="print-page overflow-hidden">
            <p.render />
          </div>
        ))}
      </div>
    </div>
  );
}
