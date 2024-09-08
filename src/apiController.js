// src/apiController.js
import Article from './models/Article.js';
import { formatDate } from './utils.js';
import * as cheerio from 'cheerio';
import { getArticle } from './article.js';

export const getAllArticles = async (req, res) => {
  try {
    const articles = await Article.findAll();
    articles.forEach((article) => {
      article.publish_date = formatDate(article.publish_date);
    });
    res.json(articles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error retrieving articles" });
  }
};

export const getArticleById = async (req, res) => {
  const id = req.params.id;
  try {
    const article = await Article.findByPk(id);
    if (article) {
      article.publish_date = formatDate(article.publish_date);
      res.json(article);
    } else {
      res.status(404).json({ error: "Article not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error retrieving article" });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const articles = await Article.findAll({
      attributes: ['classification'],
      group: ['classification'],
    });
    const categories = articles.map((article) => article.classification);
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error retrieving categories" });
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
    res.json(articles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error retrieving articles by category" });
  }
};

export const addArticle = async (req, res) => {
  const articleLink = req.body.articleLink;
  try {
    const response = await fetch(articleLink);
    const html = await response.text();
    const $ = cheerio.load(html);
    const content = $('body').html() || 'No content found';
    const article = await getArticle(content);

    const newArticle = await Article.create({
      title: article.title,
      classification: article.classification,
      author: article.author,
      publish_date: article.publish_date,
      article_text: article.article_text,
      article_link: articleLink,
    });

    res.status(201).json(newArticle);
  } catch (error) {
    console.error("Error adding article:", error);
    res.status(500).json({ error: "Error adding article" });
  }
};
