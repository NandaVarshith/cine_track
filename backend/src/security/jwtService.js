import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET || "dev-secret-please-change-immediately-32b";
const expiresIn = Number(process.env.JWT_EXPIRATION_SECONDS || 86400);

export function generateToken(userId, email) {
  return jwt.sign({ email }, secret, {
    subject: userId.toString(),
    expiresIn,
    algorithm: "HS256",
  });
}

export function getUserIdFromToken(token) {
  if (!token) {
    return null;
  }
  try {
    return jwt.verify(token, secret).sub || null;
  } catch {
    return null;
  }
}
