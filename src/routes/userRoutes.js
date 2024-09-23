import express from "express";
import {getUserProfile, getEditUserProfile, saveUserProfile} from "../controllers/userController.js";
import {isAuthenticated} from "../services/authHandler.js"

const router = express.Router();

router.get("/profile", isAuthenticated, getUserProfile);
router.get("/profile/edit", isAuthenticated, getEditUserProfile);
router.post("/profile/edit", isAuthenticated, saveUserProfile);

export default router;