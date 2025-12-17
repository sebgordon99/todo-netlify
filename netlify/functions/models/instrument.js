import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Instrument = sequelize.define(
    "Instrument",
    {
      instrument_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      instrument_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "instruments",
      timestamps: false,
      underscored: true,
    }
  );

export default Instrument;
