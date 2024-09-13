import { DataTypes } from "sequelize";
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
});

export default Feed;
