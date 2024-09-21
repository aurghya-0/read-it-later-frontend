import express from "express";
import path from "path";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import routes from "./src/routes.js";
import sequelize from "./src/models/index.js";
import "./src/utils/articleProcessor.js";
import http from "http";
import cookieParser from "cookie-parser";
import session from "express-session";
import RedisStore from "connect-redis";
import { createClient } from "redis";

sequelize.sync();

const app = express();
const server = http.createServer(app);
const port = 3090;

const redisClient = createClient({
  url: "redis://localhost:6379",
});

redisClient.on("error", (err) => {
  console.error(err);
});

await redisClient.connect();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: "any-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  }),
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  res.locals.currentRoute = req.path;
  next();
});

// Routes
app.use("/", routes);

server.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
