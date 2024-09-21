import express from "express";
import path from "path";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import routes from "./src/routes.js";
import apiRoutes from "./src/apiRoutes.js";
import sequelize from "./src/models/index.js";
import "./src/articleProcessor.js";
import http from "http";
import { initSocket } from "./src/socket.js";
import cookieParser from "cookie-parser";

sequelize.sync();

const app = express();
const server = http.createServer(app);
initSocket(server);
const port = 3090;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  res.locals.currentRoute = req.path;
  next();
});

// Routes
app.use("/", routes);
app.use("/api", apiRoutes);

server.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
