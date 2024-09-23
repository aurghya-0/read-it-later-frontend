import bcrypt from "bcrypt";
import User from "../models/User.js";

const serializeUser = (user) => {
  return { id: user.id, username: user.username };
};

export const registerUser = async (username, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return await User.create({ username, password: hashedPassword });
};

export const loginUser = async (username, password) => {
  const user = await User.findOne({ where: { username } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error("Invalid credentials");
  }
  return serializeUser(user);
};

export const isAuthenticated = (req, res, next) => {
  const user = req.session?.user;
  if (user) {
    return next();
  }
  res.redirect("/login");
};
