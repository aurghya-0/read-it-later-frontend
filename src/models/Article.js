import { DataTypes } from "sequelize";
import sequelize from "./index.js";

const Article = sequelize.define("Article", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  classification: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  publish_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  article_text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  article_summary: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  article_link: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

export default Article;
