import express from "express";
import {
  addArticle,
  deleteArticleById,
  getAllArticles,
  getArticleById,
  getArticlesByCategory,
  getAllCategories,
} from "../controllers/articleController.js";
import { isAuthenticated } from "../services/authHandler.js";

const router = express.Router();

router.get("/", isAuthenticated, getAllArticles);
router.get("/categories", isAuthenticated, getAllCategories);
router.get("/category/:category", isAuthenticated, getArticlesByCategory);
router.get("/add-article", isAuthenticated, (req, res) =>
  res.render("addArticle", { user: req.session.user }),
);
router.post("/add-article", isAuthenticated, addArticle);
router.get("/article/:id", isAuthenticated, getArticleById);
router.post("/article/delete/:id", isAuthenticated, deleteArticleById);

export default router;