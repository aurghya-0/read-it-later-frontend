import Article from "./models/Article.js";
import * as cheerio from "cheerio";
import { getArticle } from "./article.js";
import fetch from "node-fetch";
import articleQueue from "./queue.js";
import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import { getSocketInstance } from "./socket.js";

articleQueue.process(async (job) => {
  const { articleLink } = job.data;
  const io = getSocketInstance();

  try {
    console.log(`Processing Article from ${articleLink}`);
    io.emit("articleProcessing", { status: "started", articleLink });
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
    io.emit("articleProcessing", { status: "processing", articleLink });
    console.log(`Getting Result from OpenAI for: ${readArticle.title}`);
    const openaiResponse = await getArticle(readArticle.content);
    console.log(`Saving ${readArticle.title} to database.`);
    io.emit("articleProcessing", { status: "database", articleLink });
    await Article.create({
      title: readArticle.title,
      classification: openaiResponse.classification || "Untagged",
      author: readArticle.siteName,
      publish_date: readArticle.publishedTime,
      article_text: openaiResponse.article_html,
      article_summary: openaiResponse.article_summary,
      article_link: articleLink,
    });

    console.log(`${readArticle} added successfully`);
    io.emit("articleProcessing", { status: "completed", articleLink });
  } catch (error) {
    console.error("Error adding article:");
    console.error(error);
    throw error;
  }
});
