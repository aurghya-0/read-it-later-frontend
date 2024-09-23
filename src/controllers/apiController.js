import articleQueue from "../utils/queue.js";
import { randomBytes } from "crypto";
import APIKeys from "../models/APIKeys.js";

export const isAuthenticatedApi = async (req, res, next) => {
  const apiKey = req.body["apiKey"];
  if (!apiKey) {
    return res.json({ error: "Unauthorized access" });
  }
  const apiKeyInstance = await APIKeys.findOne({
    where: {apiKey: apiKey}
  });
  if (!apiKeyInstance) {
    return res.json({ error: "Unauthorized access" });
  }
  next();
}

export const apiKeyGeneration = async (req, res) => {
  const keyName = req.body.keyName;
  const user = req.session.user;
  if (!user) {
    return res.json({ error: "Unauthorized access" });
  }
  const createdKey = await APIKeys.create({
    userId: user.id,
    apiKey: randomBytes(16).toString("hex"),
    keyName: keyName,
    exiresAt: null,
  });
  res.json({
    apiKey: createdKey.dataValues.apiKey,
  });
};

export const addArticleAPI = async (req, res) => {
  console.log(req.body);
  const articleLink = req.body.link;
  const apiKey = req.body.apiKey;
  const apiKeyInstance = await APIKeys.findOne({
    where: {apiKey: apiKey}
  });
  const userId = apiKeyInstance.userId;
  try {
    await articleQueue.add({ articleLink, userId });
    res.status(200).json({ message: "Article added successfully!" });
  } catch (error) {
    console.error("Error adding article:", error);
    res.status(500).json({ message: "Error adding article" });
  }
};
