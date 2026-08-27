import { useState } from "react";
import { buzz } from "../lib";
import { Reveal, TopoLines } from "./ui";
import { IconDownload, IconCheck, IconCopy, IconTerminal } from "./Icons";

const RUN_LINES = [
  { cmd: "npm install", hint: "instala as dependências" },
  { cmd: "npm run dev", hint: "sobe o app em localhost:3000" },
];

export default function ExportCard() {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const handleDownload = async () => {
    buzz(16);
    setBusy(true);
    try {
      const { downloadProjectZip } = await import("../exporter");
      await downloadProjectZip();
      setDone(true);
      window.setTimeout(() => setDone(false), 2800);
    } catch {
      /* tratado pelo chamador */
    } finally {
      setBusy(false);
    }
  };

  const copy = async (text: string) => {
    buzz(8);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      setCopied(null);
    }
  };

  return (
    <Reveal delay={0.16}>
      <section className="relative overflow-hidden rounded-[1.6rem] bg-pine-950 p-5 text-pine-50 shadow-[0_20px_44px_-18px_rgba(7,31,21,0.7)]">
        <TopoLines className="pointer-events-none absolute inset-0 h-full w-full text-pine-800/60" />
        <div className="pointer-events-none absolute -left-10 -bottom-16 h-40 w-40 rounded-full bg-ember-500/15 blur-2xl" />

        <div className="relative">
          <p className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-sun-400">
            <IconTerminal className="h-4 w-4" /> código-fonte
          </p>
          <h2 className="mt-1 font-display text-[1.55rem] font-extrabold leading-tight tracking-tight">
            Leve o Trilha com você
          </h2>
          <p className="mt-1.5 text-sm font-semibold leading-relaxed text-pine-300">
            Baixe o projeto inteiro em um <strong className="text-pine-50">.zip</strong> para rodar no seu
            computador ou publicar no GitHub — sem precisar copiar arquivo por arquivo.
          </p>

          <button
            onClick={handleDownload}
            disabled={busy}
            className="press mt-4 flex w-full items-center justify-center gap-2.5 rounded-full bg-ember-500 py-3.5 font-display text-base font-extrabold text-card shadow-[0_12px_28px_-10px_rgba(232,83,42,0.8)] transition-colors hover:bg-ember-600 disabled:opacity-60"
          >
            {done ? (
              <>
                <IconCheck className="h-5 w-5" /> Download iniciado!
              </>
            ) : busy ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-card/40 border-t-card" />
                Preparando…
              </>
            ) : (
              <>
                <IconDownload className="h-5 w-5" /> Baixar trilha-app.zip
              </>
            )}
          </button>

          <div className="mt-4 overflow-hidden rounded-xl border border-pine-800 bg-pine-900/70">
            <div className="flex items-center gap-1.5 border-b border-pine-800 px-3 py-2">
              <span className="h-2.5 w-2.5 rounded-full bg-ember-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-sun-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-pine-400/70" />
              <span className="ml-2 text-[11px] font-extrabold uppercase tracking-wider text-pine-400">depois de descompactar</span>
            </div>
            <div className="divide-y divide-pine-800/70">
              {RUN_LINES.map((l) => {
                const isCopied = copied === l.cmd;
                return (
                  <div key={l.cmd} className="flex items-center gap-2 px-3 py-2.5">
                    <code className="flex-1 font-mono text-[13px] font-bold text-sun-300">
                      <span className="mr-1.5 select-none text-pine-500">$</span>
                      {l.cmd}
                    </code>
                    <span className="hidden text-[11px] font-bold text-pine-400 min-[380px]:inline">{l.hint}</span>
                    <button
                      onClick={() => copy(l.cmd)}
                      aria-label={`Copiar ${l.cmd}`}
                      className="press grid h-7 w-7 shrink-0 place-items-center rounded-full text-pine-300 transition-colors hover:bg-pine-800 hover:text-sun-300"
                    >
                      {isCopied ? <IconCheck className="h-3.5 w-3.5 text-pine-300" /> : <IconCopy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="mt-3 text-[12px] font-bold leading-relaxed text-pine-400">
            Precisa do <strong className="text-pine-200">Node.js 18+</strong> instalado. O passo a passo completo
            (inclusive para o GitHub) vai dentro do ZIP, no README.
          </p>
        </div>
      </section>
    </Reveal>
  );
}
