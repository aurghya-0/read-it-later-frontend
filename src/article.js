import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import dotenv from "dotenv";
import os from "os";

const homePath = os.homedir();

const envPath = homePath + "/.config/article/.env";
dotenv.config({ path: envPath });

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const Article = z.object({
  classification: z.string(),
  article_html: z.string(),
  article_summary: z.string(),
});

const newsCategories = [
  "World News",
  "Politics",
  "Business",
  "Technology",
  "Science",
  "Health",
  "Entertainment",
  "Sports",
  "Education",
  "Environment",
  "Travel",
  "Lifestyle",
  "Finance",
  "Opinion/Editorial",
  "Startups",
  "Automobile",
  "Gaming",
  "Food",
  "Art & Culture",
  "Local News",
];

const categoriesString = newsCategories.join(", ");

export async function getArticle(articleHtml) {
  const completion = await openai.beta.chat.completions.parse({
    model: "gpt-4o-mini-2024-07-18",
    messages: [
      {
        role: "system",
        content: `You are acting as a classifier, an advertisement remover, and a summariser of articles, I will supply you with HTML content, you identify which are the advertisement links and other texts which are not relevant to the article and remove them. After that, classify the article into a subcategory from these [${categoriesString}], and also add a short 60 words plaintext summary for the article.`,
      },
      {
        role: "user",
        content: articleHtml,
      },
    ],
    response_format: zodResponseFormat(Article, "article"),
  });
  const article = completion.choices[0].message.parsed;
  return article;
}
