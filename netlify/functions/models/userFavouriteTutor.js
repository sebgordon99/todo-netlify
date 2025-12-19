import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const UserFavouriteTutor = sequelize.define(
    "UserFavouriteTutor",
    {},
    {
      tableName: "user_favourite_tutors",
      timestamps: false,
      underscored: true,
    }
  );

export default UserFavouriteTutor;
