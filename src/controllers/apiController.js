import articleQueue from "../utils/queue.js";
import { randomBytes } from "crypto";
import APIKeys from "../models/APIKeys.js";
import { generateApiKey } from "../utils/utils.js";

export const isAuthenticatedApi = async (req, res, next) => {
  const apiKey = req.body["apiKey"];
  console.log(req.body["apiKey"]);
  if (!apiKey) {
    return res.json({ error: "Unauthorized access" });
  }
  const apiKeyInstance = await APIKeys.findOne({
    where: {apiKey: apiKey}
  });
  console.log(apiKeyInstance);
  if (!apiKeyInstance) {
    return res.json({ error: "Unauthorized access" });
  }
  next();
}

export const apiKeyGeneration = async (req, res) => {
  const user = req.session.user;
  if (!user) {
    return res.json({ error: "Unauthorized access" });
  }
  const createdKey = await APIKeys.create({
    userId: user.id,
    apiKey: randomBytes(16).toString("hex"),
    exiresAt: null,
  });
  console.log(createdKey.dataValues.apiKey);
  res.json({
    apiKey: createdKey.dataValues.apiKey,
  });
};

export const addArticleAPI = async (req, res) => {
  const articleLink = req.body.link;
  const apiKey = req.body.apiKey;
  const apiKeyInstance = await APIKeys.findOne({
    where: {apiKey: apiKey}
  });
  const userId = apiKeyInstance.userId;
  try {
    console.log(articleLink);
    await articleQueue.add({ articleLink, userId });
    // Respond with a JSON object indicating success
    res.status(200).json({ message: "Article added successfully!" });
  } catch (error) {
    console.error("Error adding article:", error);
    // Respond with a JSON object indicating failure
    res.status(500).json({ message: "Error adding article" });
  }
};
