const { Users, Pookiebears } = require("../db/dbObjects.js");
const { Op } = require("sequelize");
const {
  locationMap,
  arrayExists,
  common,
  ssr,
  getRandomInt,
} = require("../helper.js");
const { pookieChannel } = require("../config.json");
const { Events } = require("discord.js");

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    console.log("the mountain is active!");
    const t = client.channels.cache.get(pookieChannel);
    setInterval(async () => {
      const users = await Users.findAll({
        where: { location: locationMap.get(2) },
      });
      if (arrayExists(users)) {
        // let currentTimestamp = new Date.now();
        const pookies = await Pookiebears.findAll({
          where: { rarity: { [Op.or]: [common, ssr] } },
        });
        const random = pookies[getRandomInt(pookies.length)];
        /*
                $prev = 1330518155 - (1330518155 % 1800);
                $next = $prev + 1800;
                */
        let amount = 12;
        if (random.rarity == ssr) amount = 6;
        for (let i = 0; i < users.length; i++) {
          const user = users[i];
          user.addPookies(random, user.user_id, amount, random.rarity);
        }
        t.send(
          "# krakatoa! the mountain is exploding with " +
            random.pookie_name +
            "!",
        );
      }
    }, 3600000);
  },
};
