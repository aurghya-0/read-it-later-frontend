// src/controller.js
import Article from './models/Article.js';
import { formatDate } from './utils.js';
import articleQueue from './queue.js';

export const getAllArticles = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit to 10

  try {
    const offset = (page - 1) * limit;
    const articles = await Article.findAndCountAll({
      limit: parseInt(limit), // Limit the number of articles per page
      offset: offset, // Skip the articles for previous pages
    });

    const totalPages = Math.ceil(articles.count / limit); // Calculate total pages
    articles.rows.forEach(article => {
      article.publish_date = formatDate(article.publish_date);
    });

    res.render("index", { articles: articles.rows, totalPages, currentPage: page });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving articles");
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const articles = await Article.findAll({
      attributes: ['classification'],
      group: ['classification'],
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
  try {
    const articles = await Article.findAll({
      where: { classification: category },
    });
    articles.forEach((article) => {
      article.publish_date = formatDate(article.publish_date);
    });
    res.render("index", { articles });
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