import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type PageTone = "paper" | "navy" | "red";

const toneShell: Record<PageTone, string> = {
  paper: "bg-paper text-ink",
  navy: "bg-navy text-navy-foreground",
  red: "bg-brand-red text-brand-red-foreground",
};

/**
 * Every spread uses the same shell: 64px outer margin, a 12-column grid,
 * a running header and a running footer. No page re-invents its chrome.
 */
export function PageShell({
  tone = "paper",
  index,
  total,
  section,
  children,
  className,
  bleed,
}: {
  tone?: PageTone;
  index: number;
  total: number;
  section: string;
  children: ReactNode;
  className?: string;
  bleed?: ReactNode;
}) {
  const isDark = tone !== "paper";

  return (
    <div className={cn("page-canvas", toneShell[tone])}>
      {bleed}
      <div className="relative flex h-full flex-col px-16 py-14">
        <header className="flex items-center justify-between">
          <Wordmark tone={tone} />
          <span className={cn("page-kicker", isDark ? "opacity-70" : "text-ink-muted")}>
            {section}
          </span>
        </header>

        <main className={cn("flex min-h-0 flex-1 flex-col justify-center py-12", className)}>
          {children}
        </main>

        <footer className="flex items-end justify-between pt-8">
          <span className={cn("page-small", isDark ? "opacity-60" : "text-ink-muted")}>
            Commercial Solar
          </span>
          <span
            className={cn(
              "page-kicker tabular-nums",
              tone === "paper" ? "text-brand-red" : "opacity-80",
            )}
          >
            {String(index).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </footer>
      </div>
    </div>
  );
}

export function Wordmark({ tone = "paper" }: { tone?: PageTone }) {
  return (
    <span className="flex items-center gap-2.5">
      <span
        className={cn(
          "block h-5 w-5 rounded-[5px]",
          tone === "red" ? "bg-brand-red-foreground" : "bg-brand-red",
        )}
      />
      <span className={cn("page-kicker", tone === "paper" ? "text-navy" : "text-current")}>
        Zenith Energy
      </span>
    </span>
  );
}

/** Red hairline used to open a title block. */
export function Rule({ tone = "paper" }: { tone?: PageTone }) {
  return (
    <span
      className={cn(
        "block h-1 w-16 rounded-full",
        tone === "paper" ? "bg-brand-red" : "bg-current opacity-80",
      )}
    />
  );
}

export function BulletList({
  items,
  tone = "paper",
  className,
}: {
  items: string[];
  tone?: PageTone;
  className?: string;
}) {
  return (
    <ul className={cn("space-y-4", className)}>
      {items.map((item) => (
        <li key={item} className="flex gap-4">
          <span
            className={cn(
              "mt-2.5 block h-2 w-2 flex-none rounded-full",
              tone === "paper" ? "bg-brand-red" : "bg-current opacity-70",
            )}
          />
          <span className={cn("page-body", tone === "paper" && "text-ink")}>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function Card({
  title,
  items,
  tone = "paper",
}: {
  title: string;
  items: string[];
  tone?: PageTone;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl p-8",
        tone === "paper"
          ? "border border-rule bg-paper shadow-card"
          : "bg-navy-foreground/10 backdrop-blur-[1px]",
      )}
    >
      <h3 className={cn("page-h3", tone === "paper" ? "text-navy" : "text-current")}>{title}</h3>
      <span
        className={cn(
          "mt-4 mb-6 block h-px w-full",
          tone === "paper" ? "bg-rule" : "bg-current opacity-25",
        )}
      />
      <BulletList items={items} tone={tone} />
    </div>
  );
}

/**
 * Marks a spread whose copy is not present in the supplied source document.
 * The layout is final; only the words are pending.
 */
export function ContentPending({ note, tone = "paper" }: { note: string; tone?: PageTone }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-dashed p-8",
        tone === "paper" ? "border-brand-red/45 bg-brand-red/5" : "border-current/40 bg-current/5",
      )}
    >
      <span className={cn("page-kicker", tone === "paper" ? "text-brand-red" : "text-current")}>
        Awaiting source copy
      </span>
      <p className={cn("page-body mt-4", tone === "paper" ? "text-ink-muted" : "opacity-80")}>
        {note}
      </p>
    </div>
  );
}
