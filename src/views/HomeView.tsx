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
import ExportCard from "../components/ExportCard";

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

      {/* baixar o projeto */}
      <ExportCard />
    </div>
  );
}
