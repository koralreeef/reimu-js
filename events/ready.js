const { Users } = require('../db/dbObjects.js');
const { currency, addTotalPookies, getTotalPookies } = require('../helper.js');
const { PresenceUpdateStatus } = require('discord.js');
const { ActivityType } = require('discord.js');
const { Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		let totalPookies = 0;
		const users = await Users.findAll();
		for(let i = 0; i < users.length; i++)
		{
			totalPookies += users[i].lifetime;
		}
		addTotalPookies(totalPookies);

		client.user.setActivity('activity', { type: ActivityType.Custom, name: "custom", state: getTotalPookies()+" pookies down in the fantastic blowhole"});
		client.user.setStatus(PresenceUpdateStatus.DoNotDisturb);

		const storedBalances = await Users.findAll();
		storedBalances.forEach(b => currency.set(b.user_id, b));

		console.log(`DB loaded! Logged in as ${client.user.tag}`);
    },
};
