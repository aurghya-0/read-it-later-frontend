import { DataTypes } from "sequelize";
import User from "./User.js";
import sequelize from "./index.js";

const Feed = sequelize.define("Feed", {
  link: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    unique: false,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
});

export default Feed;
