import { getUserIdFromToken } from "../security/jwtService.js";

export function resolveToken(req) {
  const header = req.get("Authorization");
  if (header?.startsWith("Bearer ")) {
    return header.slice(7);
  }
  return req.cookies?.auth_token || null;
}

export function requireAuth(req, res, next) {
  const userId = getUserIdFromToken(resolveToken(req));
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  req.userId = userId;
  next();
}
