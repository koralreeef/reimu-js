const { SlashCommandBuilder } = require('discord.js');
const { Pookiebears } = require('../../db/dbObjects.js');
//something with buttons
module.exports = {
	data: new SlashCommandBuilder()
		.setName('gallery')
		.setDescription('see all pookiebears registered'),

	async execute(interaction) {
		const pookieList = await Pookiebears.findAll({ attributes: ['pookie_name'], where: { rarity: "common"}}); //find all where rarity common and rarity ssr + summon_count > 0
        const pookieString = pookieList.map(t => t.pookie_name).join(', ') || 'No pookiebears found.';
    
        return interaction.reply(`current list of pookiebears: ${pookieString}`);
	},
};