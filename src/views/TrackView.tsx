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
  createStepDetector,
  type TrackPoint,
} from "../lib";
import { Sheet, TopoLines } from "../components/ui";
import { TrackMap } from "../components/TrackMap";
import { IconPlay, IconPause, IconFlag, IconPin, IconX, MoodFace, IconTimer, IconBolt } from "../components/Icons";

type Phase = "idle" | "running" | "paused" | "done";
type Gps = "off" | "locating" | "on" | "denied";

export interface NewWalk {
  distanceKm: number;
  durationSec: number;
  mood: Mood;
  note?: string;
  date: string;
  startedAt: number;
  steps?: number;
  track?: TrackPoint[];
}

function motionLabel(gps: Gps, moving: boolean): { txt: string; cls: string } {
  if (moving) return { txt: "Em movimento", cls: "border-pine-500 bg-pine-500 text-pine-50 animate-blink" };
  if (gps === "on") return { txt: "GPS ativo · parado", cls: "border-pine-200 bg-pine-50 text-pine-700" };
  return { txt: "Aguardando movimento…", cls: "border-line bg-card text-inksoft" };
}

export default function TrackView({ onSave }: { onSave: (w: NewWalk) => void }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [gps, setGps] = useState<Gps>("off");
  const [meters, setMeters] = useState(0);
  const [steps, setSteps] = useState(0);
  const [moving, setMoving] = useState(false);
  const [points, setPoints] = useState<TrackPoint[]>([]);
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
  const stepsRef = useRef(0);
  const pointsRef = useRef<TrackPoint[]>([]);
  const lastMoveLogRef = useRef(0);
  const motionListenerRef = useRef<((e: DeviceMotionEvent) => void) | null>(null);
  const startedAtRef = useRef(Date.now());

  const stepDetectorRef = useRef(createStepDetector(() => {
    stepsRef.current += 1;
    setSteps(stepsRef.current);
    lastMoveLogRef.current = Date.now();
    setMoving(true);
  }));

  const tellMoving = () => {
    const now = Date.now();
    if (now - lastMoveLogRef.current > 5000) setMoving(false);
  };

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

  const stopMotion = () => {
    if (motionListenerRef.current) {
      window.removeEventListener("devicemotion", motionListenerRef.current as EventListener);
      motionListenerRef.current = null;
    }
  };

  const startMotion = () => {
    if (motionListenerRef.current) return;
    const handler = (e: DeviceMotionEvent) => {
      if (e.accelerationIncludingGravity) stepDetectorRef.current.push(e.accelerationIncludingGravity);
    };
    motionListenerRef.current = handler;
    window.addEventListener("devicemotion", handler as EventListener);
    // fallback de passos pela distância quando não houver acelerômetro
    window.setTimeout(() => {
      if (stepsRef.current === 0 && metersRef.current > 0) {
        const km = metersRef.current / 1000;
        const durH = accRef.current / 3600000;
        const speed = durH > 0 ? km / durH : 0;
        const stride = 0.7;
        const est = Math.floor(metersRef.current / stride);
        if (est > stepsRef.current) {
          stepsRef.current = est;
          setSteps(est);
        }
        }
      }, 4000);
  };

  const registerMotionPermission = async () => {
    const dm = DeviceMotionEvent as unknown as { requestPermission?: () => Promise<string> };
    if (typeof dm.requestPermission === "function") {
      try {
        await dm.requestPermission();
      } catch {
        /* noop */
      }
    }
    startMotion();
  };

  const startWatch = () => {
    if (!("geolocation" in navigator)) {
      console.warn("[TrackView] Geolocation API not available");
      setGps("denied");
      return;
    }
    const isSecure = location.protocol === "https:" || location.hostname === "localhost";
    if (!isSecure) {
      console.warn("[TrackView] Geolocation requires HTTPS");
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
              lastMoveLogRef.current = Date.now();
              setMoving(true);
            }
          }
          lastFixRef.current = pos;
          pointsRef.current = [...pointsRef.current, { lat: pos.coords.latitude, lon: pos.coords.longitude, t: Date.now() }];
          setPoints(pointsRef.current);
        }
      },
      (err) => {
        console.warn("[TrackView] Geolocation error:", err.code, err.message);
        setGps("denied");
      },
      { enableHighAccuracy: true, maximumAge: 1000, timeout: 12000 },
    );
  };

  const start = () => {
    buzz(20);
    accRef.current = 0;
    metersRef.current = 0;
    stepsRef.current = 0;
    pointsRef.current = [];
    lastFixRef.current = null;
    lastMoveLogRef.current = 0;
    stepDetectorRef.current.reset();
    setMeters(0);
    setSteps(0);
    setPoints([]);
    setMoving(false);
    setElapsed(0);
    startedAtRef.current = Date.now();
    tickRef.current = Date.now();
    setPhase("running");
    intervalRef.current = window.setInterval(() => {
      const now = Date.now();
      accRef.current += now - tickRef.current;
      tickRef.current = now;
      setElapsed(accRef.current);
      tellMoving();
    }, 250);
    startWatch();
    void registerMotionPermission();
  };

  const startWithErrorCheck = () => {
    try {
      start();
    } catch (e) {
      console.error("[TrackView] start failed:", e);
      setPhase("running");
    }
  };

  const pause = () => {
    buzz(12);
    const now = Date.now();
    accRef.current += now - tickRef.current;
    setElapsed(accRef.current);
    stopClock();
    stopWatch();
    stopMotion();
    setMoving(false);
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
      tellMoving();
    }, 250);
    startWatch();
    void registerMotionPermission();
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
    stopMotion();
    setMoving(false);
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
    stopMotion();
    accRef.current = 0;
    setElapsed(0);
    setMeters(0);
    setSteps(0);
    setPoints([]);
    setPhase("idle");
    setGps("off");
    setMoving(false);
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
      steps: stepsRef.current || undefined,
      track: pointsRef.current.length > 1 ? pointsRef.current : undefined,
    });
    setSheetOpen(false);
    setPhase("idle");
    metersRef.current = 0;
    setMeters(0);
    setSteps(0);
    setPoints([]);
    setGps("off");
  };

  useEffect(() => () => { stopClock(); stopWatch(); stopMotion(); }, []);

  const gpsKm = meters / 1000;
  const livePace = gpsKm > 0.15 ? fmtPace(elapsed / 1000, gpsKm) : null;
  const mov = motionLabel(gps, moving);

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
              <button onClick={startWithErrorCheck} aria-label="Iniciar caminhada" className="press group relative grid h-52 w-52 place-items-center">
                <span className="absolute inset-0 rounded-full bg-pine-900/10 animate-breathe" />
                <span className="absolute inset-3 rounded-full bg-pine-900/15 animate-breathe [animation-delay:0.6s]" />
                <span className="relative grid h-40 w-40 place-items-center rounded-full bg-pine-900 text-sun-400 shadow-[0_24px_50px_-16px_rgba(7,31,21,0.6)] transition-transform group-hover:scale-[1.03]">
                  <IconPlay className="h-14 w-14 translate-x-1" />
                </span>
              </button>
              <p className="mt-6 max-w-[26ch] text-center text-sm font-bold text-inksoft">
                Toque para iniciar. O tempo corre aqui; a distância, os passos e o mapa vêm do GPS — ou você digita no final.
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
                  <div className="flex items-center justify-center gap-2">
                    <span className="flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.2em] text-pine-300">
                      <IconTimer className="h-4 w-4" /> tempo de trilha
                    </span>
                    <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider ${mov.cls}`}>
                      <IconBolt className="h-3.5 w-3.5" /> {mov.txt}
                    </span>
                  </div>
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
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-pine-300">passos</p>
                      <p className="font-display text-xl font-extrabold tnum">
                        {steps > 0 ? steps.toLocaleString("pt-BR") : "—"}
                      </p>
                    </div>
                    <div className="rounded-xl bg-pine-800/85 px-4 py-2.5">
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-pine-300">ritmo</p>
                      <p className="font-display text-xl font-extrabold tnum">{livePace ? `${livePace}/km` : "—"}</p>
                    </div>
                  </div>
                  {gps === "denied" && (
                    <p className="mt-3 text-xs font-bold text-sun-300 bg-sun-600/20 px-3 py-1.5 rounded-full inline-block animate-blink">
                      GPS indisponível — o tempo roda normal, insira a distância ao concluir
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-5">
                <TrackMap points={points} />
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
            ["2", "Caminhe — o GPS soma distância, passos e o mapa"],
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

        {points.length > 1 && (
          <div className="mt-4">
            <TrackMap points={points} />
          </div>
        )}

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
