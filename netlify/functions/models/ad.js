import { DataTypes } from "sequelize";
import sequelize from "../config/database";

const Ad = sequelize.define(
  "Ad",
  {
    ad_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    ad_description: {
      type: DataTypes.STRING(255),
    },

    years_experience: {
      type: DataTypes.INTEGER,
    },

    hourly_rate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    img_url: {
      type: DataTypes.STRING(255),
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    destroy_at: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "ads",
    timestamps: false,
    underscored: true,
  }
);

export default Ad;
