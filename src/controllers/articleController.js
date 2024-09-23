import Article from "../models/Article.js";
import articleQueue from "../utils/queue.js";

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
      user: req.session.user,
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
    res.render("categories", {
      categories: categories,
      user: req.session.user,
    });
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
      user: req.session.user,
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
        res.render("article", { article: article, user: req.session.user });
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
};
