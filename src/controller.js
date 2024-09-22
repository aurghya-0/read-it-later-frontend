import Article from "./models/Article.js";
import articleQueue from "./utils/queue.js";
import Feed from "./models/Feed.js";
import { parseRss } from "./utils/parseRss.js";
import { loginUser, registerUser } from "./authController.js";



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
      userId: req.session.user.id,
    });
    res.redirect("/feeds");
  } catch (err) {
    console.error(err);
  }
};

export const getAllArticles = async (req, res) => {
  const { page = 1, limit = 9 } = req.query;

  try {
    const offset = (page - 1) * limit;
    const articles = await Article.findAndCountAll({
      where: { userId: req.session.user.id },
      limit: parseInt(limit),
      offset: offset,
    });

    const totalPages = Math.ceil(articles.count / limit);
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
      where: { userId: req.session.user.id },
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
      where: {
        userId: req.session.user.id,
        classification: category,
      },
      limit: parseInt(limit),
      offset: offset,
    });
    const totalPages = Math.ceil(articles.count / limit);
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
  const userId = req.session.user.id;
  try {
    const article = await Article.findByPk(id);
    if (article) {
      if (article.userId == userId) {
        res.render("article", { article });
      } else {
        res.redirect("/");
      }
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
  const userId = req.session.user.id;
  try {
    await articleQueue.add({ articleLink, userId });
    res.redirect("/");
  } catch (error) {
    console.error("Error adding article:", error);
    res.status(500).send("Error adding article");
  }
};


export const deleteArticleById = async (req, res) => {
  const id = req.params.id;
  const userId = req.session.user.id;
  try {
    const article = await Article.findByPk(id);
    if (article) {
      if (article.userId == userId) {
        await article.destroy();
        res.status(200).send("Article deleted successfully");
      } else {
        res.status(404).send("Article not found");
      }
    } else {
      res.status(404).send("Article not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting article");
  }
}