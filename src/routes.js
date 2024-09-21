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
  getLogin,
  getRegister
} from "./controller.js";
import { registerUser, verifyToken, loginUser } from "./authController.js";

const router = express.Router();

router.get("/",verifyToken, getAllArticles);
router.get("/categories", verifyToken, getAllCategories);
router.get("/category/:category", verifyToken, getArticlesByCategory);
router.get("/add-article", verifyToken, (req, res) => res.render("addArticle"));
router.post("/add-article", verifyToken, addArticle);
router.get("/article/:id", verifyToken, getArticleById);
router.get("/feeds", verifyToken, getAllFeeds);
router.get("/feeds/:id", verifyToken, getAllArticlesFromFeed);
router.post("/feeds", verifyToken, addFeed);
router.get("/login", getLogin);
router.get("/register", getRegister);

// Authentication Routes
router.post("/register", async(req, res) => {
  const {username, password} = req.body;
  try {
    const user = await registerUser(username, password);
    res.status(201).json({
      message: "user registered successfully", user
    });
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});

// User Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
      const { user, token } = await loginUser(username, password);
      res.cookie("jwt", token);
      res.json({ message: 'Login successful', token });
  } catch (err) {
      res.status(401).json({ error: err.message });
  }
});



export default router;
