import { useCallback, useEffect, useState } from "react";
import type { ActivationCode } from "../api";
import { apiListCodes, apiCreateCode, apiDeleteCode, apiChangeCode, getToken } from "../api";
import { useAuth } from "../AuthContext";
import { IconCopy, IconPlus, IconTrash, IconRefresh } from "../components/Icons";

export function AdminView() {
  const { user } = useAuth();
  const token = getToken();
  const [codes, setCodes] = useState<ActivationCode[]>([]);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    if (!token) return;
    try {
      const { codes } = await apiListCodes(token);
      setCodes(codes);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erro ao carregar códigos.");
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  const create = async () => {
    if (!token) return;
    setBusy(true);
    setErr("");
    try {
      const { code } = await apiCreateCode(token);
      setCodes((prev) => [code, ...prev]);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erro ao gerar código.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    if (!token) return;
    if (!window.confirm("Apagar este código de ativação?")) return;
    setErr("");
    try {
      await apiDeleteCode(token, id);
      setCodes((prev) => prev.filter((c) => c.id !== id));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erro ao apagar código.");
    }
  };

  const change = async (id: string) => {
    if (!token) return;
    if (!window.confirm("Trocar este código por um novo valor?")) return;
    setErr("");
    try {
      const { code } = await apiChangeCode(token, id);
      setCodes((prev) => prev.map((c) => (c.id === id ? code : c)));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erro ao trocar código.");
    }
  };

  const copy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(code);
      setTimeout(() => setCopied(null), 1600);
    } catch {
      /* noop */
    }
  };

  return (
    <div className="flex flex-col">
      <header className="mb-5 text-center">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-pine-500">Administração</p>
        <h1 className="font-display text-3xl font-extrabold tracking-tight">Códigos de ativação</h1>
        <p className="mt-1 text-sm font-bold text-inksoft">
          Cada código vale para <span className="text-pine-700">um único cadastro</span>.
        </p>
      </header>

      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-bold text-inksoft">
          {codes.filter((c) => !c.usedBy).length} disponível{codes.filter((c) => !c.usedBy).length === 1 ? "" : "is"} ·{" "}
          {codes.length} total
        </p>
        <button
          onClick={create}
          disabled={busy}
          className="press flex items-center gap-1.5 rounded-full bg-pine-900 px-4 py-2.5 text-sm font-extrabold text-sun-300 shadow-[0_10px_22px_-10px_rgba(7,31,21,0.7)] disabled:opacity-60"
        >
          <IconPlus className="h-4 w-4" /> Gerar código
        </button>
      </div>

      {err && <p className="mb-3 rounded-lg bg-ember-100 px-3 py-2 text-[13px] font-bold text-ember-700">{err}</p>}

      {codes.length === 0 ? (
        <div className="rounded-[1.4rem] border border-dashed border-line bg-card px-5 py-10 text-center">
          <p className="text-sm font-bold text-inksoft">
            Nenhum código ainda. Gere o primeiro para liberar um cadastro.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {codes.map((c) => {
            const used = Boolean(c.usedBy);
            return (
              <li
                key={c.id}
                className={`flex items-center justify-between gap-2 rounded-[1.2rem] border bg-card px-4 py-3 ${
                  used ? "border-line opacity-70" : "border-pine-200"
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-lg font-extrabold tracking-[0.2em] text-pine-800">{c.code}</span>
                    <button
                      onClick={() => copy(c.code)}
                      className="press grid h-7 w-7 place-items-center rounded-lg text-inksoft hover:text-pine-700"
                      aria-label="Copiar código"
                    >
                      {copied === c.code ? <span className="text-[11px] font-extrabold text-pine-600">✓</span> : <IconCopy className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className={`mt-0.5 text-[11px] font-bold ${used ? "text-ember-600" : "text-pine-600"}`}>
                    {used ? `Usado · ${new Date(c.usedAt!).toLocaleDateString("pt-BR")}` : "Disponível"}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => change(c.id)}
                    className="press grid h-9 w-9 place-items-center rounded-full border border-line text-pine-700 hover:bg-pine-50"
                    aria-label="Trocar código"
                    title="Trocar código"
                  >
                    <IconRefresh className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => remove(c.id)}
                    className="press grid h-9 w-9 place-items-center rounded-full border border-line text-ember-600 hover:bg-ember-100"
                    aria-label="Apagar código"
                    title="Apagar código"
                  >
                    <IconTrash className="h-4 w-4" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {user && (
        <p className="mt-6 text-center text-[11px] font-bold text-inksoft">Logado como {user.email}</p>
      )}
    </div>
  );
}
