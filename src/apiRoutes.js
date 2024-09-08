// src/apiRoutes.js
import express from 'express';
import {
  getAllArticles,
  getArticleById,
  getAllCategories,
  getArticlesByCategory,
  addArticle
} from './apiController.js';

const router = express.Router();

// Define API routes
router.get("/articles", getAllArticles);
router.get("/articles/:id", getArticleById);
router.get("/categories", getAllCategories);
router.get("/category/:category", getArticlesByCategory);
router.post("/articles", addArticle);

export default router;
