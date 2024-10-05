import bcrypt from "bcrypt";
import User from "../models/UserM.js"; // Assuming this is a Mongoose model

const serializeUser = (user) => {
  return { id: user._id, username: user.username };
};

export const registerUser = async (username, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword });
  return await user.save();
};

export const loginUser = async (username, password) => {
  const user = await User.findOne({ username });
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