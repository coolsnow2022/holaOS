import { MessageSquareText, Sparkles, Workflow } from "lucide-react";

export type LeftRailItem = "space" | "automations" | "skills";

interface LeftNavigationRailProps {
  activeItem: LeftRailItem;
  onSelectItem: (item: LeftRailItem) => void;
}

const PRIMARY_ITEMS: Array<{ id: LeftRailItem; label: string; icon: React.ReactNode }> = [
  { id: "space", label: "Space", icon: <MessageSquareText size={14} /> },
  { id: "automations", label: "Automations", icon: <Workflow size={14} /> },
  { id: "skills", label: "Skills", icon: <Sparkles size={14} /> }
];

export function LeftNavigationRail({ activeItem, onSelectItem }: LeftNavigationRailProps) {
  const tooltipClassName =
    "pointer-events-none absolute left-[calc(100%+10px)] top-1/2 z-30 -translate-y-1/2 whitespace-nowrap rounded-[12px] border border-panel-border/70 bg-[rgb(var(--color-panel-bg))] px-2.5 py-1.5 text-[11px] font-medium text-text-main shadow-[0_10px_26px_rgba(25,33,53,0.12)] opacity-0 transition duration-150 group-hover:opacity-100 group-focus-visible:opacity-100";

  return (
    <aside
      className="theme-shell soft-vignette neon-border relative hidden h-full min-h-0 min-w-[60px] max-w-[60px] flex-col overflow-visible rounded-[var(--theme-radius-card)] px-2 py-3 shadow-card lg:flex"
    >
      <nav className="grid justify-items-center gap-1">
        {PRIMARY_ITEMS.map((item) => {
          const isActive = item.id === activeItem;
          return (
            <div key={item.id} className="group relative">
              <button
                type="button"
                aria-label={item.label}
                onClick={() => onSelectItem(item.id)}
                className={`flex w-10 items-center justify-center rounded-[14px] py-2.5 text-left text-[12px] transition-all duration-200 ${
                  isActive
                    ? "border border-neon-green/35 bg-neon-green/10 text-text-main"
                    : "border border-transparent text-text-muted hover:border-panel-border/40 hover:bg-[var(--theme-hover-bg)] hover:text-text-main"
                }`}
              >
                <span className={isActive ? "text-neon-green" : "text-text-dim/80"}>{item.icon}</span>
              </button>
              <div className={tooltipClassName}>{item.label}</div>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
