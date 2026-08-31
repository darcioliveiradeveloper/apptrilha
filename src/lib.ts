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
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      const vb = navigator.vibrate;
      if (typeof vb === "function") vb.call(navigator, [ms]);
    }
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
