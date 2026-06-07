import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { changePassword, safeUserPayload, getById, updateProfile } from "../services/userService.js";

const router = Router();

router.get("/me", requireAuth, async (req, res, next) => {
  try {
    res.json(safeUserPayload(await getById(req.userId)));
  } catch (error) {
    next(error);
  }
});

router.patch("/me", requireAuth, async (req, res, next) => {
  try {
    const user = await updateProfile(req.userId, req.body.name, req.body.avatar, req.body.bio);
    res.json(safeUserPayload(user));
  } catch (error) {
    next(error);
  }
});

router.post("/me/password", requireAuth, async (req, res, next) => {
  try {
    await changePassword(req.userId, req.body.currentPassword, req.body.newPassword);
    res.json({ message: "Password updated." });
  } catch (error) {
    next(error);
  }
});

export default router;
