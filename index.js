const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const app = express();
const port = 3090;

// Set EJS as the templating engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files (like Tailwind CSS)
app.use(express.static(path.join(__dirname, "public")));

// Create and connect to SQLite database
const db = new sqlite3.Database("/Users/aurghyadip/.config/article/storage.db");

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
  console.log(`Server running at http://localhost:${3090}`);
});
