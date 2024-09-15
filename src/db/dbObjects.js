const Sequelize = require("sequelize");
//SORRY ACRID
const config = require("../../config.json");
const sequelize = new Sequelize("database", "username", "password", {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
  storage: config.db,
});

const Users = require("./models/Users.js")(sequelize, Sequelize.DataTypes);
const UserPookies = require("./models/UserPookies.js")(
  sequelize,
  Sequelize.DataTypes,
);
const Pookiebears = require("./models/pookiebears.js")(
  sequelize,
  Sequelize.DataTypes,
);
const osuUsers = require("./models/osuUsers.js")(
  sequelize,
  Sequelize.DataTypes,
);
const Quests = require("./models/quests.js")(sequelize, Sequelize.DataTypes);

Pookiebears.hasMany(UserPookies, { foreignKey: "pookie_id" });
UserPookies.belongsTo(Pookiebears, { foreignKey: "pookie_id", as: "pookie" });

Reflect.defineProperty(Users.prototype, "addPookies", {
  value: async (pookie, userID, amount, rarity) => {
    const userPookie = await UserPookies.findOne({
      where: { user_id: userID, pookie_id: pookie.id },
    });

    if (userPookie) {
      userPookie.amount += amount;
      return userPookie.save();
    }

    return UserPookies.create({
      user_id: userID,
      pookie_id: pookie.id,
      amount: amount,
      rarity: rarity,
    });
  },
});

Reflect.defineProperty(Users.prototype, "destroyPookies", {
  value: async (pookie, userID) => {
    const userPookie = await UserPookies.findOne({
      where: { user_id: userID, pookie_id: pookie.id },
    });
    // new random pookie from inventory
    const inventory = await UserPookies.findAll({ where: { user_id: userID } });
    const r =
      inventory[Math.floor(Math.random() * (inventory.length - 1))].pookie_id;
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
  },
});

Reflect.defineProperty(Users.prototype, "getPookies", {
  value: async (userID) => {
    return UserPookies.findAll({
      where: { user_id: userID },
      order: [
        ["rarity", "DESC"],
        ["amount", "DESC"],
      ],
      include: ["pookie"],
    });
  },
});

Reflect.defineProperty(Users.prototype, "getPage", {
  value: async (userID, pageNumber, sort) => {
    //this fucking sucks i cant pass variables into sequelize queries?
    console.log(sort);
    if (sort == "DESC") {
      return UserPookies.findAll({
        where: { user_id: userID },
        order: [
          ["rarity", "DESC"],
          ["amount", "DESC"],
        ],
        offset: (pageNumber - 1) * 25,
        limit: 25,
        include: ["pookie"],
      });
    }
    if (sort == "ASC") {
      return UserPookies.findAll({
        where: { user_id: userID },
        order: [
          ["rarity", "ASC"],
          ["amount", "DESC"],
        ],
        offset: (pageNumber - 1) * 25,
        limit: 25,
        include: ["pookie"],
      });
    }
  },
});

Reflect.defineProperty(Users.prototype, "getPookie", {
  value: async (pookie, userID) => {
    const userPookie = await UserPookies.findOne({
      where: { user_id: userID, pookie_id: pookie.id },
    });
    if (userPookie) return userPookie.amount;
    else return 0;
  },
});

Reflect.defineProperty(Users.prototype, "checkAmount", {
  value: async (pookie, userID, amount) => {
    const userPookie = await UserPookies.findOne({
      where: { user_id: userID, pookie_id: pookie.id },
    });

    if (userPookie) {
      userPookie.amount += amount;
      if (userPookie.amount == 0) {
        return true;
      } else {
        return false;
      }
    }

    return false;
  },
});

Reflect.defineProperty(Users.prototype, "checkPookies", {
  value: async (pookie, userID, amount) => {
    const userPookie = await UserPookies.findOne({
      where: { user_id: userID, pookie_id: pookie.id },
    });

    if (userPookie) {
      userPookie.amount += amount;
      console.log(userPookie.amount);
      if (userPookie.amount <= -1) {
        return false;
      } else {
        return true;
      }
    }

    return false;
  },
});

module.exports = { Users, UserPookies, Pookiebears, osuUsers, Quests };
