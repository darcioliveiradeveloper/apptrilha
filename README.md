# Trilha — diário de caminhadas

Agora com **login, cadastro (código de ativação), painel administrador e registro de treinos com GPS (distância, passos, movimento e mapa de deslocamento)**.

## Arquitetura

- **Frontend**: React + Vite (Tailwind v4, framer-motion), atual SPA em `src/`.
- **Backend**: Node + Express + TypeScript (via `tsx`) em `server/`, com **MongoDB Atlas**.
- Single web service: o Express serve a API (`/api`) **e** o build do frontend (`dist/`).

## Requisitos de ambiente (variáveis)

Crie um arquivo `.env` na raiz (já está no `.gitignore`):

```env
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/trilha
JWT_SECRET=<um segredo longo e aleatório>
ADMIN_EMAIL=admin@teste.com
ADMIN_PASSWORD=admin123
PORT=4000
```

O **admin é criado automaticamente** na primeira subida (`ADMIN_EMAIL`/`ADMIN_PASSWORD`), com `isAdmin: true`.

## Rodar localmente

```bash
npm install
npm run build        # gera dist/ do frontend
npm start            # sobe servidor na porta 4000, serve dist + API
```

Para desenvolver com hot-reload (Vite na 3000 com proxy de `/api` para 4000):

```bash
npm run dev          # terminal 1 (frontend)
npm start            # terminal 2 (backend)
```

## Comandos

```bash
npm run typecheck          # typecheck frontend
npm run typecheck:server   # typecheck backend
npm run build              # build frontend (dist/)
npm start                  # roda o servidor (API + SPA)
```

> Teste de integração do backend (`server/test/integration.mjs`) usa `mongodb-memory-server`
> (não instalado por padrão p/ não baixar binário do Mongo no deploy). Reinstele
> `npm i -D mongodb-memory-server` e rode `node server/test/integration.mjs` se quiser validar.

## Fluxo de acesso

- **Cadastro**: exige nome, e-mail, senha e um **código de ativação** (uso **único**).
- **Admin**: `admin@teste.com` / senha do `.env` → painel admin (ícone de escudo no topo) para **gerar**, **listar**, **trocar** e **apagar** códigos.
- Códigos inválidos/usados, e-mails duplicados e acesso de não-admin são rejeitados pelo servidor.

## Deploy no Render

O serviço precisa virar um **web service** (Node) — não mais site estático — e deve rodar:
- **Build**: `npm install && npm run build`
- **Start**: `npm start`
- **Health**: `/api/health`

Variáveis no Render (Dashboard → seu serviço → Environment):
- `MONGODB_URI` (a string do Atlas, ex.: `.../trilha`)
- `JWT_SECRET`
- `ADMIN_EMAIL` (opcional, padrão `admin@teste.com`)
- `ADMIN_PASSWORD`

### Atlas (MongoDB Cloud)
1. Em **Network Access**, adicione o IP do Render (ou `0.0.0.0/0` para acessos totais — não recomendado em produção) e o IP da sua rede local para testar.
2. Em **Database Access**, garanta user/senha corretos.
3. Na connection string, dica: use `&retryWrites=true&w=majority`.

> Observação da rede: em algumas redes restritas o lookup SRV do Atlas é bloqueado
> (`querySrv ECONNREFUSED`). Isso afeta só a máquina/bloqueio; no Render e em redes
> abertas o app conecta normalmente.
