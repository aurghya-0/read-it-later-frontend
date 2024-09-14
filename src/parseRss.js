import Parser from "rss-parser";
import * as cheerio from "cheerio";
import { getArticle } from "./article.js";
import Article from "./models/Article.js";
import fetch from "node-fetch";
import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";

const getArticlesFromLink = async (articleLink) => {
  try {
    const response = await fetch(articleLink, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:93.0) Gecko/20100101 Firefox/93.0",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
      },
    });
    const html = await response.text();
    const $ = cheerio.load(html);
    const dom = new JSDOM($.html());
    const readArticle = new Readability(dom.window.document).parse();
    console.log(`Processing ${readArticle.title}`);
    const article = await getArticle(readArticle.content);
    await Article.create({
      title: readArticle.title,
      classification: article.classification || "Untagged",
      author: readArticle.siteName,
      publish_date: readArticle.publishedTime,
      article_text: article.article_html,
      article_summary: article.article_summary,
      article_link: articleLink,
    });
    console.log(`${readArticle.title} added to database.`);
  } catch (error) {
    console.error("Error adding article:");
    console.error(error);
  }
};

let parser = new Parser();

export const parseRss = async (rssLink) => {
  let feed = await parser.parseURL(rssLink);
  let articles = [];
  feed.items.forEach(async (item) => {
    articles.push(item);
  });
  return articles;
};
