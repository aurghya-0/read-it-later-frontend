// src/models/index.js
import { Sequelize } from 'sequelize';

// Initialize Sequelize to use SQLite, but it can be easily changed to another DB
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: `${process.env.HOME}/.config/article/storage.db`,
});

// Export the connection instance
export default sequelize;
