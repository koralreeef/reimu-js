const { Users } = require("../db/dbObjects.js");
const { currency } = require("../helper.js");
const { PresenceUpdateStatus } = require("discord.js");
const { Events } = require("discord.js");

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    client.user.setStatus(PresenceUpdateStatus.DoNotDisturb);

    // RUN ONLY WHEN STARTING NEW DB WITH GUILD
    /*
		const guild = client.guilds.cache.get(koralreef);
		const members = await guild.members.fetch();
		const filterMembers = members.filter(member => !member.bot);
		const ids = filterMembers.map(m => m.user.id);
		console.log(ids);
		for(let i = 0; i < ids.length; i++)
		{
			await Users.create({ user_id: ids[i],
									balance: 0,
									lifetime: 0,
									favoritePookie: "lappy",
									location: "pookieville",
									questTier: 0,
									questLifetime: 0 });
		}
		*/
    const storedBalances = await Users.findAll();
    storedBalances.forEach((b) => currency.set(b.user_id, b));

    console.log(`DB loaded! Logged in as ${client.user.tag}`);
  },
};
