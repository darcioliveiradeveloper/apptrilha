#!/usr/bin/env bash
# =====================================================================
#  TRILHA — app de celular para registrar caminhadas
#  Script de exportação: recria o projeto COMPLETO no seu computador.
#
#  COMO USAR
#  1) Selecione TODO o conteúdo deste arquivo e copie
#  2) No seu computador, salve como: exportar-trilha.sh
#     (no Bloco de Notas: "Salvar como tipo: Todos os arquivos")
#  3) Abra o terminal (ou Git Bash no Windows) na pasta onde salvou
#  4) Rode:  bash exportar-trilha.sh
#  5) Depois:
#        cd trilha-app
#        npm install
#        npm run dev
#     e abra http://localhost:3000 no navegador
#
#  Pré-requisito: Node.js 18+ instalado (https://nodejs.org)
# =====================================================================
set -euo pipefail

RAIZ="trilha-app"

if [ -d "$RAIZ" ]; then
  echo "A pasta '$RAIZ' ja existe neste local."
  echo "Apague-a (ou rode o script em outra pasta) e tente de novo."
  exit 1
fi

mkdir -p "$RAIZ/src/components" "$RAIZ/src/views"
cd "$RAIZ"

# ---------------------------------------------------------------------
cat > package.json <<'FIM_package'
{
  "name": "trilha-app",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "canvas-confetti": "^1.9.3",
    "date-fns": "^2.30.0",
    "framer-motion": "^11.16.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.1.7",
    "@types/canvas-confetti": "^1.6.4",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.3.4",
    "tailwindcss": "^4.1.7",
    "typescript": "^5.7.0",
    "vite": "^6.3.5"
  }
}
FIM_package

# ---------------------------------------------------------------------
cat > .gitignore <<'FIM_gitignore'
node_modules
dist
.DS_Store
*.local
FIM_gitignore

# ---------------------------------------------------------------------
cat > README.md <<'FIM_readme'
# Trilha — diário de caminhadas

App de celular (web) para registrar caminhadas: cronômetro + GPS, histórico,
metas diárias/semanais e conquistas.

## Rodar localmente

    npm install
    npm run dev

Abra http://localhost:3000

## Publicar (grátis, com HTTPS — necessário para o GPS no celular)

    npm run build

Depois suba a pasta `dist/` no Netlify, Vercel ou Cloudflare Pages.

## Dados

As caminhadas ficam salvas no navegador (localStorage) do dispositivo.
FIM_readme

# ---------------------------------------------------------------------
cat > index.html <<'FIM_indexhtml'
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="theme-color" content="#0C2B1E" />
    <meta name="description" content="Trilha — registre suas caminhadas, acompanhe distância, ritmo e conquistas." />
    <meta name="mobile-web-app-capable" content="yes" />
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='12' fill='%230C2B1E'/%3E%3Cpath d='M9.2 5.4c1.5-.3 2.6 1 2.8 2.9.2 1.6-.4 2.9-1.8 3.2-1.4.3-2.5-.8-2.8-2.6-.3-1.7.3-3.2 1.8-3.5Zm.9 7.5c.9-.2 1.7.4 1.8 1.4l.2 1.6c.1.9-.5 1.7-1.4 1.9-.9.2-1.7-.4-1.8-1.3l-.2-1.7c-.1-.9.5-1.7 1.4-1.9Zm5-4.9c-1.5-.3-2.7 1-2.9 2.9-.2 1.6.4 2.9 1.8 3.2 1.4.3 2.5-.8 2.8-2.6.3-1.7-.3-3.2-1.7-3.5Zm-1 7.5c-.9-.2-1.7.4-1.8 1.4l-.2 1.6c-.1.9.5 1.7 1.4 1.9.9.2 1.7-.4 1.8-1.3l.2-1.7c.1-.9-.5-1.7-1.4-1.9Z' fill='%23FFC24B'/%3E%3C/svg%3E" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300..800&family=Nunito+Sans:ital,opsz,wght@0,6..12,400..900;1,6..12,400..700&display=swap"
      rel="stylesheet"
    />
    <title>Trilha — diário de caminhadas</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
FIM_indexhtml

# ---------------------------------------------------------------------
cat > tsconfig.json <<'FIM_tsconfig'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "moduleResolution": "bundler",
    "strict": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "isolatedModules": true,
    "noEmit": true,
    "allowImportingTsExtensions": true
  },
  "include": ["src"]
}
FIM_tsconfig

# ---------------------------------------------------------------------
cat > vite.config.js <<'FIM_viteconfig'
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
    hmr: {
      port: 3000,
    },
  },
});
FIM_viteconfig

# ---------------------------------------------------------------------
cat > src/main.tsx <<'FIM_main'
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
FIM_main

# ---------------------------------------------------------------------
cat > src/index.css <<'FIM_css'
@import "tailwindcss";

@theme {
  --font-display: "Bricolage Grotesque", "Nunito Sans", ui-sans-serif, sans-serif;
  --font-sans: "Nunito Sans", ui-sans-serif, system-ui, sans-serif;

  --color-paper: #f2f6f0;
  --color-card: #fcfdfb;
  --color-ink: #0f231b;
  --color-inksoft: #4c6156;
  --color-line: #dde7dc;

  --color-pine-50: #eaf4ee;
  --color-pine-100: #d9ecdf;
  --color-pine-200: #b7d9c3;
  --color-pine-300: #8cc0a0;
  --color-pine-400: #57a077;
  --color-pine-500: #2e7d55;
  --color-pine-600: #1f6344;
  --color-pine-700: #174e36;
  --color-pine-800: #123d2b;
  --color-pine-900: #0c2b1e;
  --color-pine-950: #071f15;

  --color-sun-100: #fff3d6;
  --color-sun-200: #ffe6a8;
  --color-sun-300: #ffd678;
  --color-sun-400: #ffc24b;
  --color-sun-500: #f5a623;
  --color-sun-600: #d97f0e;

  --color-ember-100: #ffe4d9;
  --color-ember-300: #ffa283;
  --color-ember-400: #ff8059;
  --color-ember-500: #ff6b3d;
  --color-ember-600: #e8532a;
  --color-ember-700: #c23e1c;

  --color-sky-soft: #cfe3ee;

  --animate-rise: rise 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
  --animate-pop: pop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  --animate-blink: blink 1.4s ease-in-out infinite;
  --animate-breathe: breathe 3.2s ease-in-out infinite;
  --animate-drift: drift 26s linear infinite;
  --animate-tickflash: tickflash 1s ease-out both;

  @keyframes rise {
    from { opacity: 0; transform: translateY(18px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes pop {
    from { opacity: 0; transform: scale(0.86); }
    to { opacity: 1; transform: scale(1); }
  }
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.25; }
  }
  @keyframes breathe {
    0%, 100% { transform: scale(1); opacity: 0.9; }
    50% { transform: scale(1.06); opacity: 1; }
  }
  @keyframes drift {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }
  @keyframes tickflash {
    0% { background-color: color-mix(in srgb, var(--color-sun-400) 45%, transparent); }
    100% { background-color: transparent; }
  }
}

html {
  -webkit-tap-highlight-color: transparent;
}

body {
  @apply bg-paper text-ink font-sans antialiased;
  background-image:
    radial-gradient(60rem 40rem at -10% -10%, color-mix(in srgb, var(--color-pine-200) 45%, transparent), transparent 60%),
    radial-gradient(50rem 36rem at 110% 105%, color-mix(in srgb, var(--color-sun-300) 38%, transparent), transparent 60%);
  background-attachment: fixed;
}

.tnum {
  font-variant-numeric: tabular-nums;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
  appearance: textfield;
}

input[type="date"]::-webkit-calendar-picker-indicator {
  opacity: 0.55;
}

::selection {
  background: var(--color-sun-300);
  color: var(--color-pine-950);
}

.press {
  transition: transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.press:active {
  transform: scale(0.94);
}
FIM_css

# ---------------------------------------------------------------------
cat > src/lib.ts <<'FIM_lib'
import { format, startOfWeek, subDays, parseISO } from "date-fns";

export type Mood = "otimo" | "bem" | "neutro" | "cansado" | "ruim";

export interface Walk {
  id: string;
  /** chave de data yyyy-MM-dd */
  date: string;
  /** horário de início (epoch ms) — opcional */
  startedAt?: number;
  durationSec: number;
  distanceKm: number;
  mood: Mood;
  note?: string;
}

export interface Goals {
  dailyKm: number;
  weeklyKm: number;
}

export const MOODS: { id: Mood; label: string }[] = [
  { id: "otimo", label: "Ótimo" },
  { id: "bem", label: "Bem" },
  { id: "neutro", label: "Neutro" },
  { id: "cansado", label: "Cansado" },
  { id: "ruim", label: "Ruim" },
];

export const DEFAULT_GOALS: Goals = { dailyKm: 5, weeklyKm: 20 };

const WALKS_KEY = "trilha:walks:v1";
const GOALS_KEY = "trilha:goals:v1";

export function uid(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

export function buzz(ms = 12) {
  try {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(ms);
  } catch {
    /* noop */
  }
}

/* ---------- persistência ---------- */

export function loadWalks(): Walk[] {
  try {
    const raw = localStorage.getItem(WALKS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Walk[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveWalks(walks: Walk[]) {
  try {
    localStorage.setItem(WALKS_KEY, JSON.stringify(walks));
  } catch {
    /* noop */
  }
}

export function loadGoals(): Goals {
  try {
    const raw = localStorage.getItem(GOALS_KEY);
    if (!raw) return { ...DEFAULT_GOALS };
    return { ...DEFAULT_GOALS, ...(JSON.parse(raw) as Partial<Goals>) };
  } catch {
    return { ...DEFAULT_GOALS };
  }
}

export function saveGoals(goals: Goals) {
  try {
    localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
  } catch {
    /* noop */
  }
}

/* ---------- datas e formatação ---------- */

export const dateKey = (d: Date) => format(d, "yyyy-MM-dd");
export const todayKey = () => dateKey(new Date());

const WEEKDAYS = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
export const weekdayShort = (d: Date) => WEEKDAYS[d.getDay()];

export function fmtKm(km: number, digits = 1): string {
  return km.toLocaleString("pt-BR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function fmtDur(sec: number): string {
  sec = Math.round(sec);
  if (sec < 60) return `${sec}s`;
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  if (h > 0) return `${h}h ${String(m).padStart(2, "0")}min`;
  return `${m} min`;
}

export function fmtClock(ms: number): string {
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

/** ritmo médio em min/km → "9'24"/km" */
export function fmtPace(sec: number, km: number): string {
  if (km <= 0) return "—";
  const paceSec = sec / km;
  const m = Math.floor(paceSec / 60);
  const s = Math.round(paceSec % 60);
  return `${m}'${String(s).padStart(2, "0")}"`;
}

export function fmtDateLong(d: Date): string {
  const days = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];
  const months = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
  return `${days[d.getDay()]}, ${d.getDate()} de ${months[d.getMonth()]}`;
}

export function fmtMonthYear(d: Date): string {
  const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  return `${months[d.getMonth()]} ${d.getFullYear()}`;
}

export function greeting(): string {
  const h = new Date().getHours();
  if (h < 6) return "Boa madrugada";
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

export function parseDec(text: string): number {
  const n = parseFloat(text.replace(/\./g, "").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

/* ---------- estatísticas ---------- */

export function sumKmByDate(walks: Walk[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const w of walks) map.set(w.date, (map.get(w.date) ?? 0) + w.distanceKm);
  return map;
}

export function kmOn(walks: Walk[], key: string): number {
  return walks.filter((w) => w.date === key).reduce((a, w) => a + w.distanceKm, 0);
}

export function secOn(walks: Walk[], key: string): number {
  return walks.filter((w) => w.date === key).reduce((a, w) => a + w.durationSec, 0);
}

export interface DayPoint {
  key: string;
  label: string;
  km: number;
  isToday: boolean;
}

export function last7Days(walks: Walk[]): DayPoint[] {
  const per = sumKmByDate(walks);
  const out: DayPoint[] = [];
  const today = todayKey();
  for (let i = 6; i >= 0; i--) {
    const d = subDays(new Date(), i);
    const key = dateKey(d);
    out.push({ key, label: weekdayShort(d), km: per.get(key) ?? 0, isToday: key === today });
  }
  return out;
}

export function weekKm(walks: Walk[]): number {
  const start = dateKey(startOfWeek(new Date(), { weekStartsOn: 1 }));
  return walks.filter((w) => w.date >= start).reduce((a, w) => a + w.distanceKm, 0);
}

export function streak(walks: Walk[]): number {
  const days = new Set(walks.map((w) => w.date));
  let count = 0;
  let cursor = new Date();
  if (!days.has(dateKey(cursor))) cursor = subDays(cursor, 1);
  while (days.has(dateKey(cursor))) {
    count++;
    cursor = subDays(cursor, 1);
  }
  return count;
}

export function bestWeekKm(walks: Walk[]): number {
  const weeks = new Map<string, number>();
  for (const w of walks) {
    const start = dateKey(startOfWeek(parseISO(w.date), { weekStartsOn: 1 }));
    weeks.set(start, (weeks.get(start) ?? 0) + w.distanceKm);
  }
  let best = 0;
  for (const v of weeks.values()) best = Math.max(best, v);
  return best;
}

/* ---------- GPS ---------- */

export function haversineM(a: GeolocationCoordinates, b: GeolocationCoordinates): number {
  const R = 6371000;
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

/* ---------- conquistas ---------- */

export interface Achievement {
  id: string;
  title: string;
  desc: string;
  icon: "foot" | "flame" | "star" | "bolt" | "mountain" | "sunrise" | "medal" | "moon";
  current: number;
  target: number;
}

export function computeAchievements(walks: Walk[]): Achievement[] {
  const totalKm = walks.reduce((a, w) => a + w.distanceKm, 0);
  const st = streak(walks);
  const bestStreak = (() => {
    const days = [...new Set(walks.map((w) => w.date))].sort();
    let best = 0;
    let run = 0;
    let prev: string | null = null;
    for (const d of days) {
      if (prev && dateKey(subDays(parseISO(d), -1)) === prev) run++;
      else run = 1;
      best = Math.max(best, run);
      prev = d;
    }
    return best;
  })();
  const longest = walks.reduce((a, w) => Math.max(a, w.distanceKm), 0);
  const earlyBirds = walks.filter((w) => w.startedAt && new Date(w.startedAt).getHours() < 7).length;

  const defs: Omit<Achievement, "current">[] = [
    { id: "first", title: "Primeiros passos", desc: "Registre 1 caminhada", icon: "foot", target: 1 },
    { id: "ten", title: "Dez na conta", desc: "Registre 10 caminhadas", icon: "medal", target: 10 },
    { id: "km10", title: "Dezena de quilômetros", desc: "Acumule 10 km no total", icon: "star", target: 10 },
    { id: "km50", title: "Meia centena", desc: "Acumule 50 km no total", icon: "mountain", target: 50 },
    { id: "km100", title: "Centurião da trilha", desc: "Acumule 100 km no total", icon: "sunrise", target: 100 },
    { id: "streak3", title: "Ritmo constante", desc: "Caminhe 3 dias seguidos", icon: "bolt", target: 3 },
    { id: "streak7", title: "Semana impecável", desc: "Caminhe 7 dias seguidos", icon: "flame", target: 7 },
    { id: "long5", title: "Perna longa", desc: "Uma caminhada de 5 km ou mais", icon: "mountain", target: 5 },
    { id: "early", title: "Madrugador", desc: "Saia antes das 7h (3 vezes)", icon: "moon", target: 3 },
    { id: "w25", title: "Quase lendário", desc: "Registre 25 caminhadas", icon: "star", target: 25 },
  ];

  const currentFor: Record<string, number> = {
    first: Math.min(walks.length, 1),
    ten: walks.length,
    km10: totalKm,
    km50: totalKm,
    km100: totalKm,
    streak3: bestStreak,
    streak7: bestStreak,
    long5: longest,
    early: earlyBirds,
    w25: walks.length,
  };

  return defs.map((d) => ({
    ...d,
    current: Math.round(Math.min(currentFor[d.id], d.target) * 10) / 10,
  }));
}

export const isUnlocked = (a: Achievement) => a.current >= a.target;

/* ---------- dados de exemplo ---------- */

export function sampleWalks(): Walk[] {
  const rnd = mulberry(20260214);
  const notes = [
    "Volta pelo parque, céu limpo.",
    "Ritmo leve, ouvindo podcast.",
    "Fui até a orla e voltei.",
    "Caminhada rápida no almoço.",
    "Trilha curta com subida.",
  ];
  const moods: Mood[] = ["otimo", "bem", "bem", "neutro", "cansado", "otimo", "bem"];
  const skip = new Set([4, 9, 13, 18]);
  const out: Walk[] = [];
  for (let i = 21; i >= 1; i--) {
    if (skip.has(i)) continue;
    const d = subDays(new Date(), i);
    const km = Math.round((2.2 + rnd() * 5) * 10) / 10;
    const pace = 540 + rnd() * 210; // 9'00"–12'30"/km
    const hour = 6 + Math.floor(rnd() * 13);
    const started = new Date(d);
    started.setHours(hour, Math.floor(rnd() * 60), 0, 0);
    out.push({
      id: uid() + i,
      date: dateKey(d),
      startedAt: started.getTime(),
      durationSec: Math.round(km * pace),
      distanceKm: km,
      mood: moods[Math.floor(rnd() * moods.length)],
      note: rnd() > 0.72 ? notes[Math.floor(rnd() * notes.length)] : undefined,
    });
  }
  // garante uma sequência recente (2 dias atrás + ontem + hoje)
  for (const [i, km] of [[2, 4.6], [1, 6.1], [0, 3.2]] as [number, number][]) {
    const d = subDays(new Date(), i);
    out.push({
      id: uid() + "s" + i,
      date: dateKey(d),
      startedAt: new Date(d.getFullYear(), d.getMonth(), d.getDate(), 7, 10).getTime(),
      durationSec: Math.round(km * 600),
      distanceKm: km,
      mood: i === 0 ? "bem" : "otimo",
      note: i === 1 ? "Melhor ritmo da semana!" : undefined,
    });
  }
  return out.sort((a, b) => (b.startedAt ?? 0) - (a.startedAt ?? 0));
}

function mulberry(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
FIM_lib

# ---------------------------------------------------------------------
cat > src/App.tsx <<'FIM_app'
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import BottomNav, { type View } from "./components/BottomNav";
import { Toasts, type ToastMsg, TopoLines } from "./components/ui";
import { IconFoot } from "./components/Icons";
import HomeView from "./views/HomeView";
import TrackView, { type NewWalk } from "./views/TrackView";
import HistoryView from "./views/HistoryView";
import GoalsView from "./views/GoalsView";
import AchievementsView from "./views/AchievementsView";
import {
  Walk,
  Goals,
  loadWalks,
  saveWalks,
  loadGoals,
  saveGoals,
  sampleWalks,
  uid,
  fmtKm,
} from "./lib";

export default function App() {
  const [view, setView] = useState<View>("home");
  const [walks, setWalks] = useState<Walk[]>(() => loadWalks());
  const [goals, setGoals] = useState<Goals>(() => loadGoals());
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const toastId = useRef(0);

  useEffect(() => saveWalks(walks), [walks]);
  useEffect(() => saveGoals(goals), [goals]);
  useEffect(() => window.scrollTo({ top: 0 }), [view]);

  const pushToast = (kind: ToastMsg["kind"], text: string) => {
    const id = ++toastId.current;
    setToasts((t) => [...t.slice(-2), { id, kind, text }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800);
  };

  const celebrate = () => {
    const colors = ["#1f6344", "#ffc24b", "#ff6b3d", "#8cc0a0"];
    confetti({ particleCount: 70, spread: 75, origin: { y: 0.65 }, colors, ticks: 160, scalar: 0.9 });
    window.setTimeout(
      () => confetti({ particleCount: 40, spread: 100, origin: { y: 0.55 }, colors, ticks: 140, scalar: 0.8 }),
      180,
    );
  };

  const addWalk = (w: NewWalk) => {
    const walk: Walk = { ...w, id: uid() };
    setWalks((prev) => [walk, ...prev]);
    celebrate();
    pushToast("ok", `+${fmtKm(walk.distanceKm)} km na conta. Mandou bem!`);
    setView("home");
  };

  const deleteWalk = (id: string) => {
    const target = walks.find((w) => w.id === id);
    setWalks((prev) => prev.filter((w) => w.id !== id));
    pushToast("del", target ? `Caminhada de ${fmtKm(target.distanceKm)} km apagada.` : "Caminhada apagada.");
  };

  const loadSample = () => {
    setWalks(sampleWalks());
    pushToast("ok", "Dados de exemplo carregados — explore à vontade!");
  };

  return (
    <div className="min-h-dvh">
      <Toasts items={toasts} />

      <div className="relative mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-paper lg:my-6 lg:min-h-[calc(100dvh-3rem)] lg:rounded-[2.4rem] lg:border lg:border-pine-200 lg:shadow-[0_44px_90px_-34px_rgba(7,31,21,0.5)]">
        {/* textura ambiente dentro do app */}
        <TopoLines className="pointer-events-none absolute inset-x-0 top-20 h-60 w-full text-pine-300/25" />

        {/* marca */}
        <div className="relative flex items-center justify-between px-5 pt-[max(1.1rem,env(safe-area-inset-top))]">
          <button
            onClick={() => setView("home")}
            className="press flex items-center gap-2.5"
            aria-label="Ir para o início"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-pine-900 text-sun-400 shadow-[0_6px_14px_-6px_rgba(7,31,21,0.6)]">
              <IconFoot className="h-5 w-5" />
            </span>
            <span className="font-display text-xl font-extrabold tracking-tight">
              Trilha<span className="text-ember-500">.</span>
            </span>
          </button>
          <span className="hidden rounded-full border border-line bg-card px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-inksoft min-[380px]:block">
            diário de caminhadas
          </span>
        </div>

        {/* conteúdo */}
        <main className="relative flex-1 px-5 pb-10 pt-5">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {view === "home" && (
              <HomeView
                walks={walks}
                goals={goals}
                onGoTrack={() => setView("track")}
                onGoHistory={() => setView("history")}
                onLoadSample={loadSample}
              />
            )}
            {view === "track" && <TrackView onSave={addWalk} />}
            {view === "history" && (
              <HistoryView
                walks={walks}
                onDelete={deleteWalk}
                onGoTrack={() => setView("track")}
                onLoadSample={loadSample}
              />
            )}
            {view === "goals" && <GoalsView walks={walks} goals={goals} onChange={setGoals} />}
            {view === "badges" && <AchievementsView walks={walks} />}
          </motion.div>
        </main>

        <BottomNav view={view} onChange={setView} />
      </div>
    </div>
  );
}
FIM_app

# ---------------------------------------------------------------------
cat > src/components/Icons.tsx <<'FIM_icons'
import type { Mood } from "../lib";

type P = { className?: string };

const S = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.9,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const IconFoot = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="M9.3 3.6c1.6-.3 2.8 1 3 3 .2 1.7-.4 3.1-1.9 3.4-1.5.3-2.7-.9-3-2.8-.3-1.8.3-3.3 1.9-3.6Zm1 8.1c1-.2 1.9.5 2 1.5l.3 1.9c.1 1-.6 1.9-1.6 2.1s-1.9-.5-2-1.5l-.3-1.9c-.1-1 .6-1.9 1.6-2.1Z" />
    <path d="M14.7 8.6c-1.6-.3-2.9 1-3.1 3-.2 1.7.4 3.1 1.9 3.4 1.5.3 2.7-.9 3-2.8.3-1.8-.3-3.3-1.8-3.6Zm-1.1 8.1c-1-.2-1.9.5-2 1.5l-.3 1.9c-.1 1 .6 1.9 1.6 2.1s1.9-.5 2-1.5l.3-1.9c.1-1-.6-1.9-1.6-2.1Z" opacity=".72" />
  </svg>
);

export const IconHome = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...S} aria-hidden>
    <path d="M4 11.2 12 4.5l8 6.7" />
    <path d="M6 9.8V19a1 1 0 0 0 1 1h3.2v-4.6a1.8 1.8 0 0 1 3.6 0V20H17a1 1 0 0 0 1-1V9.8" />
  </svg>
);

export const IconList = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...S} aria-hidden>
    <circle cx="12" cy="12" r="8.2" />
    <path d="M12 7.6V12l3 2.2" />
    <path d="M19.5 5.5 21 7l-1.5 1.5" opacity=".7" />
  </svg>
);

export const IconTarget = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...S} aria-hidden>
    <circle cx="12" cy="12" r="8.2" />
    <circle cx="12" cy="12" r="4.4" />
    <circle cx="12" cy="12" r="0.8" fill="currentColor" stroke="none" />
  </svg>
);

export const IconTrophy = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...S} aria-hidden>
    <path d="M8 4h8v6a4 4 0 0 1-8 0V4Z" />
    <path d="M8 5.5H5.2a2.9 2.9 0 0 0 3 3.6M16 5.5h2.8a2.9 2.9 0 0 1-3 3.6" />
    <path d="M12 14v3m-3.4 3h6.8M9.5 17h5l.6 3H8.9l.6-3Z" />
  </svg>
);

export const IconFlame = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="M12.6 3.2c.3 2.6 1.5 4 2.9 5.5 1.4 1.6 2.6 3.2 2.6 5.4a6.1 6.1 0 0 1-12.2 0c0-2 .8-3.5 1.9-4.9.5-.6 1.5-.3 1.6.5.1.7.3 1.3.8 1.7-.2-2.9.7-6.3 2.4-8.2Zm-.6 15.9a2.6 2.6 0 0 0 2.6-2.6c0-1.2-.8-2-1.5-2.8-.4-.5-1.2-.4-1.5.2-.3.6-.7 1.1-1.2 1.5-.6.5-1 .9-1 1.9a2.6 2.6 0 0 0 2.6 2.6Z" />
  </svg>
);

export const IconPlay = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="M8.5 5.9c0-1 1.1-1.6 2-1.1l9 5.3c.9.5.9 1.8 0 2.3l-9 5.3c-.9.5-2-.1-2-1.1V5.9Z" />
  </svg>
);

export const IconPause = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <rect x="6.5" y="5" width="4" height="14" rx="1.4" />
    <rect x="13.5" y="5" width="4" height="14" rx="1.4" />
  </svg>
);

export const IconFlag = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...S} aria-hidden>
    <path d="M6 21V4.5" />
    <path d="M6 5h11l-2.4 3.5L17 12H6" fill="currentColor" stroke="none" opacity=".9" />
    <path d="M6 5h11l-2.4 3.5L17 12H6" />
  </svg>
);

export const IconPin = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...S} aria-hidden>
    <path d="M12 21s-6.5-5.4-6.5-10.3a6.5 6.5 0 0 1 13 0C18.5 15.6 12 21 12 21Z" />
    <circle cx="12" cy="10.5" r="2.3" />
  </svg>
);

export const IconTrash = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...S} aria-hidden>
    <path d="M5 7h14M10 7V5.4A1.4 1.4 0 0 1 11.4 4h1.2A1.4 1.4 0 0 1 14 5.4V7" />
    <path d="M6.5 7l.8 12a1.6 1.6 0 0 0 1.6 1.5h6.2a1.6 1.6 0 0 0 1.6-1.5l.8-12" />
    <path d="M10 11v6m4-6v6" opacity=".7" />
  </svg>
);

export const IconPlus = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...S} strokeWidth={2.4} aria-hidden>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const IconX = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...S} strokeWidth={2.2} aria-hidden>
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
);

export const IconCheck = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...S} strokeWidth={2.4} aria-hidden>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);

export const IconChevronR = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...S} aria-hidden>
    <path d="m9.5 5.5 6.5 6.5-6.5 6.5" />
  </svg>
);

export const IconBolt = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="M13.2 2.6 5.6 13.4c-.4.6 0 1.4.7 1.4h4l-1.4 6c-.2.9.9 1.4 1.4.7l7.7-10.8c.4-.6 0-1.4-.7-1.4h-4l1.3-6c.2-.9-.9-1.4-1.4-.7Z" />
  </svg>
);

export const IconMountain = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...S} aria-hidden>
    <path d="m3 19 6-10 3.2 5.3L14.5 11l6.5 8H3Z" />
    <path d="m9 9 1.5-2.5L12 9" opacity=".7" />
  </svg>
);

export const IconStar = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="m12 3 2.5 5.4 5.9.7-4.4 4 1.2 5.8L12 16l-5.2 2.9 1.2-5.8-4.4-4 5.9-.7L12 3Z" />
  </svg>
);

export const IconSunrise = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...S} aria-hidden>
    <path d="M12 3v3M5.2 6.2 7 8m11.8-1.8L17 8M3 15h2m14 0h2" />
    <path d="M7.5 15a4.5 4.5 0 0 1 9 0" />
    <path d="M4 18.5h16" opacity=".7" />
  </svg>
);

export const IconMedal = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...S} aria-hidden>
    <circle cx="12" cy="14.5" r="5" />
    <path d="m8.8 3.5 2 4.6m4.4-4.6-2 4.6M8.8 3.5H6l3 6.6m9.2-6.6H18l-3 6.6" />
    <path d="m12 12.4.9 1.8 2 .3-1.4 1.4.3 2-1.8-1-1.8 1 .3-2-1.4-1.4 2-.3.9-1.8Z" fill="currentColor" stroke="none" opacity=".85" />
  </svg>
);

export const IconMoon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="M19.5 14.2A8 8 0 0 1 9.8 4.5a8 8 0 1 0 9.7 9.7Z" />
  </svg>
);

export const IconNote = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...S} aria-hidden>
    <path d="M7 4h10a1.5 1.5 0 0 1 1.5 1.5v13A1.5 1.5 0 0 1 17 20H7a1.5 1.5 0 0 1-1.5-1.5v-13A1.5 1.5 0 0 1 7 4Z" />
    <path d="M9 9h6M9 12.5h6M9 16h3.5" opacity=".75" />
  </svg>
);

export const IconTimer = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...S} aria-hidden>
    <circle cx="12" cy="13.5" r="7.2" />
    <path d="M12 9.8v3.7l2.6 1.8M9.5 3h5M12 3v3.3" />
  </svg>
);

/* ---------- humor ---------- */

const MOOD_COLOR: Record<Mood, string> = {
  otimo: "#e8a400",
  bem: "#2e7d55",
  neutro: "#7a8b80",
  cansado: "#c77b3a",
  ruim: "#c2483c",
};

export function MoodFace({ mood, className }: { mood: Mood; className?: string }) {
  const c = MOOD_COLOR[mood];
  const eyes =
    mood === "otimo" ? (
      <>
        <path d="M7.6 10c.5-.9 1.9-.9 2.4 0" stroke={c} strokeWidth="1.7" fill="none" strokeLinecap="round" />
        <path d="M14 10c.5-.9 1.9-.9 2.4 0" stroke={c} strokeWidth="1.7" fill="none" strokeLinecap="round" />
      </>
    ) : (
      <>
        <circle cx="8.8" cy="9.8" r="1.05" fill={c} />
        <circle cx="15.2" cy="9.8" r="1.05" fill={c} />
      </>
    );
  const mouth = {
    otimo: <path d="M7.5 13.2c1.2 2.2 7.8 2.2 9 0" stroke={c} strokeWidth="1.7" fill="none" strokeLinecap="round" />,
    bem: <path d="M8.4 13.6c1 1.4 6.2 1.4 7.2 0" stroke={c} strokeWidth="1.7" fill="none" strokeLinecap="round" />,
    neutro: <path d="M8.6 14.4h6.8" stroke={c} strokeWidth="1.7" fill="none" strokeLinecap="round" />,
    cansado: <path d="M8.4 15c1.2-.9 6-1 7.2 0" stroke={c} strokeWidth="1.7" fill="none" strokeLinecap="round" />,
    ruim: <path d="M8.2 15.6c1-1.7 6.6-1.7 7.6 0" stroke={c} strokeWidth="1.7" fill="none" strokeLinecap="round" />,
  }[mood];
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <circle cx="12" cy="12" r="9.2" fill={c} opacity=".16" />
      <circle cx="12" cy="12" r="9.2" fill="none" stroke={c} strokeWidth="1.6" opacity=".55" />
      {eyes}
      {mouth}
      {mood === "otimo" && <path d="m18.6 4.6.5 1.3 1.3.5-1.3.5-.5 1.3-.5-1.3-1.3-.5 1.3-.5.5-1.3Z" fill={c} />}
      {mood === "cansado" && <path d="M17.5 16.5c.9.3 1.6.9 2 1.8" stroke={c} strokeWidth="1.4" fill="none" strokeLinecap="round" opacity=".8" />}
    </svg>
  );
}

export function AchievementIcon({ icon, className }: { icon: "foot" | "flame" | "star" | "bolt" | "mountain" | "sunrise" | "medal" | "moon"; className?: string }) {
  switch (icon) {
    case "foot": return <IconFoot className={className} />;
    case "flame": return <IconFlame className={className} />;
    case "star": return <IconStar className={className} />;
    case "bolt": return <IconBolt className={className} />;
    case "mountain": return <IconMountain className={className} />;
    case "sunrise": return <IconSunrise className={className} />;
    case "medal": return <IconMedal className={className} />;
    case "moon": return <IconMoon className={className} />;
  }
}
FIM_icons

# ---------------------------------------------------------------------
cat > src/components/ui.tsx <<'FIM_ui'
import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";
import { buzz } from "../lib";
import { IconCheck, IconX } from "./Icons";

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
FIM_ui

# ---------------------------------------------------------------------
cat > src/components/BottomNav.tsx <<'FIM_nav'
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
FIM_nav

# ---------------------------------------------------------------------
cat > src/views/HomeView.tsx <<'FIM_home'
import { motion } from "framer-motion";
import {
  Walk,
  Goals,
  fmtKm,
  fmtDur,
  fmtDateLong,
  fmtPace,
  greeting,
  kmOn,
  secOn,
  todayKey,
  weekKm,
  streak,
  last7Days,
  MOODS,
} from "../lib";
import { ProgressRing, Reveal, TopoLines, Bar } from "../components/ui";
import { IconFlame, IconPlay, IconChevronR, IconFoot, MoodFace } from "../components/Icons";

const QUOTES = [
  "Mil passos começam com um pé na porta.",
  "O melhor ritmo é o que te faz voltar amanhã.",
  "Caminhar é conversar com a cidade em voz baixa.",
  "Quem caminha, alcança — devagar também é chegar.",
  "Troque o elevador pela calçada e o dia muda de cor.",
];

export default function HomeView({
  walks,
  goals,
  onGoTrack,
  onGoHistory,
  onLoadSample,
}: {
  walks: Walk[];
  goals: Goals;
  onGoTrack: () => void;
  onGoHistory: () => void;
  onLoadSample: () => void;
}) {
  const today = todayKey();
  const todayKm = kmOn(walks, today);
  const todaySec = secOn(walks, today);
  const wk = weekKm(walks);
  const st = streak(walks);
  const days = last7Days(walks);
  const weekTotal = days.reduce((a, d) => a + d.km, 0);
  const maxBar = Math.max(goals.dailyKm, ...days.map((d) => d.km)) * 1.2 || 1;
  const recent = [...walks]
    .sort((a, b) => b.date.localeCompare(a.date) || (b.startedAt ?? 0) - (a.startedAt ?? 0))
    .slice(0, 3);
  const quote = QUOTES[new Date().getDate() % QUOTES.length];
  const dailyPct = goals.dailyKm > 0 ? todayKm / goals.dailyKm : 0;

  return (
    <div className="space-y-5">
      {/* cabeçalho */}
      <Reveal>
        <header className="flex items-end justify-between">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-pine-500">
              {fmtDateLong(new Date())}
            </p>
            <h1 className="font-display text-[2rem] font-extrabold leading-tight tracking-tight">
              {greeting()},<br />
              <span className="text-pine-600">bora caminhar?</span>
            </h1>
          </div>
          <div
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-extrabold ${
              st > 0 ? "border-sun-300 bg-sun-100 text-sun-600" : "border-line bg-card text-inksoft"
            }`}
            title="Sequência de dias caminhando"
          >
            <IconFlame className={`h-4 w-4 ${st > 0 ? "text-ember-500" : "text-line"}`} />
            <span className="tnum">{st} {st === 1 ? "dia" : "dias"}</span>
          </div>
        </header>
      </Reveal>

      {/* cartão de hoje */}
      <Reveal delay={0.05}>
        <section className="relative overflow-hidden rounded-[1.6rem] bg-pine-900 p-5 text-pine-50 shadow-[0_18px_40px_-18px_rgba(7,31,21,0.65)]">
          <TopoLines className="pointer-events-none absolute inset-0 h-full w-full text-pine-700/70" />
          <div className="pointer-events-none absolute -right-10 -top-14 h-44 w-44 rounded-full bg-sun-400/15 blur-2xl" />
          <div className="relative flex items-center gap-5">
            <ProgressRing size={142} stroke={11} value={dailyPct} trackClass="stroke-pine-800" barClass="stroke-sun-400">
              <span className="font-display text-[1.9rem] font-extrabold leading-none tnum">{fmtKm(todayKm)}</span>
              <span className="mt-1 text-[11px] font-bold uppercase tracking-wider text-pine-300">km hoje</span>
            </ProgressRing>
            <div className="flex-1 space-y-3">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-pine-300">Meta diária</p>
                <p className="font-display text-lg font-extrabold tnum">
                  {fmtKm(Math.max(0, goals.dailyKm - todayKm))} km <span className="text-sm font-bold text-pine-300">restantes</span>
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-pine-800/80 px-3 py-2">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-pine-300">Tempo hoje</p>
                  <p className="font-display text-base font-extrabold tnum">{todaySec ? fmtDur(todaySec) : "—"}</p>
                </div>
                <div className="rounded-xl bg-pine-800/80 px-3 py-2">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-pine-300">Na semana</p>
                  <p className="font-display text-base font-extrabold tnum">{fmtKm(wk)} km</p>
                </div>
              </div>
            </div>
          </div>
          {dailyPct >= 1 && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative mt-4 rounded-xl bg-sun-400/15 px-3 py-2 text-sm font-bold text-sun-300"
            >
              Meta diária cumprida — {Math.round(dailyPct * 100)}% concluída. Cada passo extra é lucro!
            </motion.p>
          )}
        </section>
      </Reveal>

      {/* CTA / vazio */}
      {walks.length === 0 ? (
        <Reveal delay={0.08}>
          <section className="rounded-[1.6rem] border-2 border-dashed border-pine-300 bg-card p-5 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-pine-100 text-pine-600">
              <IconFoot className="h-7 w-7" />
            </span>
            <h2 className="mt-3 font-display text-xl font-extrabold">Nenhuma caminhada ainda</h2>
            <p className="mx-auto mt-1 max-w-[26ch] text-sm font-semibold text-inksoft">
              Calce o tênis e registre a primeira — o cronômetro cuida do resto.
            </p>
            <button
              onClick={onGoTrack}
              className="press mx-auto mt-4 flex items-center gap-2 rounded-full bg-ember-500 px-6 py-3 font-display text-base font-extrabold text-card shadow-[0_10px_24px_-8px_rgba(232,83,42,0.7)]"
            >
              <IconPlay className="h-4 w-4" /> Começar agora
            </button>
            <button onClick={onLoadSample} className="press mx-auto mt-3 block text-[13px] font-bold text-pine-500 underline-offset-2 hover:underline">
              ou carregar dados de exemplo
            </button>
          </section>
        </Reveal>
      ) : (
        <Reveal delay={0.08}>
          <button
            onClick={onGoTrack}
            className="press group flex w-full items-center gap-4 rounded-[1.6rem] bg-ember-500 p-4 text-left text-card shadow-[0_14px_30px_-12px_rgba(232,83,42,0.75)]"
          >
            <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full bg-card/15">
              <span className="absolute inset-0 animate-breathe rounded-full bg-card/10" />
              <IconPlay className="relative h-5 w-5" />
            </span>
            <span className="flex-1">
              <span className="block font-display text-lg font-extrabold leading-tight">Iniciar caminhada</span>
              <span className="block text-[13px] font-bold text-ember-100">Cronômetro + GPS medem por você</span>
            </span>
            <IconChevronR className="h-5 w-5 opacity-70 transition-transform group-hover:translate-x-1" />
          </button>
        </Reveal>
      )}

      {/* gráfico semanal */}
      <Reveal delay={0.1}>
        <section className="rounded-[1.6rem] border border-line bg-card p-5 shadow-sm">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-lg font-extrabold">Últimos 7 dias</h2>
            <p className="text-sm font-extrabold text-pine-600 tnum">{fmtKm(weekTotal)} km</p>
          </div>
          <div className="relative mt-4">
            <div
              className="pointer-events-none absolute inset-x-0 z-10 border-t-2 border-dashed border-ember-400/70"
              style={{ bottom: `${21 + (goals.dailyKm / maxBar) * 100}px` }}
            >
              <span className="absolute -top-2.5 right-0 rounded bg-ember-500/10 px-1.5 py-0.5 text-[10px] font-extrabold text-ember-600">
                meta {fmtKm(goals.dailyKm)}
              </span>
            </div>
            <div className="flex h-[132px] items-end justify-between gap-2">
              {days.map((d, i) => (
                <div key={d.key} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
                  <span className={`text-[10px] font-extrabold tnum ${d.km > 0 ? "text-inksoft" : "text-transparent"}`}>
                    {fmtKm(d.km)}
                  </span>
                  <motion.div
                    initial={{ height: 4 }}
                    whileInView={{ height: Math.max(4, (d.km / maxBar) * 100) }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                    className={`w-full max-w-[30px] rounded-t-lg rounded-b-[4px] ${
                      d.isToday
                        ? "bg-ember-500 shadow-[0_6px_14px_-4px_rgba(232,83,42,0.6)]"
                        : d.km >= goals.dailyKm
                          ? "bg-pine-500"
                          : "bg-pine-300"
                    }`}
                  />
                  <span className={`text-[11px] font-extrabold uppercase ${d.isToday ? "text-ember-600" : "text-inksoft"}`}>
                    {d.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* recentes */}
      <Reveal delay={0.12}>
        <section>
          <div className="mb-2.5 flex items-center justify-between px-1">
            <h2 className="font-display text-lg font-extrabold">Últimas caminhadas</h2>
            {walks.length > 0 && (
              <button onClick={onGoHistory} className="press flex items-center gap-0.5 text-[13px] font-extrabold text-pine-600 hover:text-pine-700">
                Ver todas <IconChevronR className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          {recent.length === 0 ? (
            <p className="rounded-[1.4rem] border border-line bg-card px-4 py-6 text-center text-sm font-semibold text-inksoft">
              Seu histórico aparece aqui. 🌿
            </p>
          ) : (
            <ul className="space-y-2.5">
              {recent.map((w) => (
                <li
                  key={w.id}
                  className="flex items-center gap-3.5 rounded-[1.4rem] border border-line bg-card px-4 py-3 transition-shadow hover:shadow-md"
                >
                  <MoodFace mood={w.mood} className="h-9 w-9 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-base font-extrabold tnum">
                      {fmtKm(w.distanceKm)} km
                      <span className="ml-2 text-[13px] font-bold text-inksoft">{fmtDur(w.durationSec)}</span>
                    </p>
                    <p className="truncate text-xs font-bold text-inksoft">
                      {MOODS.find((m) => m.id === w.mood)?.label} · ritmo {fmtPace(w.durationSec, w.distanceKm)}/km
                      {w.note ? ` · “${w.note}”` : ""}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-pine-50 px-2.5 py-1 text-[11px] font-extrabold text-pine-600 tnum">
                    {new Date(w.date + "T12:00:00").getDate()}{" "}
                    {new Date(w.date + "T12:00:00").toLocaleDateString("pt-BR", { month: "short" }).replace(".", "")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </Reveal>

      {/* citação */}
      <Reveal delay={0.14}>
        <div className="flex items-start gap-3 px-2 pb-2">
          <div className="mt-1 h-8 w-1 shrink-0 rounded-full bg-sun-400" />
          <p className="text-[13px] font-bold italic leading-relaxed text-inksoft">“{quote}”</p>
        </div>
      </Reveal>
      {walks.length > 0 && (
        <div className="px-1">
          <Bar value={wk / (goals.weeklyKm || 1)} track="bg-pine-100" className="bg-pine-500" />
          <p className="mt-1.5 text-center text-[12px] font-bold text-inksoft tnum">
            {fmtKm(wk)} de {fmtKm(goals.weeklyKm, 0)} km da meta semanal
          </p>
        </div>
      )}
    </div>
  );
}
FIM_home

# ---------------------------------------------------------------------
cat > src/views/TrackView.tsx <<'FIM_track'
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mood,
  MOODS,
  fmtClock,
  fmtKm,
  fmtPace,
  todayKey,
  haversineM,
  buzz,
  parseDec,
} from "../lib";
import { Sheet, TopoLines } from "../components/ui";
import { IconPlay, IconPause, IconFlag, IconPin, IconX, MoodFace, IconTimer } from "../components/Icons";

type Phase = "idle" | "running" | "paused" | "done";
type Gps = "off" | "locating" | "on" | "denied";

export interface NewWalk {
  distanceKm: number;
  durationSec: number;
  mood: Mood;
  note?: string;
  date: string;
  startedAt: number;
}

export default function TrackView({ onSave }: { onSave: (w: NewWalk) => void }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [gps, setGps] = useState<Gps>("off");
  const [meters, setMeters] = useState(0);
  const [sheetOpen, setSheetOpen] = useState(false);

  // formulário
  const [fDist, setFDist] = useState("");
  const [fMin, setFMin] = useState("0");
  const [fDate, setFDate] = useState(todayKey());
  const [fMood, setFMood] = useState<Mood>("bem");
  const [fNote, setFNote] = useState("");
  const [err, setErr] = useState("");

  const accRef = useRef(0);
  const tickRef = useRef(0);
  const intervalRef = useRef<number | null>(null);
  const watchRef = useRef<number | null>(null);
  const lastFixRef = useRef<GeolocationPosition | null>(null);
  const metersRef = useRef(0);
  const startedAtRef = useRef(Date.now());

  const stopClock = () => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };
  const stopWatch = () => {
    if (watchRef.current !== null && "geolocation" in navigator) {
      navigator.geolocation.clearWatch(watchRef.current);
      watchRef.current = null;
    }
  };
  const startWatch = () => {
    if (!("geolocation" in navigator)) {
      setGps("denied");
      return;
    }
    setGps("locating");
    watchRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setGps("on");
        if (pos.coords.accuracy <= 60) {
          const last = lastFixRef.current;
          if (last) {
            const d = haversineM(last.coords, pos.coords);
            if (d > 2.5 && d < 150) {
              metersRef.current += d;
              setMeters(metersRef.current);
            }
          }
          lastFixRef.current = pos;
        }
      },
      () => setGps("denied"),
      { enableHighAccuracy: true, maximumAge: 1000, timeout: 12000 },
    );
  };

  const start = () => {
    buzz(20);
    accRef.current = 0;
    metersRef.current = 0;
    lastFixRef.current = null;
    setMeters(0);
    setElapsed(0);
    startedAtRef.current = Date.now();
    tickRef.current = Date.now();
    setPhase("running");
    intervalRef.current = window.setInterval(() => {
      const now = Date.now();
      accRef.current += now - tickRef.current;
      tickRef.current = now;
      setElapsed(accRef.current);
    }, 250);
    startWatch();
  };

  const pause = () => {
    buzz(12);
    const now = Date.now();
    accRef.current += now - tickRef.current;
    setElapsed(accRef.current);
    stopClock();
    stopWatch();
    setPhase("paused");
  };

  const resume = () => {
    buzz(12);
    tickRef.current = Date.now();
    setPhase("running");
    intervalRef.current = window.setInterval(() => {
      const now = Date.now();
      accRef.current += now - tickRef.current;
      tickRef.current = now;
      setElapsed(accRef.current);
    }, 250);
    startWatch();
  };

  const finish = () => {
    buzz([18, 60, 18] as never);
    if (phase === "running") {
      const now = Date.now();
      accRef.current += now - tickRef.current;
      setElapsed(accRef.current);
    }
    stopClock();
    stopWatch();
    const gpsKm = metersRef.current / 1000;
    setFDist(gpsKm >= 0.05 ? gpsKm.toFixed(2).replace(".", ",") : "");
    setFMin(String(Math.max(1, Math.round(accRef.current / 60000))));
    setFDate(todayKey());
    setFMood("bem");
    setFNote("");
    setErr("");
    setPhase("done");
    setSheetOpen(true);
  };

  const discard = () => {
    buzz(12);
    stopClock();
    stopWatch();
    accRef.current = 0;
    setElapsed(0);
    setMeters(0);
    setPhase("idle");
    setGps("off");
  };

  const submit = () => {
    const km = parseDec(fDist);
    const min = Math.round(parseDec(fMin));
    if (km <= 0) return setErr("Informe a distância percorrida (km).");
    if (km > 100) return setErr("Distância acima de 100 km? Confere aí 😅");
    if (min < 1) return setErr("A duração precisa ser de pelo menos 1 minuto.");
    setErr("");
    onSave({
      distanceKm: Math.round(km * 100) / 100,
      durationSec: min * 60,
      mood: fMood,
      note: fNote.trim() || undefined,
      date: fDate,
      startedAt: startedAtRef.current,
    });
    setSheetOpen(false);
    setPhase("idle");
    metersRef.current = 0;
    setMeters(0);
    setGps("off");
  };

  useEffect(() => () => { stopClock(); stopWatch(); }, []);

  const gpsKm = meters / 1000;
  const livePace = gpsKm > 0.15 ? fmtPace(elapsed / 1000, gpsKm) : null;

  const gpsChip = {
    off: { txt: "GPS em espera", cls: "border-line bg-card text-inksoft", dot: "bg-line" },
    locating: { txt: "Localizando…", cls: "border-sun-300 bg-sun-100 text-sun-600", dot: "bg-sun-500 animate-blink" },
    on: { txt: "GPS ativo", cls: "border-pine-300 bg-pine-50 text-pine-600", dot: "bg-pine-500 animate-blink" },
    denied: { txt: "GPS indisponível — informe a distância ao final", cls: "border-ember-300 bg-ember-100 text-ember-700", dot: "bg-ember-500" },
  }[gps];

  return (
    <div className="flex min-h-[70dvh] flex-col items-center">
      <header className="w-full text-center">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-pine-500">Modo trilha</p>
        <h1 className="font-display text-3xl font-extrabold tracking-tight">
          {phase === "idle"
            ? "Pronto para andar?"
            : phase === "running"
              ? "Em movimento"
              : phase === "paused"
                ? "Pausa para água"
                : "Trilha concluída"}
        </h1>
      </header>

      <div
        className={`mt-2 flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-extrabold ${gpsChip.cls}`}
      >
        <IconPin className="h-3.5 w-3.5" />
        <span className={`h-1.5 w-1.5 rounded-full ${gpsChip.dot}`} />
        {gpsChip.txt}
      </div>

      {/* palco principal */}
      <div className="relative mt-8 grid w-full place-items-center">
        <AnimatePresence mode="wait">
          {phase === "idle" ? (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center"
            >
              <button onClick={start} aria-label="Iniciar caminhada" className="press group relative grid h-52 w-52 place-items-center">
                <span className="absolute inset-0 rounded-full bg-pine-900/10 animate-breathe" />
                <span className="absolute inset-3 rounded-full bg-pine-900/15 animate-breathe [animation-delay:0.6s]" />
                <span className="relative grid h-40 w-40 place-items-center rounded-full bg-pine-900 text-sun-400 shadow-[0_24px_50px_-16px_rgba(7,31,21,0.6)] transition-transform group-hover:scale-[1.03]">
                  <IconPlay className="h-14 w-14 translate-x-1" />
                </span>
              </button>
              <p className="mt-6 max-w-[26ch] text-center text-sm font-bold text-inksoft">
                Toque para iniciar. O tempo corre aqui; a distância vem do GPS — ou você digita no final.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="active"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              <div className="relative overflow-hidden rounded-[1.8rem] bg-pine-900 px-5 py-8 text-center text-pine-50 shadow-[0_20px_44px_-18px_rgba(7,31,21,0.65)]">
                <TopoLines className="pointer-events-none absolute inset-0 h-full w-full text-pine-700/70" />
                <div className="relative">
                  <p className="flex items-center justify-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-pine-300">
                    <IconTimer className="h-4 w-4" /> tempo de trilha
                  </p>
                  <p className={`mt-2 font-display text-[4.2rem] font-extrabold leading-none tnum ${phase === "paused" ? "opacity-60" : ""}`}>
                    {fmtClock(elapsed)}
                  </p>
                  <div className="mt-5 flex items-center justify-center gap-2.5">
                    <div className="rounded-xl bg-pine-800/85 px-4 py-2.5">
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-pine-300">distância</p>
                      <p className="font-display text-xl font-extrabold tnum">
                        {gpsKm > 0.02 ? `${fmtKm(gpsKm, 2)} km` : "—"}
                      </p>
                    </div>
                    <div className="rounded-xl bg-pine-800/85 px-4 py-2.5">
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-pine-300">ritmo</p>
                      <p className="font-display text-xl font-extrabold tnum">{livePace ? `${livePace}/km` : "—"}</p>
                    </div>
                  </div>
                  {gps === "denied" && (
                    <p className="mt-4 text-xs font-bold text-sun-300">Sem GPS? Sem crise: você informa os km ao concluir.</p>
                  )}
                </div>
              </div>

              <div className="mt-5 flex items-center justify-center gap-3">
                {phase === "running" ? (
                  <button
                    onClick={pause}
                    className="press flex items-center gap-2 rounded-full border-2 border-pine-800 bg-card px-6 py-3.5 font-display text-base font-extrabold text-pine-800"
                  >
                    <IconPause className="h-4 w-4" /> Pausar
                  </button>
                ) : (
                  <button
                    onClick={resume}
                    className="press flex items-center gap-2 rounded-full bg-pine-800 px-6 py-3.5 font-display text-base font-extrabold text-pine-50"
                  >
                    <IconPlay className="h-4 w-4" /> Retomar
                  </button>
                )}
                <button
                  onClick={finish}
                  className="press flex items-center gap-2 rounded-full bg-ember-500 px-6 py-3.5 font-display text-base font-extrabold text-card shadow-[0_12px_26px_-10px_rgba(232,83,42,0.8)]"
                >
                  <IconFlag className="h-4 w-4" /> Concluir
                </button>
              </div>
              <button onClick={discard} className="press mx-auto mt-4 flex items-center gap-1.5 text-[13px] font-bold text-inksoft hover:text-ember-600">
                <IconX className="h-3.5 w-3.5" /> Descartar caminhada
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* passos de uso */}
      {phase === "idle" && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="mt-9 grid w-full gap-2.5"
        >
          {[
            ["1", "Dê o play e guarde o celular no bolso"],
            ["2", "Caminhe no seu ritmo — o GPS soma os passos"],
            ["3", "Conclua, ajuste os km se precisar e salve"],
          ].map(([n, t]) => (
            <div key={n} className="flex items-center gap-3.5 rounded-[1.2rem] border border-line bg-card px-4 py-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sun-300 font-display text-sm font-extrabold text-pine-950">{n}</span>
              <p className="text-sm font-bold text-inksoft">{t}</p>
            </div>
          ))}
        </motion.div>
      )}

      {/* folha de registro */}
      <Sheet
        open={sheetOpen}
        onClose={() => {
          setSheetOpen(false);
          setPhase("paused");
        }}
      >
        <h2 className="font-display text-2xl font-extrabold">Registrar caminhada 🎉</h2>
        <p className="mt-0.5 text-sm font-semibold text-inksoft">Confira os dados antes de salvar.</p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1 block text-[11px] font-extrabold uppercase tracking-wider text-inksoft">Distância (km)</span>
            <input
              value={fDist}
              onChange={(e) => setFDist(e.target.value)}
              inputMode="decimal"
              placeholder="ex.: 4,2"
              className="w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 font-display text-lg font-extrabold tnum outline-none transition focus:border-pine-500 focus:bg-card"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-[11px] font-extrabold uppercase tracking-wider text-inksoft">Duração (min)</span>
            <input
              value={fMin}
              onChange={(e) => setFMin(e.target.value.replace(/[^\d]/g, ""))}
              inputMode="numeric"
              placeholder="ex.: 45"
              className="w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 font-display text-lg font-extrabold tnum outline-none transition focus:border-pine-500 focus:bg-card"
            />
          </label>
        </div>

        <label className="mt-3 block">
          <span className="mb-1 block text-[11px] font-extrabold uppercase tracking-wider text-inksoft">Data</span>
          <input
            type="date"
            value={fDate}
            max={todayKey()}
            onChange={(e) => setFDate(e.target.value)}
            className="w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-base font-bold outline-none transition focus:border-pine-500 focus:bg-card"
          />
        </label>

        <div className="mt-3">
          <span className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-inksoft">Como você se sentiu?</span>
          <div className="flex justify-between gap-1">
            {MOODS.map((m) => (
              <button
                key={m.id}
                onClick={() => { buzz(8); setFMood(m.id); }}
                className={`press flex flex-1 flex-col items-center gap-1 rounded-xl border-2 px-1 py-2 transition ${
                  fMood === m.id ? "border-pine-500 bg-pine-50" : "border-transparent hover:border-line"
                }`}
              >
                <MoodFace mood={m.id} className={`h-8 w-8 ${fMood === m.id ? "" : "opacity-55"}`} />
                <span className={`text-[10px] font-extrabold ${fMood === m.id ? "text-pine-700" : "text-inksoft"}`}>{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        <label className="mt-3 block">
          <span className="mb-1 flex justify-between text-[11px] font-extrabold uppercase tracking-wider text-inksoft">
            Anotação <span className="tnum normal-case tracking-normal">{fNote.length}/140</span>
          </span>
          <textarea
            value={fNote}
            onChange={(e) => setFNote(e.target.value.slice(0, 140))}
            rows={2}
            placeholder="Rota, companhia, clima…"
            className="w-full resize-none rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm font-semibold outline-none transition focus:border-pine-500 focus:bg-card"
          />
        </label>

        {err && <p className="mt-2 rounded-lg bg-ember-100 px-3 py-2 text-[13px] font-bold text-ember-700">{err}</p>}

        <button
          onClick={submit}
          className="press mt-4 w-full rounded-full bg-pine-900 py-3.5 font-display text-lg font-extrabold text-sun-300 shadow-[0_14px_30px_-12px_rgba(7,31,21,0.7)]"
        >
          Salvar caminhada
        </button>
      </Sheet>
    </div>
  );
}
FIM_track

# ---------------------------------------------------------------------
cat > src/views/HistoryView.tsx <<'FIM_history'
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { parseISO } from "date-fns";
import { Walk, fmtKm, fmtDur, fmtPace, fmtMonthYear, weekdayShort, MOODS } from "../lib";

const parseISOKey = parseISO;
import { Reveal, Segmented } from "../components/ui";
import { IconTrash, IconFoot, IconPlay, MoodFace } from "../components/Icons";

type Filter = "all" | "week" | "month";

export default function HistoryView({
  walks,
  onDelete,
  onGoTrack,
  onLoadSample,
}: {
  walks: Walk[];
  onDelete: (id: string) => void;
  onGoTrack: () => void;
  onLoadSample: () => void;
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const now = new Date();
    const sorted = [...walks].sort((a, b) => b.date.localeCompare(a.date) || (b.startedAt ?? 0) - (a.startedAt ?? 0));
    if (filter === "all") return sorted;
    if (filter === "week") {
      const start = new Date(now);
      start.setDate(now.getDate() - ((now.getDay() + 6) % 7)); // segunda
      const key = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      return sorted.filter((w) => w.date >= key(start));
    }
    const prefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    return sorted.filter((w) => w.date.startsWith(prefix));
  }, [walks, filter]);

  const totals = useMemo(() => {
    const km = filtered.reduce((a, w) => a + w.distanceKm, 0);
    const sec = filtered.reduce((a, w) => a + w.durationSec, 0);
    return { km, sec, n: filtered.length };
  }, [filtered]);

  const groups = useMemo(() => {
    const map = new Map<string, Walk[]>();
    for (const w of filtered) {
      const d = parseISOKey(w.date);
      const k = `${d.getFullYear()}-${d.getMonth()}`;
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(w);
    }
    return [...map.entries()];
  }, [filtered]);

  const askDelete = (id: string) => {
    if (confirmId === id) {
      onDelete(id);
      setConfirmId(null);
    } else {
      setConfirmId(id);
      window.setTimeout(() => setConfirmId((c) => (c === id ? null : c)), 2600);
    }
  };

  return (
    <div className="space-y-4">
      <Reveal>
        <header>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-pine-500">Diário de bordo</p>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">Histórico</h1>
        </header>
      </Reveal>

      <Reveal delay={0.05}>
        <Segmented<Filter>
          value={filter}
          onChange={setFilter}
          options={[
            { id: "all", label: "Todas" },
            { id: "week", label: "Semana" },
            { id: "month", label: "Mês" },
          ]}
        />
      </Reveal>

      <Reveal delay={0.08}>
        <div className="grid grid-cols-3 divide-x divide-line rounded-[1.4rem] border border-line bg-card py-3.5 text-center shadow-sm">
          {[
            [fmtKm(totals.km), "km totais"],
            [fmtDur(totals.sec), "no relógio"],
            [String(totals.n), totals.n === 1 ? "caminhada" : "caminhadas"],
          ].map(([v, l]) => (
            <div key={l} className="px-2">
              <p className="font-display text-lg font-extrabold leading-tight tnum">{v}</p>
              <p className="text-[11px] font-bold uppercase tracking-wide text-inksoft">{l}</p>
            </div>
          ))}
        </div>
      </Reveal>

      {filtered.length === 0 ? (
        <Reveal delay={0.1}>
          <div className="rounded-[1.6rem] border-2 border-dashed border-pine-300 bg-card px-5 py-10 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-pine-100 text-pine-600">
              <IconFoot className="h-7 w-7" />
            </span>
            <h2 className="mt-3 font-display text-xl font-extrabold">
              {walks.length === 0 ? "Nada por aqui ainda" : "Nenhuma caminhada nesse período"}
            </h2>
            <p className="mx-auto mt-1 max-w-[28ch] text-sm font-semibold text-inksoft">
              {walks.length === 0
                ? "Cada trilha salva aparece aqui, dia após dia."
                : "Ajuste o filtro acima ou vá somar mais alguns km."}
            </p>
            {walks.length === 0 ? (
              <div className="mt-5 flex flex-col items-center gap-2.5">
                <button
                  onClick={onGoTrack}
                  className="press flex items-center gap-2 rounded-full bg-pine-900 px-6 py-3 font-display text-base font-extrabold text-sun-300"
                >
                  <IconPlay className="h-4 w-4" /> Registrar caminhada
                </button>
                <button onClick={onLoadSample} className="press text-[13px] font-bold text-pine-500 underline-offset-2 hover:underline">
                  carregar dados de exemplo
                </button>
              </div>
            ) : (
              <button
                onClick={onGoTrack}
                className="press mx-auto mt-5 flex items-center gap-2 rounded-full bg-pine-900 px-6 py-3 font-display text-base font-extrabold text-sun-300"
              >
                <IconPlay className="h-4 w-4" /> Caminhar agora
              </button>
            )}
          </div>
        </Reveal>
      ) : (
        groups.map(([k, items], gi) => {
          const d = parseISOKey(items[0].date);
          const gKm = items.reduce((a, w) => a + w.distanceKm, 0);
          return (
            <section key={k}>
              <Reveal delay={gi * 0.03}>
                <div className="mb-2 flex items-baseline justify-between px-1">
                  <h2 className="font-display text-base font-extrabold">{fmtMonthYear(d)}</h2>
                  <span className="text-xs font-extrabold text-pine-600 tnum">{fmtKm(gKm)} km · {items.length} {items.length === 1 ? "trilha" : "trilhas"}</span>
                </div>
              </Reveal>
              <ul className="space-y-2.5">
                {items.map((w, i) => {
                  const wd = parseISOKey(w.date);
                  const confirming = confirmId === w.id;
                  return (
                    <li key={w.id}>
                      <Reveal delay={Math.min(i * 0.04, 0.2)}>
                      <article className="flex items-center gap-3.5 rounded-[1.4rem] border border-line bg-card px-4 py-3 transition-shadow hover:shadow-md">
                        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-pine-50 text-center">
                          <div>
                            <p className="font-display text-lg font-extrabold leading-none tnum">{wd.getDate()}</p>
                            <p className="text-[10px] font-extrabold uppercase text-pine-600">{weekdayShort(wd)}</p>
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-display text-[17px] font-extrabold tnum">
                            {fmtKm(w.distanceKm)} km
                            <span className="ml-2 text-[13px] font-bold text-inksoft">{fmtDur(w.durationSec)}</span>
                          </p>
                          <p className="truncate text-xs font-bold text-inksoft">
                            ritmo {fmtPace(w.durationSec, w.distanceKm)}/km · {MOODS.find((m) => m.id === w.mood)?.label.toLowerCase()}
                            {w.note ? ` · “${w.note}”` : ""}
                          </p>
                        </div>
                        <MoodFace mood={w.mood} className="h-8 w-8 shrink-0" />
                        <AnimatePresence mode="wait" initial={false}>
                          {confirming ? (
                            <motion.button
                              key="confirm"
                              initial={{ scale: 0.7, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.7, opacity: 0 }}
                              onClick={() => askDelete(w.id)}
                              className="press shrink-0 rounded-full bg-ember-600 px-3 py-1.5 text-[11px] font-extrabold text-ember-100"
                            >
                              Apagar?
                            </motion.button>
                          ) : (
                            <motion.button
                              key="trash"
                              initial={{ scale: 0.7, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.7, opacity: 0 }}
                              onClick={() => askDelete(w.id)}
                              aria-label="Apagar caminhada"
                              className="press shrink-0 rounded-full p-2 text-inksoft/70 transition-colors hover:bg-ember-100 hover:text-ember-600"
                            >
                              <IconTrash className="h-4.5 w-4.5" />
                            </motion.button>
                          )}
                        </AnimatePresence>
                      </article>
                      </Reveal>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })
      )}
    </div>
  );
}
FIM_history

# ---------------------------------------------------------------------
cat > src/views/GoalsView.tsx <<'FIM_goals'
import { Walk, Goals, fmtKm, fmtDur, kmOn, weekKm, bestWeekKm, todayKey } from "../lib";
import { Reveal, Stepper, Bar } from "../components/ui";
import { IconTarget, IconCheck } from "../components/Icons";

export default function GoalsView({
  walks,
  goals,
  onChange,
}: {
  walks: Walk[];
  goals: Goals;
  onChange: (g: Goals) => void;
}) {
  const today = kmOn(walks, todayKey());
  const wk = weekKm(walks);
  const best = bestWeekKm(walks);
  const totalKm = walks.reduce((a, w) => a + w.distanceKm, 0);
  const totalSec = walks.reduce((a, w) => a + w.durationSec, 0);
  const avg = walks.length ? totalKm / walks.length : 0;

  const dailyDone = goals.dailyKm > 0 && today >= goals.dailyKm;
  const weeklyDone = goals.weeklyKm > 0 && wk >= goals.weeklyKm;

  return (
    <div className="space-y-4">
      <Reveal>
        <header>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-pine-500">Rumo e medida</p>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">Metas</h1>
        </header>
      </Reveal>

      {/* meta diária */}
      <Reveal delay={0.05}>
        <section className="rounded-[1.6rem] border border-line bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-extrabold">Meta diária</h2>
            {dailyDone && (
              <span className="flex items-center gap-1 rounded-full bg-pine-500 px-2.5 py-1 text-[11px] font-extrabold text-pine-50">
                <IconCheck className="h-3 w-3" /> cumprida
              </span>
            )}
          </div>
          <div className="mt-3 flex justify-center">
            <Stepper value={goals.dailyKm} onChange={(v) => onChange({ ...goals, dailyKm: v })} step={0.5} min={0.5} max={42} unit="km/dia" />
          </div>
          <div className="mt-4">
            <Bar value={today / goals.dailyKm} className={dailyDone ? "bg-pine-500" : "bg-sun-400"} />
            <p className="mt-1.5 flex justify-between text-[12px] font-bold text-inksoft tnum">
              <span>hoje: {fmtKm(today)} km</span>
              <span>{Math.min(999, Math.round((today / goals.dailyKm) * 100))}%</span>
            </p>
          </div>
        </section>
      </Reveal>

      {/* meta semanal */}
      <Reveal delay={0.08}>
        <section className="rounded-[1.6rem] border border-line bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-extrabold">Meta semanal</h2>
            {weeklyDone && (
              <span className="flex items-center gap-1 rounded-full bg-pine-500 px-2.5 py-1 text-[11px] font-extrabold text-pine-50">
                <IconCheck className="h-3 w-3" /> cumprida
              </span>
            )}
          </div>
          <div className="mt-3 flex justify-center">
            <Stepper value={goals.weeklyKm} onChange={(v) => onChange({ ...goals, weeklyKm: v })} step={1} min={1} max={200} unit="km/sem" />
          </div>
          <div className="mt-4">
            <Bar value={wk / goals.weeklyKm} className={weeklyDone ? "bg-pine-500" : "bg-ember-500"} />
            <p className="mt-1.5 flex justify-between text-[12px] font-bold text-inksoft tnum">
              <span>semana: {fmtKm(wk)} km</span>
              <span>{Math.min(999, Math.round((wk / goals.weeklyKm) * 100))}%</span>
            </p>
          </div>
        </section>
      </Reveal>

      {/* panorama */}
      <Reveal delay={0.11}>
        <section className="rounded-[1.6rem] bg-pine-900 p-5 text-pine-50 shadow-[0_16px_36px_-16px_rgba(7,31,21,0.6)]">
          <h2 className="flex items-center gap-2 font-display text-lg font-extrabold">
            <IconTarget className="h-5 w-5 text-sun-400" /> Seu panorama
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            {[
              [fmtKm(totalKm), "km acumulados"],
              [fmtDur(totalSec), "tempo caminhado"],
              [fmtKm(best), "melhor semana"],
              [fmtKm(avg), "média por trilha"],
            ].map(([v, l]) => (
              <div key={l} className="rounded-xl bg-pine-800/80 px-4 py-3">
                <p className="font-display text-xl font-extrabold tnum">{v}</p>
                <p className="text-[11px] font-bold uppercase tracking-wide text-pine-300">{l}</p>
              </div>
            ))}
          </div>
          <p className="mt-3.5 text-[12px] font-bold text-pine-300">
            As metas valem para o anel da tela inicial e para as barras do gráfico. Ajuste quando ficar fácil demais. 😉
          </p>
        </section>
      </Reveal>
    </div>
  );
}
FIM_goals

# ---------------------------------------------------------------------
cat > src/views/AchievementsView.tsx <<'FIM_badges'
import { Walk, computeAchievements, isUnlocked, fmtKm } from "../lib";
import { Reveal, ProgressRing, Bar } from "../components/ui";
import { AchievementIcon, IconTrophy } from "../components/Icons";

export default function AchievementsView({ walks }: { walks: Walk[] }) {
  const list = computeAchievements(walks);
  const unlocked = list.filter(isUnlocked).length;

  return (
    <div className="space-y-4">
      <Reveal>
        <header>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-pine-500">Sala de troféus</p>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">Conquistas</h1>
        </header>
      </Reveal>

      <Reveal delay={0.05}>
        <section className="flex items-center gap-4 rounded-[1.6rem] border border-line bg-card p-5 shadow-sm">
          <ProgressRing size={92} stroke={9} value={list.length ? unlocked / list.length : 0} trackClass="stroke-pine-100" barClass="stroke-ember-500">
            <IconTrophy className="h-7 w-7 text-ember-500" />
          </ProgressRing>
          <div>
            <p className="font-display text-2xl font-extrabold tnum">
              {unlocked}<span className="text-lg text-inksoft">/{list.length}</span>
            </p>
            <p className="text-sm font-bold text-inksoft">
              {unlocked === 0
                ? "Nenhuma ainda — a primeira está a uma caminhada de distância."
                : unlocked === list.length
                  ? "Coleção completa! Lenda da trilha. 👑"
                  : "conquistas desbloqueadas"}
            </p>
          </div>
        </section>
      </Reveal>

      <div className="grid grid-cols-2 gap-2.5">
        {list.map((a, i) => {
          const on = isUnlocked(a);
          return (
            <Reveal key={a.id} delay={Math.min(i * 0.04, 0.25)}>
              <article
                className={`relative flex h-full flex-col overflow-hidden rounded-[1.4rem] border p-4 transition-transform hover:-translate-y-0.5 ${
                  on ? "border-sun-300 bg-sun-100" : "border-line bg-card"
                }`}
              >
                {on && (
                  <span className="absolute right-3 top-3 rounded-full bg-ember-500 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-ember-100">
                    sua!
                  </span>
                )}
                <span
                  className={`grid h-11 w-11 place-items-center rounded-full ${
                    on ? "bg-ember-500 text-sun-200" : "bg-paper text-inksoft/50"
                  }`}
                >
                  <AchievementIcon icon={a.icon} className="h-5.5 w-5.5" />
                </span>
                <h2 className={`mt-2.5 font-display text-[15px] font-extrabold leading-tight ${on ? "text-pine-900" : "text-ink"}`}>
                  {a.title}
                </h2>
                <p className="mt-0.5 flex-1 text-[12px] font-bold leading-snug text-inksoft">{a.desc}</p>
                <div className="mt-2.5">
                  {on ? (
                    <p className="text-[11px] font-extrabold uppercase tracking-wide text-ember-600">Desbloqueada ✓</p>
                  ) : (
                    <>
                      <Bar value={a.current / a.target} track="bg-paper" className="bg-pine-300" />
                      <p className="mt-1 text-[11px] font-extrabold text-inksoft tnum">
                        {a.target >= 10 && a.current >= 1 ? fmtKm(a.current, a.current % 1 ? 1 : 0) : Math.floor(a.current)}
                        /{a.target >= 10 && a.target % 1 ? fmtKm(a.target) : a.target}
                      </p>
                    </>
                  )}
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>

      <Reveal delay={0.15}>
        <p className="px-2 pb-1 text-center text-[12px] font-bold text-inksoft">
          As conquistas se atualizam sozinhas a cada caminhada salva.
        </p>
      </Reveal>
    </div>
  );
}
FIM_badges

# =====================================================================
cd ..
echo ""
echo "========================================================="
echo "  PROJETO CRIADO COM SUCESSO na pasta: $(pwd)/$RAIZ"
echo "========================================================="
echo ""
echo "  Proximos passos:"
echo "    cd $RAIZ"
echo "    npm install"
echo "    npm run dev"
echo ""
echo "  Depois abra http://localhost:3000 no navegador."
echo ""
echo "  Para publicar online (gratis): npm run build"
echo "  e suba a pasta dist/ no Netlify, Vercel ou Cloudflare Pages."
echo ""
