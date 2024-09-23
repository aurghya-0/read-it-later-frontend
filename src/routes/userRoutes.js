import express from "express";
import {getUserProfile, getEditUserProfile} from "../controllers/userController.js";
import {isAuthenticated} from "../services/authHandler.js"

const router = express.Router();

router.get("/profile", isAuthenticated, getUserProfile);
router.get("/profile/edit", isAuthenticated, getEditUserProfile);

export default router;