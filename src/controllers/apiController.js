import articleQueue from "../utils/queue.js";
import { randomBytes } from "crypto";
import APIKeys from "../models/APIKeys.js";
import Article from "../models/Article.js";

const getApiKeyFromRequest = (req) => {
  const apiKeyFromHeader = req.headers["x-api-key"];
  if (apiKeyFromHeader) {
    return apiKeyFromHeader;
  }
  return req.body["apiKey"];
};

export const isAuthenticatedApi = async (req, res, next) => {
  const apiKey = getApiKeyFromRequest(req);
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
  const apiKey = getApiKeyFromRequest(req);
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
  const apiKey = getApiKeyFromRequest(req);
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
  if (req.query.limit && req.query.offset) {
    const articles = await Article.findAll({
      where: { userId: userId },
      attributes: { exclude: ["article_text", "article_link"] },
      limit: parseInt(req.query.limit),
      offset: parseInt(req.query.offset)
    });
    return res.status(200).json(articles);
  } else {
    const articles = await Article.findAll({
      where: { userId: userId },
      attributes: { exclude: ["article_text", "article_link"] }
    });
    res.status(200).json(articles);
  }
};

export const getArticle = async (req, res) => {
  const apiKey = getApiKeyFromRequest(req);
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
  const articleId = req.params.id;
  const article = await Article.findOne({
    where: { id: articleId, userId: userId },
  });
  res.status(200).json(article);
};

export const deleteArticle = async (req, res) => {
  const apiKey = getApiKeyFromRequest(req);
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
  await Article.destroy({
    where: { id: articleId, userId: userId },
  });
  res.status(200).json({ message: "Article deleted successfully!" });
}

export const getAllCategories = async (req, res) => {
  const apiKey = getApiKeyFromRequest(req);
  const apiKeyInstance = await APIKeys.findOne({
    where: { apiKey: apiKey },
  });
  if (!apiKeyInstance) {
    return res.json({ error: "Unauthorized access" });
  }
  const userId = apiKeyInstance.userId;

  try {
    const articles = await Article.findAll({
      where: { userId: userId },
      attributes: ["classification"],
      group: ["classification"],
    });
    const categories = articles.map((article) => article.classification);
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json("Error retrieving categories");
  }
};

export const getArticlesByCategory = async (req, res) => {
  const apiKey = getApiKeyFromRequest(req);
  const apiKeyInstance = await APIKeys.findOne({
    where: { apiKey: apiKey },
  });
  if (!apiKeyInstance) {
    return res.json({ error: "Unauthorized access" });
  }
  const userId = apiKeyInstance.userId;
  const { offset = 0, limit = 10 } = req.query;
  try{
    const articles = await Article.findAndCountAll({
      where: {
        userId: userId,
        classification: req.params.category,
      },
      limit: parseInt(limit),
      offset: offset,
    });
    const totalPages = Math.ceil(articles.count / limit);
    res.status(200).json(articles.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json("Error retrieving articles by category");
  }
};