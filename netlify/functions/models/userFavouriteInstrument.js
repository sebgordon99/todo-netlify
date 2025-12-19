import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const UserFavouriteInstrument = sequelize.define(
    "UserFavouriteInstrument",
    {},
    {
      tableName: "user_favourite_instruments",
      timestamps: false,
      underscored: true,
    }
  );

export default UserFavouriteInstrument;
