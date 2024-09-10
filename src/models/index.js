import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: `${process.env.HOME}/.config/article/storage.db`,
  logging: false
});

export default sequelize;
