import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { homedir } from 'os';
import { getArticle } from './src/article.js';
import * as cheerio from 'cheerio';

const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use((req, res, next) => {
  res.locals.currentRoute = req.path;
  next();
});

// Create and connect to SQLite database
const db = new sqlite3.Database(`${homedir()}/.config/article/storage.db`);

// Utility function to format date from ISO 8601 to DD-MM-YYYY
function formatDate(isoDate) {
  const date = new Date(isoDate);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

// Routes
app.get("/", (req, res) => {
  db.all("SELECT * FROM article", [], (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => (row.publish_date = formatDate(row.publish_date)));
    res.render("index", { articles: rows });
  });
});

app.get("/categories", (req, res) => {
  db.all("SELECT DISTINCT classification FROM article", [], (err, rows) => {
    if (err) {
      throw err;
    }
    const categories = rows.map((row) => row.classification);
    res.render("categories", { categories });
  });
});

app.get("/category/:category", (req, res) => {
  const category = req.params.category;
  db.all(
    "SELECT * FROM article WHERE classification = ?",
    [category],
    (err, rows) => {
      if (err) {
        throw err;
      }
      rows.forEach((row) => (row.publish_date = formatDate(row.publish_date)));
      res.render("index", { articles: rows });
    },
  );
});

app.get('/add-article', (req, res) => {
  res.render('addArticle');
});

app.post('/add-article', async (req, res) => {
  const articleLink = req.body.articleLink;
  try {
    const response = await fetch(articleLink);
    const html = await response.text();

    const $ = cheerio.load(html);
    const content = $('body').html() || 'No content found';
    const article = await getArticle(content);
    db.run(
      'INSERT INTO article (title, classification, author, publish_date, article_text, article_link) VALUES (?, ?, ?, ?, ?, ?)',
      [article.title, article.classification, article.author, article.publish_date, article.article_text, articleLink],
      (err) => {
        if (err) {
          console.error('Error saving article:', err);
          res.status(500).send('Error saving article');
        } else {
          res.redirect('/');
        }
      }
    );
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).send('Error fetching article');
  }
});


app.post('/api/articles', async (req, res) => {
  const { articleLink } = req.body;

  if (!articleLink) {
    return res.status(400).json({ error: 'Article link is required' });
  }

  try {
    // Fetch the article content from the provided link
    const response = await fetch(articleLink);
    const html = await response.text();

    // Parse the HTML using Cheerio (for title, content, author, etc.)
    const $ = cheerio.load(html);
    const content = $('body').html() || 'No content found';
    const article = getArticle(content);

    // Insert the article into the database
    db.run(
      'INSERT INTO article (title, classification, author, publish_date, article_text, article_link) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [article.title, article.classification, article.author, article.publish_date, article.article_text, articleLink],
      (err) => {
        if (err) {
          console.error('Error saving article:', err);
          return res.status(500).json({ error: 'Error saving article' });
        }

        res.status(201).json({ message: 'Article added successfully' });
      }
    );
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ error: 'Error fetching article' });
  }
});

app.get("/article/:id", (req, res) => {
  const id = req.params.id;
  db.get("SELECT * FROM article WHERE id = ?", [id], (err, row) => {
    if (err) {
      throw err;
    }
    if (row) {
      row.publish_date = formatDate(row.publish_date);
      res.render("article", { article: row });
    } else {
      res.status(404).send("Article not found");
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
