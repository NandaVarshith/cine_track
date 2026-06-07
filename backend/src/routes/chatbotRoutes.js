import { Router } from "express";
import { getRecommendations } from "../services/chatbotService.js";

const router = Router();

router.post("/", async (req, res, next) => {
  try {
    if (!req.body?.message?.trim()) {
      res.status(400).json({ message: "Message is required." });
      return;
    }
    res.json(await getRecommendations(req.body.message));
  } catch (error) {
    next(error);
  }
});

export default router;
