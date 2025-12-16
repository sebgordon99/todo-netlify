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

      start_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      end_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      is_booked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      user_capacity: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
    },
    {
      tableName: "availability",
      timestamps: false,
      underscored: true,
    }
  );

export default Availability;
