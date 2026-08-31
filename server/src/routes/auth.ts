import { Router } from "express";
import bcrypt from "bcryptjs";
import { UserModel } from "../models/User";
import { ActivationCodeModel } from "../models/ActivationCode";
import { signToken, requireAuth, type AuthedRequest } from "../middleware/auth";

const router = Router();

function normalizeCode(raw: string): string {
  return raw.trim().toUpperCase();
}

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, code } = req.body || {};
    const nName = typeof name === "string" ? name.trim() : "";
    const nEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    const nPassword = typeof password === "string" ? password : "";
    const nCode = normalizeCode(String(code ?? ""));

    if (nName.length < 2) return res.status(400).json({ error: "Informe seu nome." });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nEmail)) return res.status(400).json({ error: "Informe um e-mail válido." });
    if (nPassword.length < 6) return res.status(400).json({ error: "A senha precisa de pelo menos 6 caracteres." });
    if (nCode.length < 6) return res.status(400).json({ error: "Informe o código de ativação." });

    const existing = await UserModel.findOne({ email: nEmail });
    if (existing) return res.status(409).json({ error: "Este e-mail já está cadastrado." });

    const activation = await ActivationCodeModel.findOne({ code: nCode });
    if (!activation) return res.status(400).json({ error: "Código de ativação inválido." });
    if (activation.usedBy) return res.status(400).json({ error: "Este código já foi usado." });

    const passwordHash = await bcrypt.hash(nPassword, 10);
    const user = await UserModel.create({ name: nName, email: nEmail, passwordHash, isAdmin: false });

    activation.usedBy = String(user._id);
    activation.usedAt = new Date();
    await activation.save();

    const token = signToken({ userId: String(user._id), email: user.email, isAdmin: user.isAdmin });
    return res.status(201).json({
      token,
      user: { id: String(user._id), name: user.name, email: user.email, isAdmin: user.isAdmin },
    });
  } catch (err) {
    console.error("[auth] register error:", err);
    return res.status(500).json({ error: "Erro ao cadastrar. Tente novamente." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const nEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    const nPassword = typeof password === "string" ? password : "";

    if (!nEmail || !nPassword) return res.status(400).json({ error: "Informe e-mail e senha." });

    const user = await UserModel.findOne({ email: nEmail });
    if (!user) return res.status(401).json({ error: "E-mail ou senha incorretos." });

    const ok = await bcrypt.compare(nPassword, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "E-mail ou senha incorretos." });

    const token = signToken({ userId: String(user._id), email: user.email, isAdmin: user.isAdmin });
    return res.json({
      token,
      user: { id: String(user._id), name: user.name, email: user.email, isAdmin: user.isAdmin },
    });
  } catch (err) {
    console.error("[auth] login error:", err);
    return res.status(500).json({ error: "Erro ao entrar. Tente novamente." });
  }
});

router.get("/me", requireAuth, async (req: AuthedRequest, res) => {
  try {
    const user = await UserModel.findById(req.user?.userId).lean();
    if (!user) return res.status(401).json({ error: "Usuário não encontrado." });
    return res.json({
      user: { id: String(user._id), name: user.name, email: user.email, isAdmin: user.isAdmin },
    });
  } catch (err) {
    return res.status(500).json({ error: "Erro ao carregar sua sessão." });
  }
});

export default router;
