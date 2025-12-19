import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const UserFavouriteAd = sequelize.define(
    "UserFavouriteAd",
    {},
    {
      tableName: "user_favourite_ads",
      timestamps: false,
      underscored: true,
    }
  );

export default UserFavouriteAd;
