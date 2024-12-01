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

export const findAllPookies = async (
  conditions: object,
): Promise<[Pookiebear]> => {
  return (await Pookiebears.findAll(conditions)).map((x) => {
    return { ...x.dataValues };
  });
};

export const updatePookie = async (
  values: object,
  conditions: object,
): Promise<Array<number>> => {
  return await Pookiebears.update(values, conditions);
};
