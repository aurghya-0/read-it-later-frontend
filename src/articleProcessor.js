// src/articleProcessor.js
import Article from './models/Article.js';
import * as cheerio from 'cheerio';
import { getArticle } from './article.js';
import fetch from 'node-fetch';
import articleQueue from './queue.js'

articleQueue.process(async (job) => {
  const { articleLink } = job.data;

  try {
    console.log("Processing Article");
    const response = await fetch(articleLink);
    const html = await response.text();
    const $ = cheerio.load(html);
    const content = $('body').html() || 'No content found';
    const article = await getArticle(content);

    console.log("Saving Article to database");

    await Article.create({
      title: article.title,
      classification: article.classification,
      author: article.author,
      publish_date: article.publish_date,
      article_text: article.article_text,
      article_link: articleLink,
    });

    console.log('Article added successfully');
  } catch (error) {
    console.error('Error adding article:', error);
    throw error;
  }
});
