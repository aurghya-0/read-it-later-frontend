import User from "../models/UserM.js";
import APIKeys from "../models/APIKeysM.js";

export const getUserProfile = async (req, res) => {
    const user = req.session.user;
    if (!user) {
        return res.json({ error: "Unauthorized access" });
    }
    const userProfile = await User.findById(user.id).select("-password");
    const apiKeys = await APIKeys.find({ userId: user.id });
    res.render("viewProfile", { userProfile, apiKeys });
};

export const getEditUserProfile = async (req, res) => {
    const user = req.session.user;
    if (!user) {
        return res.json({ error: "Unauthorized access" });
    }
    const userProfile = await User.findById(user.id).select("-password");
    res.render("editProfile", { userProfile });
}

export const saveUserProfile = async (req, res) => {
    const user = req.session.user;
    if (!user) {
        return res.json({ error: "Unauthorized access" });
    }
    const { name, email } = req.body;
    await User.findByIdAndUpdate(user.id, { name, email });
    res.redirect("/profile");
}