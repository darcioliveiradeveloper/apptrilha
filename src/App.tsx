import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import BottomNav, { type View } from "./components/BottomNav";
import { Toasts, type ToastMsg, TopoLines, ErrorBoundary } from "./components/ui";
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
          <span className="hidden rounded-full border border-line bg-card px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-inksoft min-[480px]:block">
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
