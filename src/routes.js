import express from "express";
import {
  getAllArticles,
  getAllCategories,
  getArticlesByCategory,
  getArticleById,
  addArticle,
  getAllFeeds,
  addFeed,
  getAllArticlesFromFeed,
} from "./controller.js";

const router = express.Router();

router.get("/", getAllArticles);
router.get("/categories", getAllCategories);
router.get("/category/:category", getArticlesByCategory);
router.get("/add-article", (req, res) => res.render("addArticle"));
router.post("/add-article", addArticle);
router.get("/article/:id", getArticleById);
router.get("/feeds", getAllFeeds);
router.get("/feeds/:id", getAllArticlesFromFeed);
router.post("/feeds", addFeed);

export default router;
