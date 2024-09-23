import articleQueue from "../utils/queue.js";
import bcrypt from "bcrypt";
import APIKeys from "../models/APIKeys.js";
import { generateApiKey } from "../utils/utils.js";

export const generateApiKey = async (req, res) => {
  const secret = "my-secret-salt";
  const user = req.session.user;
  if (!user) {
    return res.json({ error: "Unauthorized access" });
  }
  const rawApiKey = generateApiKey();
  const hashedApiKey = await bcrypt.hash(rawApiKey, secret);
  const newApiKey = await APIKeys.create({
    userId: user.id,
    apiKey: hashedApiKey,
    exiresAt: null,
  });
  
  res.json({
    apiKey: generateApiKey(),
  });
};

export const addArticleAPI = async (req, res) => {
  const articleLink = req.body.link; // Accessing the link sent from the popup.js
  const userId = 1;

  try {
    await articleQueue.add({ articleLink, userId });
    // Respond with a JSON object indicating success
    res.status(200).json({ message: "Article added successfully!" });
  } catch (error) {
    console.error("Error adding article:", error);
    // Respond with a JSON object indicating failure
    res.status(500).json({ message: "Error adding article" });
  }
};
