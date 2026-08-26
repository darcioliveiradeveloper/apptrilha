import JSZip from "jszip";

/* ---------- código-fonte do projeto, embutido como texto ---------- */

// raiz
import indexHtml from "../index.html?raw";
import packageJson from "../package.json?raw";
import tsconfig from "../tsconfig.json?raw";
import viteConfig from "../vite.config.js?raw";

// src
import mainTsx from "./main.tsx?raw";
import appTsx from "./App.tsx?raw";
import libTs from "./lib.ts?raw";
import indexCss from "./index.css?raw";
import viteEnv from "./vite-env.d.ts?raw";
import exporterSelf from "./exporter.ts?raw";

// components
import bottomNavTsx from "./components/BottomNav.tsx?raw";
import iconsTsx from "./components/Icons.tsx?raw";
import uiTsx from "./components/ui.tsx?raw";
import exportCardTsx from "./components/ExportCard.tsx?raw";

// views
import achievementsTsx from "./views/AchievementsView.tsx?raw";
import goalsTsx from "./views/GoalsView.tsx?raw";
import historyTsx from "./views/HistoryView.tsx?raw";
import homeTsx from "./views/HomeView.tsx?raw";
import trackTsx from "./views/TrackView.tsx?raw";

const PROJECT_FILES: Record<string, string> = {
  "index.html": indexHtml,
  "package.json": packageJson,
  "tsconfig.json": tsconfig,
  "vite.config.js": viteConfig,
  "src/main.tsx": mainTsx,
  "src/App.tsx": appTsx,
  "src/lib.ts": libTs,
  "src/index.css": indexCss,
  "src/vite-env.d.ts": viteEnv,
  "src/exporter.ts": exporterSelf,
  "src/components/BottomNav.tsx": bottomNavTsx,
  "src/components/Icons.tsx": iconsTsx,
  "src/components/ui.tsx": uiTsx,
  "src/components/ExportCard.tsx": exportCardTsx,
  "src/views/AchievementsView.tsx": achievementsTsx,
  "src/views/GoalsView.tsx": goalsTsx,
  "src/views/HistoryView.tsx": historyTsx,
  "src/views/HomeView.tsx": homeTsx,
  "src/views/TrackView.tsx": trackTsx,
};

const README = [
  "# Trilha — diário de caminhadas",
  "",
  "App mobile-first para registrar caminhadas: cronômetro + GPS, histórico,",
  "metas e conquistas. Feito com React + TypeScript + Vite + Tailwind CSS v4.",
  "",
  "## Rodando localmente",
  "",
  "    npm install",
  "    npm run dev",
  "",
  "Depois abra http://localhost:3000 no navegador.",
  "Dica: ative o modo de celular (responsivo) no DevTools para ver como fica no telefone.",
  "",
  "## Build de produção",
  "",
  "    npm run build",
  "",
  "## Enviando para o GitHub",
  "",
  "    git init",
  "    git add .",
  "    git commit -m \"App Trilha - diário de caminhadas\"",
  "    git branch -M main",
  "    git remote add origin https://github.com/SEU-USUARIO/trilha-app.git",
  "    git push -u origin main",
  "",
  "## Observações",
  "",
  "- O GPS do celular só funciona em páginas seguras (https) ou em localhost.",
  "- Se o GPS for negado, o app permite digitar a distância manualmente.",
  "- As caminhadas ficam salvas no navegador (localStorage) do dispositivo.",
  "",
].join("\n");

const GITIGNORE = ["node_modules", "dist", "*.log", ".DS_Store", ""].join("\n");

/* ---------- geração e download do .zip ---------- */

export async function buildProjectZip(): Promise<Blob> {
  const zip = new JSZip();
  for (const [path, content] of Object.entries(PROJECT_FILES)) {
    zip.file(path, content);
  }
  zip.file("README.md", README);
  zip.file(".gitignore", GITIGNORE);
  return zip.generateAsync({ type: "blob" });
}

export async function downloadProjectZip(): Promise<void> {
  const blob = await buildProjectZip();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "trilha-app.zip";
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
}
