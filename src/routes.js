import express from "express";
import {
  getAllArticles,
  getAllCategories,
  getArticlesByCategory,
  getArticleById,
  addArticle,
  deleteArticleById,
  getAllArticlesFromFeed,
  getLogin,
  getRegister,
  register,
  login,
  logout,
  addArticleAPI,
} from "./controller.js";
import { verifyToken } from "./authController.js";

const router = express.Router();

router.get("/", verifyToken, getAllArticles);
router.get("/categories", verifyToken, getAllCategories);
router.get("/category/:category", verifyToken, getArticlesByCategory);
router.get("/add-article", verifyToken, (req, res) =>
  res.render("addArticle", { user: req.session.user }),
);
router.post("/add-article", verifyToken, addArticle);
router.post("/api/add-article", addArticleAPI);
router.get("/article/:id", verifyToken, getArticleById);
router.post("/article/delete/:id", verifyToken, deleteArticleById);
// router.get("/feeds", verifyToken, getAllFeeds);
router.get("/feeds/:id", verifyToken, getAllArticlesFromFeed);
// router.post("/feeds", verifyToken, addFeed);
router.get("/login", getLogin);
router.get("/register", getRegister);
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);

router.get("/profile", async (req, res) => {
  res.render("profile");
});

export default router;
