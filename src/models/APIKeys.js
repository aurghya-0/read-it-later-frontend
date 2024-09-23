import { DataTypes } from "sequelize";
import User from "./User.js";
import sequelize from "./index.js";

const APIKeys = sequelize.define(
  "APIKeys",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    apiKey: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  { timestamps: true },
);

export default APIKeys;
