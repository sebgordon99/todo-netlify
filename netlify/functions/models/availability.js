import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Availability = sequelize.define(
  "Availability",
  {
    availability_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    start_time: DataTypes.DATE,
    end_time: DataTypes.DATE,
    capacity: DataTypes.INTEGER,
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "availabilities",
    underscored: true,
    timestamps: true,
    paranoid: true,
  }
);

export default Availability;
