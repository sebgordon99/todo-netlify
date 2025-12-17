import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Tutor = sequelize.define(
    "Tutor",
    {
      tutor_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      account_status: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: "active",
      },

      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      avatar_url: {
        type: DataTypes.STRING(255),
      },

      phone: {
        type: DataTypes.STRING(20),
      },

      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },

      username: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },

      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      tableName: "tutors",
      timestamps: false,
      underscored: true,
    }
  );

export default Tutor;
