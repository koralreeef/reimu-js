const { Users } = require('../db/dbObjects.js');
const { currency } = require('../helper.js');
const { PresenceUpdateStatus } = require('discord.js');
const { Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {

		client.user.setStatus(PresenceUpdateStatus.DoNotDisturb);
		
		const storedBalances = await Users.findAll();
		storedBalances.forEach(b => currency.set(b.user_id, b));

		console.log(`DB loaded! Logged in as ${client.user.tag}`);
    },
};
