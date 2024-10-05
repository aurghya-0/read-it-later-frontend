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
  const apiKeyInstance = await APIKeys.findOne({ apiKey: apiKey });
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
  const createdKey = new APIKeys({
    userId: user.id,
    apiKey: randomBytes(16).toString("hex"),
    keyName: keyName,
    expiresAt: null,
  });
  await createdKey.save();
  res.json({
    apiKey: createdKey.apiKey,
  });
};

export const addArticleAPI = async (req, res) => {
  const articleLink = req.body.link;
  const apiKey = getApiKeyFromRequest(req);
  if (!apiKey) {
    return res.json({ message: "Error Unauthorized access" });
  }
  const apiKeyInstance = await APIKeys.findOne({ apiKey: apiKey });
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
  const apiKeyInstance = await APIKeys.findOne({ apiKey: apiKey });
  if (!apiKeyInstance) {
    return res.json({ error: "Unauthorized access" });
  }
  const userId = apiKeyInstance.userId;
  const { limit, offset } = req.query;
  try {
    const articles = await Article.find({ userId: userId })
      .select("-article_text -article_link")
      .skip(parseInt(offset))
      .limit(parseInt(limit));
    res.status(200).json(articles);
  } catch (err) {
    console.error(err);
    res.status(500).json("Error retrieving articles");
  }
};

export const getArticle = async (req, res) => {
  const apiKey = getApiKeyFromRequest(req);
  if (!apiKey) {
    return res.json({ error: "Unauthorized access" });
  }
  const apiKeyInstance = await APIKeys.findOne({ apiKey: apiKey });
  if (!apiKeyInstance) {
    return res.json({ error: "Unauthorized access" });
  }
  const userId = apiKeyInstance.userId;
  const articleId = req.params.id;
  try {
    const article = await Article.findOne({ _id: articleId, userId: userId });
    res.status(200).json(article);
  } catch (err) {
    console.error(err);
    res.status(500).json("Error retrieving article");
  }
};

export const deleteArticle = async (req, res) => {
  const apiKey = getApiKeyFromRequest(req);
  if (!apiKey) {
    return res.json({ error: "Unauthorized access" });
  }
  const apiKeyInstance = await APIKeys.findOne({ apiKey: apiKey });
  if (!apiKeyInstance) {
    return res.json({ error: "Unauthorized access" });
  }
  const userId = apiKeyInstance.userId;
  const articleId = req.body.articleId;
  try {
    await Article.deleteOne({ _id: articleId, userId: userId });
    res.status(200).json({ message: "Article deleted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json("Error deleting article");
  }
};

export const getAllCategories = async (req, res) => {
  const apiKey = getApiKeyFromRequest(req);
  const apiKeyInstance = await APIKeys.findOne({ apiKey: apiKey });
  if (!apiKeyInstance) {
    return res.json({ error: "Unauthorized access" });
  }
  const userId = apiKeyInstance.userId;

  try {
    const articles = await Article.aggregate([
      { $match: { userId: userId } },
      { $group: { _id: "$classification" } },
    ]);
    const categories = articles.map((article) => article._id);
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json("Error retrieving categories");
  }
};

export const getArticlesByCategory = async (req, res) => {
  const apiKey = getApiKeyFromRequest(req);
  const apiKeyInstance = await APIKeys.findOne({ apiKey: apiKey });
  if (!apiKeyInstance) {
    return res.json({ error: "Unauthorized access" });
  }
  const userId = apiKeyInstance.userId;
  const { offset = 0, limit = 10 } = req.query;
  try {
    const articles = await Article.find({
      userId: userId,
      classification: req.params.category,
    })
      .skip(parseInt(offset))
      .limit(parseInt(limit));
    const count = await Article.countDocuments({
      userId: userId,
      classification: req.params.category,
    });
    const totalPages = Math.ceil(count / limit);
    res.status(200).json({ articles, totalPages });
  } catch (err) {
    console.error(err);
    res.status(500).json("Error retrieving articles by category");
  }
};