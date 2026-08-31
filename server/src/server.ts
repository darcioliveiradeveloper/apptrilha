import "dotenv/config";
import express, { type Express } from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync } from "fs";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import authRoutes from "./routes/auth";
import codesRoutes from "./routes/codes";
import { UserModel } from "./models/User";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app: Express = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, t: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/codes", codesRoutes);

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL || "admin@teste.com";
  const password = process.env.ADMIN_PASSWORD || "admin123";
  const exists = await UserModel.findOne({ email });
  if (!exists) {
    const passwordHash = await bcrypt.hash(password, 10);
    await UserModel.create({ name: "Administrador", email, passwordHash, isAdmin: true });
    console.log(`[seed] admin criado: ${email}`);
  } else {
    console.log(`[seed] admin já existe: ${email}`);
  }
}

const PORT = parseInt(process.env.PORT || "4000", 10);
const MONGODB_URI = process.env.MONGODB_URI;

async function main() {
  if (!MONGODB_URI) {
    console.error("[server] MONGODB_URI não definida. Configure no Render (ou .env).");
  } else {
    try {
      await mongoose.connect(MONGODB_URI);
      console.log("[server] MongoDB conectado");
      await seedAdmin();
    } catch (err) {
      console.error("[server] falha ao conectar no MongoDB:", (err as Error).message);
    }
  }

  // serve o frontend buildado (SPA) caso exista dist/
  const distDir = join(__dirname, "..", "..", "dist");
  if (existsSync(distDir)) {
    app.use(express.static(distDir));
    // fallback SPA: rotas não-API servem o index.html
    app.use((req, res, next) => {
      if (req.path.startsWith("/api/")) return next();
      res.sendFile(join(distDir, "index.html"));
    });
  }

  app.listen(PORT, () => {
    console.log(`[server] rodando em http://localhost:${PORT}`);
    if (!MONGODB_URI) console.log("[server] ATENÇÃO: sem banco — autenticação não funcionará.");
  });
}

main().catch((err) => {
  console.error("[server] falha ao iniciar:", err);
  process.exit(1);
});
