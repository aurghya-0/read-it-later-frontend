import express from "express";
import {
  getAllArticles,
  getAllCategories,
  getArticlesByCategory,
  getArticleById,
  addArticle,
  signup,
  login,
} from "./controller.js";

const router = express.Router();

router.get("/", getAllArticles);
router.get("/categories", getAllCategories);
router.get("/category/:category", getArticlesByCategory);
router.get("/add-article", (req, res) => res.render("addArticle"));
router.post("/add-article", addArticle);
router.get("/article/:id", getArticleById);
router.get("/login", async (req, res) => {
  res.render("login");
});
router.get("/signup", async (req, res) => {
  res.render("signup");
});
router.post("/login", login);
router.post("/signup", signup);

export default router;
