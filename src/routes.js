import express from "express";
import { generateApiKey } from "./utils/utils.js";

const router = express.Router();

router.post("/generate-api-key", async (req, res) => {
  const user = req.session.user;
  console.log(user);
  res.json({
    apiKey: generateApiKey(),
  });
});

export default router;
