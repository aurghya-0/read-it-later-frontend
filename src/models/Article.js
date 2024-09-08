// src/models/Article.js
import { DataTypes } from 'sequelize';
import sequelize from './index.js';

// Define the Article model
const Article = sequelize.define('Article', {
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
  article_link: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default Article;
