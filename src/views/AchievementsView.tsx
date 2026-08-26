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
