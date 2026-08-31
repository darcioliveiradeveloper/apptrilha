import { useState, type FormEvent, type ReactNode } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../AuthContext";
import { IconFoot, IconChevronR } from "../components/Icons";
import { TopoLines } from "../components/ui";

function Shell({ children, subtitle }: { children: ReactNode; subtitle: string }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <div className="relative mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-paper">
        <TopoLines className="pointer-events-none absolute inset-x-0 top-0 h-64 w-full text-pine-300/30" />
        <div className="relative flex flex-1 flex-col justify-center px-6 py-10">
          <div className="mb-8 flex flex-col items-center text-center">
            <span className="grid h-14 w-14 place-items-center rounded-3xl bg-pine-900 text-sun-400 shadow-[0_10px_24px_-8px_rgba(7,31,21,0.65)]">
              <IconFoot className="h-7 w-7" />
            </span>
            <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight">
              Trilha<span className="text-ember-500">.</span>
            </h1>
            <p className="mt-1 text-sm font-bold text-inksoft">{subtitle}</p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-line bg-card px-4 py-3 text-[15px] font-bold outline-none transition focus:border-pine-500 focus:ring-2 focus:ring-pine-200";

export function LoginView({ onShowRegister }: { onShowRegister: () => void }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      await login(email, password);
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "Falha ao entrar.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Shell subtitle="Seu diário de caminhadas começa aqui.">
      <form onSubmit={submit} className="flex flex-col gap-3">
        <label className="block">
          <span className="mb-1 block text-[11px] font-extrabold uppercase tracking-wider text-inksoft">E-mail</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="voce@email.com"
            autoComplete="email"
            className={inputCls}
            required
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-[11px] font-extrabold uppercase tracking-wider text-inksoft">Senha</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            className={inputCls}
            required
          />
        </label>

        {err && <p className="rounded-lg bg-ember-100 px-3 py-2 text-[13px] font-bold text-ember-700">{err}</p>}

        <button
          type="submit"
          disabled={busy}
          className="press mt-1 flex items-center justify-center gap-2 rounded-full bg-pine-900 py-3.5 font-display text-lg font-extrabold text-sun-300 shadow-[0_14px_30px_-12px_rgba(7,31,21,0.7)] disabled:opacity-60"
        >
          {busy ? "Entrando…" : "Entrar"}
          <IconChevronR className="h-4 w-4" />
        </button>
      </form>

      <p className="mt-6 text-center text-sm font-bold text-inksoft">
        Ainda não tem conta?{" "}
        <button onClick={onShowRegister} className="font-extrabold text-pine-700 underline decoration-pine-300 underline-offset-2">
          Cadastre-se
        </button>
      </p>
    </Shell>
  );
}

export function RegisterView({ onShowLogin }: { onShowLogin: () => void }) {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      await register({ name, email, password, code });
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "Falha ao cadastrar.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Shell subtitle="Crie sua conta com seu código de ativação.">
      <form onSubmit={submit} className="flex flex-col gap-3">
        <label className="block">
          <span className="mb-1 block text-[11px] font-extrabold uppercase tracking-wider text-inksoft">Nome</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome"
            autoComplete="name"
            className={inputCls}
            required
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-[11px] font-extrabold uppercase tracking-wider text-inksoft">E-mail</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="voce@email.com"
            autoComplete="email"
            className={inputCls}
            required
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-[11px] font-extrabold uppercase tracking-wider text-inksoft">Senha</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            autoComplete="new-password"
            className={inputCls}
            required
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-[11px] font-extrabold uppercase tracking-wider text-inksoft">Código de ativação</span>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Ex.: A1B2C3D4"
            autoCapitalize="characters"
            className={`${inputCls} font-display tracking-[0.25em]`}
            required
          />
        </label>

        {err && <p className="rounded-lg bg-ember-100 px-3 py-2 text-[13px] font-bold text-ember-700">{err}</p>}

        <button
          type="submit"
          disabled={busy}
          className="press mt-1 flex items-center justify-center gap-2 rounded-full bg-pine-900 py-3.5 font-display text-lg font-extrabold text-sun-300 shadow-[0_14px_30px_-12px_rgba(7,31,21,0.7)] disabled:opacity-60"
        >
          {busy ? "Criando…" : "Criar conta"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm font-bold text-inksoft">
        Já tem conta?{" "}
        <button onClick={onShowLogin} className="font-extrabold text-pine-700 underline decoration-pine-300 underline-offset-2">
          Fazer login
        </button>
      </p>
    </Shell>
  );
}
