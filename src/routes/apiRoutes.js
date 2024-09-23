import express from "express";
import { addArticleAPI } from "../controllers/apiController.js";
import { generateApiKey } from "../utils/utils.js";

const router = express.Router();

// Key Generation
router.post("/generate-api-key", async (req, res) => {
  const user = req.session.user;
  if (!user) {
    return res.json({ error: "Unauthorized access" });
  }
  res.json({
    apiKey: generateApiKey(),
  });
});

router.post("/api/add-article", addArticleAPI);
export default router;
