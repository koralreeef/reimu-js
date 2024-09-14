//const { Model, InferAttributes, InferCreationAttributes, Optional, ModelDefined } = require("sequelize");
import { ModelDefined } from "sequelize";
interface PookiebearAttributes {
  pookie_name: string;
  file_path: string;
  creator: string;
  creatorURL: string;
  summon_count: number;
  rarity: number;
  source: string
}


export const a = (sequelize, DataTypes): ModelDefined<PookiebearAttributes, PookiebearAttributes> => {
  return sequelize.define(
    "pookiebears",
    {
      pookie_name: {
        type: DataTypes.STRING,
        defaultValue: "hakurei gooner",
        unique: true,
        allowNull: false,
      },
      file_path: {
        type: DataTypes.TEXT,
        defaultValue: "", // will always be called as 'attachment://'+fileName
      },
      creator: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      creatorURL: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      summon_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      rarity: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      source: {
        type: DataTypes.STRING,
        defaultValue: 0,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    },
  );
};
