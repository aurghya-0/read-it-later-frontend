import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import dotenv from "dotenv";
import os from 'os';

const homePath = os.homedir();

const envPath = homePath + '/.config/article/.env';
dotenv.config({ path: envPath });

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const Article = z.object({
    title: z.string(),
    classification: z.string(),
    author: z.string(),
    publish_date: z.string(),
    article_text: z.string()
});

export async function getArticle(articleHtml) {
    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini-2024-07-18",
      messages: [
        {
          role: "system",
          content:
            "You are an article extractor who extracts article from scraped websites. Extract the article with title, author, publish date (in ISO 8601 format) and extract the text from the article and format it into HTML (also format the article as you see fit like adding bold italic or underline, table structured data, etc.) while removing all the advertisements and extra texts, links inside the article, also do not keep the title, author and publish date inside the article text. Also classify the article into a subcategory.",
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