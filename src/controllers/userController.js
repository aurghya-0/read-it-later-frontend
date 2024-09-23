import User from "../models/User.js";
import APIKeys from "../models/APIKeys.js";

export const getUserProfile = async (req, res) => {
    const user = req.session.user;
    if (!user) {
        return res.json({ error: "Unauthorized access" });
    }
    const userProfile = await User.findOne({
        where: { id: user.id },
        attributes: { exclude: ["password"] },
    });
    const apiKeys = await APIKeys.findAll({
        where: { userId: user.id },
    });
    res.render("viewProfile", { userProfile, apiKeys });
};

export const getEditUserProfile = async (req, res) => {
    const user = req.session.user;
    if (!user) {
        return res.json({ error: "Unauthorized access" });
    }
    const userProfile = await User.findOne({
        where: { id: user.id },
        attributes: { exclude: ["password"] },
    });
    res.render("editProfile", { userProfile });
}

export const saveUserProfile = async (req, res) => {
    const user = req.session.user;
    if (!user) {
        return res.json({ error: "Unauthorized access" });
    }
    const { name, email } = req.body;
    await User.update({ name, email }, { where: { id: user.id } });
    res.redirect("/profile");
}