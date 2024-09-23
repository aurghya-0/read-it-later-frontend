import express from "express";

const router = express.Router();

router.get("/profile", async (req, res) => {
  res.render("viewProfile");
});
router.get("/profile/edit", async (req, res) => {
  res.render("editProfile");
});

export default router;