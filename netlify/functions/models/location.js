import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Location = sequelize.define(
    "Location",
    {
      location_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      location_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "locations",
      timestamps: false,
      underscored: true,
    }
  );

export default Location;
