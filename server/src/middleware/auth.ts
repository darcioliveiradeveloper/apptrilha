import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

export interface AuthPayload {
  userId: string;
  email: string;
  isAdmin: boolean;
}

export interface AuthedRequest extends Request {
  user?: AuthPayload;
}

export function signToken(payload: AuthPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });
}

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: "Você precisa estar logado." });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET) as AuthPayload;
    req.user = payload;
    return next();
  } catch {
    return res.status(401).json({ error: "Sessão expirada. Faça login novamente." });
  }
}

export function requireAdmin(req: AuthedRequest, res: Response, next: NextFunction) {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ error: "Acesso restrito ao administrador." });
  }
  return next();
}

export async function loadUser(req: AuthedRequest, _res: Response, next: NextFunction) {
  if (req.user) {
    const u = await UserModel.findById(req.user.userId).lean();
    if (u) {
      req.user = { userId: String(u._id), email: u.email, isAdmin: u.isAdmin };
    }
  }
  return next();
}
