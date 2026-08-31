import { Router } from "express";
import { randomBytes } from "crypto";
import { ActivationCodeModel } from "../models/ActivationCode";
import { requireAuth, requireAdmin, type AuthedRequest, loadUser } from "../middleware/auth";

const router = Router();

router.use(requireAuth, loadUser, requireAdmin);

function generateCode(): string {
  return randomBytes(4).toString("hex").toUpperCase(); // 8 caracteres, ex.: A1B2C3D4
}

router.get("/", async (_req: AuthedRequest, res) => {
  try {
    const codes = await ActivationCodeModel.find().sort({ createdAt: -1 }).lean();
    return res.json({
      codes: codes.map((c) => ({
        id: String(c._id),
        code: c.code,
        usedBy: c.usedBy,
        usedAt: c.usedAt,
        createdAt: c.createdAt,
      })),
    });
  } catch (err) {
    console.error("[codes] list error:", err);
    return res.status(500).json({ error: "Erro ao listar códigos." });
  }
});

router.post("/", async (_req: AuthedRequest, res) => {
  try {
    const code = generateCode();
    const doc = await ActivationCodeModel.create({ code });
    return res.status(201).json({
      code: {
        id: String(doc._id),
        code: doc.code,
        usedBy: doc.usedBy,
        usedAt: doc.usedAt,
        createdAt: doc.createdAt,
      },
    });
  } catch (err) {
    console.error("[codes] create error:", err);
    return res.status(500).json({ error: "Erro ao gerar código." });
  }
});

router.delete("/:id", async (req: AuthedRequest, res) => {
  try {
    const deleted = await ActivationCodeModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Código não encontrado." });
    return res.json({ ok: true });
  } catch (err) {
    console.error("[codes] delete error:", err);
    return res.status(500).json({ error: "Erro ao apagar código." });
  }
});

router.post("/:id/change", async (req: AuthedRequest, res) => {
  try {
    const doc = await ActivationCodeModel.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Código não encontrado." });
    const newCode = generateCode();
    doc.code = newCode;
    await doc.save();
    return res.json({
      code: { id: String(doc._id), code: doc.code, usedBy: doc.usedBy, usedAt: doc.usedAt, createdAt: doc.createdAt },
    });
  } catch (err) {
    console.error("[codes] change error:", err);
    return res.status(500).json({ error: "Erro ao trocar código." });
  }
});

export default router;
