import { getRandomInt } from "../../helper.js";
import { Users, UserPookies, Pookiebears } from "../dbObjects.js";
import { Pookiebear } from "./pookiebears.js";

export interface UserInterface {
  user_id: string;
  balance: number;
  lifetime: number;
  favoritePookie: string;
  location: string;
  questTier: number;
  questLifetime: number;
}

export class User implements UserInterface {
  user_id: string;
  balance: number;
  lifetime: number;
  favoritePookie: string;
  location: string;
  questTier: number;
  questLifetime: number;

  constructor(
    user_id: string,
    balance: number,
    lifetime: number,
    favoritePookie: string,
    location: string,
    questTier: number,
    questLifetime: number,
  ) {
    this.user_id = user_id;
    this.balance = balance;
    this.lifetime = lifetime;
    this.favoritePookie = favoritePookie;
    this.location = location;
    this.questTier = questTier;
    this.questLifetime = questLifetime;
  }

  async addPookies(
    pookie: Pookiebear,
    userID: string,
    amount: number,
    rarity: number,
  ): Promise<any> {
    const userPookie = await UserPookies.findOne({
      where: { user_id: userID, pookie_id: pookie.id },
    });

    if (userPookie) {
      userPookie.amount += amount;
      return userPookie.save();
    }

    return await UserPookies.create({
      user_id: userID,
      pookie_id: pookie.id,
      amount: amount,
      rarity: rarity,
    });
  }

  async destroyPookies(pookie: Pookiebear, userID: string): Promise<void> {
    const userPookie = await UserPookies.findOne({
      where: { user_id: userID, pookie_id: pookie.id },
    });
    // new random pookie from inventory
    const inventory = await UserPookies.findAll({ where: { user_id: userID } });
    const r = inventory[getRandomInt(inventory.length - 1)].pookie_id;
    const newpookie = await Pookiebears.findOne({ where: { id: r } });
    const user = await Users.findOne({
      where: { user_id: userID },
    });

    if (userPookie) {
      console.log(pookie.pookie_name + " destroyed.");
      userPookie.destroy();
      if (user.favoritePookie === pookie.pookie_name) {
        console.log("favorite pookie " + pookie.pookie_name + " destroyed.");
        console.log("new pookie " + newpookie.pookie_name + " set.");
        user.update(
          { favoritePookie: newpookie.pookie_name },
          { where: { user_id: user.id } },
        );
      }
      return;
    }
    return;
  }
}

export const findUser = async (conditions: object): Promise<User> => {
  return await Users.findOne(conditions);
};
