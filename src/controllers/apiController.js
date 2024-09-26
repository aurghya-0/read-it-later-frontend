import articleQueue from "../utils/queue.js";
import { randomBytes } from "crypto";
import APIKeys from "../models/APIKeys.js";
import Article from "../models/Article.js";

export const isAuthenticatedApi = async (req, res, next) => {
  const apiKey = req.body["apiKey"];
  if (!apiKey) {
    return res.json({ error: "Unauthorized access" });
  }
  const apiKeyInstance = await APIKeys.findOne({
    where: { apiKey: apiKey },
  });
  if (!apiKeyInstance) {
    return res.json({ error: "Unauthorized access" });
  }
  next();
};

// Only api which relies on session based authentication
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
  const articleLink = req.body.link;
  const apiKey = req.body.apiKey;
  if (!apiKey) {
    return res.json({ message: "Error Unauthorized access" });
  }
  const apiKeyInstance = await APIKeys.findOne({
    where: { apiKey: apiKey },
  });
  if (!apiKeyInstance) {
    return res.json({ message: "Error Unauthorized access" });
  }
  const userId = apiKeyInstance.userId;
  try {
    await articleQueue.add({ articleLink, userId });
    res.status(200).json({ message: "Article added successfully!" });
  } catch (error) {
    console.error("Error adding article:", error);
    res.status(500).json({ message: "Error adding article" });
  }
};

export const getAllArticles = async (req, res) => {
  const apiKey = req.body.apiKey;
  if (!apiKey) {
    return res.json({ error: "Unauthorized access" });
  }
  const apiKeyInstance = await APIKeys.findOne({
    where: { apiKey: apiKey },
  });
  if (!apiKeyInstance) {
    return res.json({ error: "Unauthorized access" });
  }
  const userId = apiKeyInstance.userId;
  const articles = await Article.findAll({
    where: { userId: userId },
  });
  res.status(200).json(articles);
};

export const getArticle = async (req, res) => {
  const apiKey = req.body.apiKey;
  if (!apiKey) {
    return res.json({ error: "Unauthorized access" });
  }
  const apiKeyInstance = await APIKeys.findOne({
    where: { apiKey: apiKey },
  });
  if (!apiKeyInstance) {
    return res.json({ error: "Unauthorized access" });
  }
  const userId = apiKeyInstance.userId;
  const articleId = req.body.articleId;
  const article = await Article.findOne({
    where: { id: articleId, userId: userId },
  });
  res.status(200).json(article);
};
