import { Router } from "express";
import { authenticate, register } from "../services/authService.js";
import { generateToken } from "../security/jwtService.js";

const router = Router();

function cookieOptions(maxAge) {
  return {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge,
  };
}

router.post("/register", async (req, res, next) => {
  try {
    const user = await register(req.body.name, req.body.email, req.body.password);
    res.json({ id: user.id, name: user.name, email: user.email });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const user = await authenticate(req.body.email, req.body.password);
    const token = generateToken(user.id, user.email);
    res.cookie("auth_token", token, cookieOptions(24 * 60 * 60 * 1000));
    res.json({ id: user.id, name: user.name, email: user.email, token });
  } catch (error) {
    next(error);
  }
});

router.post("/logout", (_req, res) => {
  res.cookie("auth_token", "", cookieOptions(0));
  res.json({ message: "Logged out." });
});

export default router;
