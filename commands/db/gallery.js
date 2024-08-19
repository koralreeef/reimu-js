const { SlashCommandBuilder } = require('discord.js');
const { Tags } = require('../../db/dbObjects.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gallery')
		.setDescription('see all pookiebears registered'),

	async execute(interaction) {
		const tagList = await Tags.findAll({ attributes: ['name'] });
        const tagString = tagList.map(t => t.name).join(', ') || 'No pookiebears found.';
    
        return interaction.reply(`current list of pookiebears: ${tagString}`);
	},
};