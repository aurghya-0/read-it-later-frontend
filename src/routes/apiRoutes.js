import express from "express";
import { 
    addArticleAPI, 
    apiKeyGeneration, 
    isAuthenticatedApi,
    getAllArticles,
    getArticle,
    deleteArticle,
    getAllCategories,
    getArticlesByCategory
} from "../controllers/apiController.js";

const router = express.Router();

// Key Generation
router.post("/generate-api-key", apiKeyGeneration);

router.post("/api/add-article", isAuthenticatedApi, addArticleAPI);
router.get("/api/articles", isAuthenticatedApi, getAllArticles);
router.get("/api/articles/:id", isAuthenticatedApi, getArticle);
router.delete("/api/articles", isAuthenticatedApi, deleteArticle);
router.get("/api/categories", isAuthenticatedApi, getAllCategories);
router.get("/api/categories/:category", isAuthenticatedApi, getArticlesByCategory);

export default router;
