import express from "express";
import { addArticleAPI, apiKeyGeneration, isAuthenticatedApi } from "../controllers/apiController.js";

const router = express.Router();

// Key Generation
router.post("/generate-api-key", apiKeyGeneration);

router.post("/api/add-article", isAuthenticatedApi, addArticleAPI);

export default router;
