//const { Model, InferAttributes, InferCreationAttributes, Optional, ModelDefined } = require("sequelize");
import { Model, InferAttributes, InferCreationAttributes, Sequelize} from 'sequelize';
export class Pookiebears extends Model<InferAttributes<Pookiebears>, InferCreationAttributes<Pookiebears>>{
  declare pookie_name: string;
  declare file_path: string;
  declare creator: string;
  declare creatorURL: string;
  declare summon_count: number;
  declare rarity: number;
  declare source: string
}
