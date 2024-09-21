import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "./models/User.js";

const JWT_SECRET = "your_jwt_secret"; // Replace with your own secret

export const registerUser = async (username, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return await User.create({ username, password: hashedPassword });
};

export const loginUser = async (username, password) => {
  const user = await User.findOne({ where: { username } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error("Invalid credentials");
  }
  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: "48h",
  });
  return token;
};

export const verifyToken = (req, res, next) => {
  const token = req.cookies?.jwt;
  if (!token) {
    return res.redirect("/login");
  }
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.redirect("/login");
    }
    req.user = decoded;
    next();
  });
};
