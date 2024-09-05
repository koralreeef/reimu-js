const { Users, Pookiebears } = require('../db/dbObjects.js');
const { Op } = require("sequelize");
const { locationMap, arrayExists, common, ssr, getRandomInt, targetChannel } = require('../helper.js');
const { Events, Message } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
	
        console.log("the mountain is active!");
        var t = client.channels.cache.get(targetChannel);
		setInterval(async () => {
            const users = await Users.findAll({where: {location: locationMap.get(2)}})
            if(arrayExists(users))
            {
                const pookies = await Pookiebears.findAll( { where: {rarity: { [Op.or]: [common, ssr]}}});  
                const random = pookies[getRandomInt(pookies.length)];
                let amount = 12;
                if(random.rarity == ssr) amount = 6;
                for(let i = 0; i < users.length; i++)
                {
                    const user = users[i];
                    user.addPookies(random, user.user_id, amount, random.rarity);
                }
                t.send("# krakatoa! the mountain is exploding with "+random.pookie_name+"!");
            }
		}, 1800000);
    },
};
