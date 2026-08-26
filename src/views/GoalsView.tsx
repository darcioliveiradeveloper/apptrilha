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
