const { SlashCommandBuilder } = require('discord.js');
const { Tags, UserPookies } = require('../../db/dbObjects.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pookiedelete')
		.setDescription('kill a pookiebear (oh no)')
        .addStringOption(option =>
			option.setName('name')
				.setDescription('what\'s their name')
				.setRequired(true)),

	async execute(interaction) {
		{
			const tagName = interaction.options.getString('name');
			const ssrName = tagName+" SSR";
			// equivalent to: DELETE from tags WHERE name = ?;
			const deletedTag = await Tags.findOne({ where: {name: tagName}});
			const deletedSSRTag = await Tags.findOne({ where: {name: ssrName}});
	
			await UserPookies.destroy({ where: { pookie_id: deletedTag.id } });
			await UserPookies.destroy({ where: { pookie_id: deletedSSRTag.id } });
	
			//THIS FUCKING SUCKS
			const tagDelete = await Tags.destroy({ where: { name: tagName } });
			await Tags.destroy({ where: { name: ssrName } });
		
			if (!tagDelete) return interaction.reply('That pookiebear doesn\'t exist.');
		
			return interaction.reply('pookiebears deleted.');
		}
	},
};