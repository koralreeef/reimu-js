//const { Model, InferAttributes, InferCreationAttributes, Optional, ModelDefined } = require("sequelize");
import { Model } from 'sequelize';
export class Pookiebears extends Model {
}
// export default (sequelize, DataTypes): ModelDefined<PookiebearAttributes, PookiebearAttributes> => {
//   return sequelize.define(
//     "pookiebears",
//     {
//       pookie_name: {
//         type: DataTypes.STRING,
//         defaultValue: "hakurei gooner",
//         unique: true,
//         allowNull: false,
//       },
//       file_path: {
//         type: DataTypes.TEXT,
//         defaultValue: "", // will always be called as 'attachment://'+fileName
//       },
//       creator: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },
//       creatorURL: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },
//       summon_count: {
//         type: DataTypes.INTEGER,
//         defaultValue: 0,
//         allowNull: false,
//       },
//       rarity: {
//         type: DataTypes.INTEGER,
//         defaultValue: 0,
//         allowNull: false,
//       },
//       source: {
//         type: DataTypes.STRING,
//         defaultValue: 0,
//         allowNull: false,
//       },
//     },
//     {
//       sequelize
//       timestamps: true,
//     },
//   );
// };
