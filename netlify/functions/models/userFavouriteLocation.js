import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const UserFavouriteLocation = sequelize.define(
    "UserFavouriteLocation",
    {},
    {
      tableName: "user_favourite_locations",
      timestamps: false,
      underscored: true,
    }
  );

export default UserFavouriteLocation;
