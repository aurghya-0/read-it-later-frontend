import express from "express";
import {
  getAllArticles,
  getAllCategories,
  getArticlesByCategory,
  getArticleById,
  addArticle,
  signup,
  login,
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
router.get("/feeds/:id", getAllFeeds);
router.post("/feeds", addFeed);
router.get("/login", async (req, res) => {
  res.render("login");
});
router.get("/signup", async (req, res) => {
  res.render("signup");
});
router.post("/login", login);
router.post("/signup", signup);

export default router;
