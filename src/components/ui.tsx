import { motion, AnimatePresence } from "framer-motion";
import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { buzz } from "../lib";
import { IconCheck, IconX, IconFoot } from "./Icons";

/* ---------- anel de progresso ---------- */

export function ProgressRing({
  size = 148,
  stroke = 11,
  value,
  trackClass = "stroke-pine-800",
  barClass = "stroke-sun-400",
  children,
}: {
  size?: number;
  stroke?: number;
  value: number; // 0..1+
  trackClass?: string;
  barClass?: string;
  children?: ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(value, 1));
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} className={`fill-none ${trackClass}`} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          strokeLinecap="round"
          className={`fill-none ${barClass} transition-[stroke-dashoffset] duration-700 ease-out`}
          style={{ strokeDasharray: c, strokeDashoffset: c * (1 - v) }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
    </div>
  );
}

/* ---------- reveal on scroll ---------- */

export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ---------- folha inferior ---------- */

export function Sheet({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-40 bg-pine-950/55 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            key="sheet"
            className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-[430px]"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 340 }}
          >
            <div className="rounded-t-[1.8rem] border-t border-x border-line bg-card px-5 pb-[max(1.4rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-18px_50px_rgba(7,31,21,0.28)]">
              <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-line" />
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ---------- segmented control ---------- */

export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex rounded-full border border-line bg-paper p-1">
      {options.map((o) => {
        const active = o.id === value;
        return (
          <button
            key={o.id}
            onClick={() => {
              buzz(8);
              onChange(o.id);
            }}
            className={`relative flex-1 rounded-full px-2 py-1.5 text-[13px] font-bold transition-colors ${
              active ? "text-pine-950" : "text-inksoft hover:text-ink"
            }`}
          >
            {active && (
              <motion.span
                layoutId="seg-pill"
                className="absolute inset-0 rounded-full bg-sun-300 shadow-sm"
                transition={{ type: "spring", damping: 28, stiffness: 420 }}
              />
            )}
            <span className="relative">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ---------- stepper numérico ---------- */

export function Stepper({
  value,
  onChange,
  step = 0.5,
  min = 0.5,
  max = 60,
  unit,
}: {
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
  max?: number;
  unit: string;
}) {
  const clamp = (v: number) => Math.round(Math.min(max, Math.max(min, v)) * 10) / 10;
  const btn =
    "press grid h-10 w-10 place-items-center rounded-full border border-line bg-paper text-xl font-black text-pine-700 disabled:opacity-30";
  return (
    <div className="flex items-center gap-3">
      <button className={btn} disabled={value <= min} onClick={() => { buzz(8); onChange(clamp(value - step)); }} aria-label="Diminuir">
        −
      </button>
      <div className="min-w-[92px] text-center">
        <span className="font-display text-2xl font-extrabold tnum">
          {value.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}
        </span>
        <span className="ml-1 text-sm font-bold text-inksoft">{unit}</span>
      </div>
      <button className={btn} disabled={value >= max} onClick={() => { buzz(8); onChange(clamp(value + step)); }} aria-label="Aumentar">
        +
      </button>
    </div>
  );
}

/* ---------- toasts ---------- */

export interface ToastMsg {
  id: number;
  kind: "ok" | "del";
  text: string;
}

export function Toasts({ items }: { items: ToastMsg[] }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-[max(1rem,env(safe-area-inset-top))] z-[60] mx-auto flex w-full max-w-[430px] flex-col items-center gap-2 px-6">
      <AnimatePresence>
        {items.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: -24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.95 }}
            transition={{ type: "spring", damping: 24, stiffness: 380 }}
            className={`flex w-full items-center gap-2.5 rounded-full px-4 py-2.5 text-sm font-bold shadow-lg ${
              t.kind === "ok" ? "bg-pine-900 text-pine-50" : "bg-ember-600 text-ember-100"
            }`}
          >
            <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full ${t.kind === "ok" ? "bg-sun-400 text-pine-950" : "bg-ember-100/20 text-ember-100"}`}>
              {t.kind === "ok" ? <IconCheck className="h-3 w-3" /> : <IconX className="h-3 w-3" />}
            </span>
            {t.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ---------- padrão topográfico ---------- */

export function TopoLines({ className, stroke = "currentColor" }: { className?: string; stroke?: string }) {
  return (
    <svg viewBox="0 0 400 300" className={className} fill="none" preserveAspectRatio="xMidYMid slice" aria-hidden>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <path
          key={i}
          stroke={stroke}
          strokeWidth="1"
          d={`M-20 ${60 + i * 42} C 60 ${18 + i * 40}, 130 ${104 + i * 38}, 210 ${58 + i * 42} S 360 ${20 + i * 44}, 430 ${70 + i * 40}`}
        />
      ))}
      <circle cx="330" cy="52" r="16" stroke={stroke} strokeWidth="1" />
      <circle cx="330" cy="52" r="30" stroke={stroke} strokeWidth="1" opacity=".6" />
      <circle cx="60" cy="252" r="20" stroke={stroke} strokeWidth="1" opacity=".7" />
    </svg>
  );
}

/* ---------- guarda de erros (evita tela em branco) ---------- */

export class ErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean; message: string; stack: string }
> {
  state = { failed: false, message: "", stack: "" };
  static getDerivedStateFromError(error: unknown) {
    const e = error instanceof Error ? error : new Error(String(error));
    return { failed: true, message: e.message || String(error), stack: e.stack || "" };
  }
  componentDidCatch(error: unknown, info: ErrorInfo) {
    console.error("Trilha encontrou um erro:", error, info);
  }
  render() {
    if (this.state.failed) {
      return (
        <div className="flex min-h-dvh items-center justify-center px-6 py-10">
          <div className="w-full max-w-[420px] rounded-[1.6rem] border border-line bg-card p-7 text-center shadow-xl">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-ember-100 text-ember-600">
              <IconFoot className="h-7 w-7" />
            </span>
            <h1 className="mt-4 font-display text-xl font-extrabold">O Trilha tropeçou</h1>
            <p className="mt-1.5 text-sm font-semibold text-inksoft">
              Aconteceu um erro inesperado ao carregar. Suas caminhadas salvas continuam intactas.
            </p>
            <div className="mt-4 rounded-xl border border-ember-300/60 bg-ember-100/60 p-3 text-left">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-ember-700">detalhe do erro</p>
              <p className="mt-1 break-words font-mono text-[12px] font-bold leading-snug text-ember-700">
                {this.state.message}
              </p>
              {this.state.stack && (
                <p className="mt-1.5 max-h-24 overflow-auto break-words font-mono text-[10px] leading-snug text-ember-700/80">
                  {this.state.stack.split("\n").slice(0, 4).join("\n")}
                </p>
              )}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="press mx-auto mt-5 rounded-full bg-pine-900 px-6 py-3 font-display text-base font-extrabold text-sun-300"
            >
              Recarregar app
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/* ---------- barra de progresso simples ---------- */

export function Bar({ value, className = "bg-sun-400", track = "bg-pine-100" }: { value: number; className?: string; track?: string }) {
  const v = Math.max(0, Math.min(value, 1));
  return (
    <div className={`h-2.5 w-full overflow-hidden rounded-full ${track}`}>
      <motion.div
        className={`h-full rounded-full ${className}`}
        initial={{ width: 0 }}
        animate={{ width: `${v * 100}%` }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}
