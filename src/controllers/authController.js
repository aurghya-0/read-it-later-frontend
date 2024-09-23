import { loginUser, registerUser } from "../services/authHandler.js";

export const logout = async (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
      }
    });
    res.redirect("/login");
  };
  
  export const login = async (req, res) => {
    const { username, password } = req.body;
    try {
      const user = await loginUser(username, password);
      req.session.user = user;
      res.json({ message: "Login successful" });
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  };
  
  export const register = async (req, res) => {
    const { username, password } = req.body;
    try {
      const user = await registerUser(username, password);
      res.status(201).json({
        message: "user registered successfully",
        user,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  export const getLogin = async (req, res) => {
    res.render("login");
  };
  
  export const getRegister = async (req, res) => {
    res.render("register");
  };
  