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
