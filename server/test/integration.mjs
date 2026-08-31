import { MongoMemoryServer } from "mongodb-memory-server";
import { execFile } from "child_process";
import { setTimeout as delay } from "timers/promises";

const mongod = await MongoMemoryServer.create();
const uri = mongod.getUri("trilha_test");
console.log("[test] memory mongo:", uri);

const PORT = 4399;
const env = {
  ...process.env,
  MONGODB_URI: uri,
  JWT_SECRET: "test-secret",
  ADMIN_EMAIL: "admin@teste.com",
  ADMIN_PASSWORD: "admin123",
  PORT: String(PORT),
};

const serverProc = execFile(
  process.execPath,
  ["--import", "tsx", "server/src/server.ts"],
  { cwd: process.cwd(), env },
);
let out = "";
serverProc.stdout.on("data", (d) => (out += d.toString()));
serverProc.stderr.on("data", (d) => (out += d.toString()));

async function waitForPort() {
  for (let i = 0; i < 40; i++) {
    try {
      const r = await fetch(`http://localhost:${PORT}/api/health`);
      if (r.ok) return;
    } catch {}
    await delay(500);
  }
  throw new Error("server did not start\n" + out);
}

const BASE = `http://localhost:${PORT}/api`;
async function j(path, opts = {}) {
  const res = await fetch(BASE + path, {
    ...opts,
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
  });
  const body = await res.json().catch(() => ({}));
  return { status: res.status, body };
}

let pass = 0, fail = 0;
function ok(cond, msg) {
  if (cond) { pass++; console.log("  ✓", msg); }
  else { fail++; console.log("  ✗", msg); }
}

try {
  await waitForPort();
  console.log("[test] server up\n");

  // 1. admin seed login
  console.log("\n## Login admin");
  let r = await j("/auth/login", { method: "POST", body: JSON.stringify({ email: "admin@teste.com", password: "admin123" }) });
  ok(r.status === 200 && r.body.user?.isAdmin === true, "admin loga (admin@teste.com/admin123)");
  const adminToken = r.body.token;

  // 2. admin cria código
  console.log("\n## Admin gera código");
  r = await j("/codes", { method: "POST", headers: { Authorization: `Bearer ${adminToken}` } });
  ok(r.status === 201 && r.body.code?.code, "admin gera código");
  const code = r.body.code.code;

  // 3. registra usuário com o código
  console.log("\n## Registro com código");
  r = await j("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name: "Carol", email: "carol@teste.com", password: "senha123", code }),
  });
  ok(r.status === 201 && r.body.user?.isAdmin === false, "registro com código funciona");
  const userToken = r.body.token;

  // 4. código usado não pode reutilizar
  console.log("\n## Código é de uso único");
  r = await j("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name: "Bob", email: "bob@teste.com", password: "senha123", code }),
  });
  ok(r.status === 400 && /já foi usado/.test(r.body.error || ""), "código usado é rejeitado no 2º cadastro");

  // 5. código inválido
  r = await j("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name: "Bob", email: "bob@teste.com", password: "senha123", code: "ZZZZ9999" }),
  });
  ok(r.status === 400, "código inválido é rejeitado");

  // 6. login usuário
  r = await j("/auth/login", { method: "POST", body: JSON.stringify({ email: "carol@teste.com", password: "senha123" }) });
  ok(r.status === 200, "usuário loga");

  // 7. usuário comum NÃO acessa endpooints admin
  console.log("\n## Proteção admin");
  r = await j("/codes", { headers: { Authorization: `Bearer ${userToken}` } });
  ok(r.status === 403, "usuário comum não lista códigos (403)");

  // 8. sem token
  r = await j("/codes");
  ok(r.status === 401, "sem token é 401");

  // 9. admin troca código
  console.log("\n## Trocar código");
  r = await j("/codes", { headers: { Authorization: `Bearer ${adminToken}` } });
  const id = r.body.codes[0].id;
  r = await j(`/codes/${id}/change`, { method: "POST", headers: { Authorization: `Bearer ${adminToken}` } });
  ok(r.status === 200 && r.body.code?.code && r.body.code.code !== code, "admin troca código");

  // 10. admin apaga código
  r = await j("/codes", { headers: { Authorization: `Bearer ${adminToken}` } });
  const freshId = r.body.codes[0].id;
  r = await j(`/codes/${freshId}`, { method: "DELETE", headers: { Authorization: `Bearer ${adminToken}` } });
  ok(r.status === 200, "admin apaga código");

  // 11. email duplicado
  r = await j("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name: "Carol2", email: "carol@teste.com", password: "senha123", code: "ABCDEF12" }),
  });
  ok(r.status === 409, "email duplicado é 409");

} catch (err) {
  console.error("[test] FATAL:", err.message);
  fail++;
} finally {
  serverProc.kill();
  await mongod.stop();
}

console.log(`\n=== ${pass} passou, ${fail} falhou ===`);
process.exit(fail > 0 ? 1 : 0);
