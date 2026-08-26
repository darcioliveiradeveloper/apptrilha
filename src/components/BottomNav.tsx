import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { buzz } from "../lib";
import { IconHome, IconList, IconTrophy, IconTarget, IconFoot } from "./Icons";

export type View = "home" | "history" | "track" | "badges" | "goals";

type TabIcon = (p: { className?: string }) => ReactNode;

const LEFT: { id: View; label: string; Icon: TabIcon }[] = [
  { id: "home", label: "Início", Icon: IconHome },
  { id: "history", label: "Diário", Icon: IconList },
];
const RIGHT: { id: View; label: string; Icon: TabIcon }[] = [
  { id: "badges", label: "Medalhas", Icon: IconTrophy },
  { id: "goals", label: "Metas", Icon: IconTarget },
];

export default function BottomNav({ view, onChange }: { view: View; onChange: (v: View) => void }) {
  const tab = ({ id, label, Icon }: { id: View; label: string; Icon: TabIcon }) => {
    const active = view === id;
    return (
      <button
        key={id}
        onClick={() => {
          buzz(8);
          onChange(id);
        }}
        className={`relative flex flex-1 flex-col items-center gap-0.5 py-2 ${active ? "text-pine-800" : "text-inksoft/80 hover:text-ink"}`}
        aria-label={label}
      >
        <Icon className={`h-[22px] w-[22px] transition-transform ${active ? "-translate-y-0.5" : ""}`} />
        <span className={`text-[10px] font-extrabold uppercase tracking-wide ${active ? "" : "opacity-70"}`}>{label}</span>
        {active && (
          <motion.span
            layoutId="nav-dot"
            className="absolute -top-0.5 h-1 w-6 rounded-full bg-ember-500"
            transition={{ type: "spring", damping: 26, stiffness: 400 }}
          />
        )}
      </button>
    );
  };

  return (
    <nav className="sticky bottom-0 z-30">
      <div className="border-t border-line bg-card/90 px-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] pt-1.5 backdrop-blur-md">
        <div className="flex items-end">
          {LEFT.map(tab)}
          <div className="relative flex-1">
            <button
              onClick={() => {
                buzz(14);
                onChange("track");
              }}
              aria-label="Caminhar"
              className={`press absolute -top-8 left-1/2 grid h-16 w-16 -translate-x-1/2 place-items-center rounded-full shadow-[0_16px_32px_-10px_rgba(7,31,21,0.55)] ring-4 ring-paper transition-colors ${
                view === "track" ? "bg-ember-500 text-card" : "bg-pine-900 text-sun-400"
              }`}
            >
              <IconFoot className="h-8 w-8" />
              {view === "track" && <span className="absolute inset-0 animate-breathe rounded-full bg-ember-500/30" />}
            </button>
            <span className="pointer-events-none block pt-1 text-center text-[10px] font-extrabold uppercase tracking-wide opacity-0">·</span>
          </div>
          {RIGHT.map(tab)}
        </div>
      </div>
    </nav>
  );
}
