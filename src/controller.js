import Article from "./models/Article.js";
import { formatDate } from "./utils.js";
import articleQueue from "./queue.js";
import User from "./models/User.js";
import Feed from "./models/Feed.js";
import bcrypt from "bcrypt";
import passport from "passport";
import { } from "passport-local";
import { parseRss } from "./parseRss.js";

export const getAllFeeds = async (req, res) => {
  try {
    const feeds = await Feed.findAll();
    res.render("feeds", { feeds, selectedFeed: null, articles: [] });
  } catch (err) {
    console.error(err);
  }
};

export const getAllArticlesFromFeed = async (req, res) => {
  const id = req.params.id;
  try {
    const feed = await Feed.findByPk(id);
    const feeds = await Feed.findAll();
    const articles = await parseRss(feed.link);
    res.render("feeds", { feeds, selectedFeed: feed, articles });
  } catch (err) {
    console.error(err);
  }
};

export const addFeed = async (req, res) => {
  const { title, url } = req.body;
  try {
    await Feed.create({
      link: url,
      name: title,
    });
    res.redirect("/feeds");
  } catch (err) {
    console.error(err);
  }
};

export const signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(email);
    console.log(password);
    // Create a new user
    const user = await User.create({ email, password: hashedPassword });
    res.render("login");
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error." });
  }
};

export const login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(400).json({ message: info.message });
    }
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      console.log(user);
      return res.status(200).json({ message: "Login successful.", user });
    });
  })(req, res, next);
};

export const getAllArticles = async (req, res) => {
  const { page = 1, limit = 9 } = req.query; // Default to page 1 and limit to 10

  try {
    const offset = (page - 1) * limit;
    const articles = await Article.findAndCountAll({
      limit: parseInt(limit), // Limit the number of articles per page
      offset: offset, // Skip the articles for previous pages
    });

    const totalPages = Math.ceil(articles.count / limit); // Calculate total pages
    articles.rows.forEach((article) => {
      article.publish_date = formatDate(article.publish_date);
    });

    res.render("index", {
      articles: articles.rows,
      totalPages,
      currentPage: page,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving articles");
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const articles = await Article.findAll({
      attributes: ["classification"],
      group: ["classification"],
    });
    const categories = articles.map((article) => article.classification);
    res.render("categories", { categories });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving categories");
  }
};

export const getArticlesByCategory = async (req, res) => {
  const category = req.params.category;
  const { page = 1, limit = 10 } = req.query;
  try {
    const offset = (page - 1) * limit;
    const articles = await Article.findAndCountAll({
      where: { classification: category },
      limit: parseInt(limit),
      offset: offset,
    });
    const totalPages = Math.ceil(articles.count / limit);
    articles.rows.forEach((article) => {
      article.publish_date = formatDate(article.publish_date);
    });
    res.render("index", {
      articles: articles.rows,
      totalPages,
      currentPage: page,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving articles by category");
  }
};

export const getArticleById = async (req, res) => {
  const id = req.params.id;
  try {
    const article = await Article.findByPk(id);
    if (article) {
      article.publish_date = formatDate(article.publish_date);
      res.render("article", { article });
    } else {
      res.status(404).send("Article not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving article");
  }
};

export const addArticle = async (req, res) => {
  const articleLink = req.body.articleLink;
  try {
    // Add a job to the queue
    await articleQueue.add({ articleLink });

    res.redirect("/");
  } catch (error) {
    console.error("Error adding article:", error);
    res.status(500).send("Error adding article");
  }
};
