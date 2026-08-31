import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import BottomNav, { type View } from "./components/BottomNav";
import { Toasts, type ToastMsg, TopoLines, ErrorBoundary } from "./components/ui";
import { IconFoot, IconLogout, IconShield, IconUser } from "./components/Icons";
import HomeView from "./views/HomeView";
import TrackView, { type NewWalk } from "./views/TrackView";
import HistoryView from "./views/HistoryView";
import GoalsView from "./views/GoalsView";
import AchievementsView from "./views/AchievementsView";
import { LoginView, RegisterView } from "./views/AuthViews";
import { AdminView } from "./views/AdminView";
import { AuthProvider, useAuth } from "./AuthContext";
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

function Splash() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-paper">
      <div className="flex flex-col items-center gap-3">
        <span className="grid h-16 w-16 animate-breathe place-items-center rounded-3xl bg-pine-900 text-sun-400">
          <IconFoot className="h-8 w-8" />
        </span>
        <p className="font-display text-xl font-extrabold tracking-tight text-pine-800">Trilha.</p>
      </div>
    </div>
  );
}

function Gate() {
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");

  // ao sair, volta sempre para a tela de login (não para o cadastro)
  useEffect(() => {
    if (!user) setMode("login");
  }, [user]);

  if (loading) return <Splash />;
  if (!user) {
    return mode === "login" ? (
      <LoginView onShowRegister={() => setMode("register")} />
    ) : (
      <RegisterView onShowLogin={() => setMode("login")} />
    );
  }
  return <AppShell />;
}

function AppShell() {
  const { user, logout } = useAuth();
  const [view, setView] = useState<View>("home");
  const [adminOpen, setAdminOpen] = useState(false);
  const [walks, setWalks] = useState<Walk[]>(() => loadWalks());
  const [goals, setGoals] = useState<Goals>(() => loadGoals());
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const toastId = useRef(0);

  useEffect(() => { saveWalks(walks); }, [walks]);
  useEffect(() => { saveGoals(goals); }, [goals]);
  useEffect(() => { window.scrollTo({ top: 0 }); }, [view, adminOpen]);

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
        <TopoLines className="pointer-events-none absolute inset-x-0 top-20 h-60 w-full text-pine-300/25" />

        {/* marca */}
        <div className="relative flex items-center justify-between gap-2 px-5 pt-[max(1.1rem,env(safe-area-inset-top))]">
          <button
            onClick={() => { setAdminOpen(false); setView("home"); }}
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

          <div className="flex items-center gap-1.5">
            <span className="hidden rounded-full border border-line bg-card px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-inksoft min-[480px]:block">
              diário de caminhadas
            </span>
            {user?.isAdmin && (
              <button
                onClick={() => { setAdminOpen((v) => !v); setView("home"); }}
                className={`press grid h-9 w-9 place-items-center rounded-full border shadow-sm ${
                  adminOpen ? "border-pine-800 bg-pine-900 text-sun-400" : "border-pine-200 bg-card text-pine-700"
                }`}
                aria-label="Painel do administrador"
                title="Painel do administrador"
              >
                <IconShield className="h-[18px] w-[18px]" />
              </button>
            )}
            <div className="flex items-center gap-1.5 rounded-full border border-line bg-card py-1 pl-2.5 pr-1 shadow-sm">
              <IconUser className="h-3.5 w-3.5 text-inksoft" />
              <span className="hidden max-w-[90px] truncate text-[11px] font-extrabold text-pine-800 sm:block">
                {user?.name}
              </span>
              <button
                onClick={logout}
                className="press grid h-7 w-7 place-items-center rounded-full bg-ember-100 text-ember-600"
                aria-label="Sair"
                title="Sair"
              >
                <IconLogout className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* conteúdo */}
        <main className="relative flex-1 px-5 pb-10 pt-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={adminOpen ? "admin" : view}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {adminOpen ? (
                <AdminView />
              ) : (
                <>
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
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {!adminOpen && <BottomNav view={view} onChange={setView} />}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Gate />
      </AuthProvider>
    </ErrorBoundary>
  );
}
