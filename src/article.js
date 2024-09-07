import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import dotenv from "dotenv";
import { openDb } from './database.js';
import sqlite3 from 'sqlite3';
import os from 'os';
import * as cheerio from 'cheerio';

const homePath = os.homedir();

const envPath = homePath + '/.config/article/.env';
dotenv.config({ path: envPath });

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const db = new sqlite3.Database(`${os.homedir()}/.config/article/storage.db`);

const Article = z.object({
    title: z.string(),
    classification: z.string(),
    author: z.string(),
    publish_date: z.string(),
    article_text: z.string()
});

async function getArticleFromLink(articleLink) {
    try {
        // Fetch the article content from the provided link
        const response = await fetch(articleLink);
        const html = await response.text();

        const $ = cheerio.load(html);
        const content = $('body').html() || 'No content found';
        return content;
    } catch (error) {
        console.error('Error fetching article:', error);
        res.status(500).json({ error: 'Error fetching article' });
    }
}

// getArticleFromLink("https://timesofindia.indiatimes.com/india/centre-discharges-puja-khedkar-from-ias-with-immediate-effect/articleshow/113151876.cms");

export async function getArticle(articleHtml) {
    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini-2024-07-18",
      messages: [
        {
          role: "system",
          content:
            "You are an article extractor who extracts article from scraped websites. Extract the article with title, author, publish date (in ISO 8601 format) and extract the text from the article and convert it into HTML while removing all the advertisements and extra texts inside the article, also do not keep the title, author and publish date inside the article text. Also classify the article into a subcategory.",
        },
        {
          role: "user",
          content: articleHtml,
        },
      ],
      response_format: zodResponseFormat(
        Article,
        'article'
      ),
    });
    const article = completion.choices[0].message.parsed;
    return article;
}

await getArticle("https://timesofindia.indiatimes.com/india/centre-discharges-puja-khedkar-from-ias-with-immediate-effect/articleshow/113151876.cms")