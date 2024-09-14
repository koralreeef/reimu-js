import { Pookiebears } from "../dbObjects.js";

export interface Pookiebear {
  id: number;
  pookie_name: string;
  file_path: string;
  creator: string;
  creatorURL: string;
  summon_count: number;
  rarity: number;
  source: string;
}

export const findAll = async (conditions): Promise<[Pookiebear]> => {
  return (await Pookiebears.findAll(conditions)).map((x) => {
    return { ...x.dataValues };
  });
};
