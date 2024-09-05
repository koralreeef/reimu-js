const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { Pookiebears, UserPookies } = require('../../db/dbObjects.js');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('precisedelete')
		.setDescription('delete single type of pookiebear')
        .addStringOption(option =>
			option.setName('name')
				.setDescription('what\'s their name')
				.setRequired(true))
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	async execute(interaction) {
		{
			const pookieName = interaction.options.getString('name');

			// equivalent to: DELETE from tags WHERE name = ?;
			const deletedPookie = await Pookiebears.findOne({ where: {pookie_name: pookieName}});
	
			await UserPookies.destroy({ where: { pookie_id: deletedPookie.id } });

			const pookieDelete = await Pookiebears.destroy({ where: { pookie_name: pookieName } });

			if (!pookieDelete) return interaction.reply('That pookiebear doesn\'t exist.');
			
			return interaction.reply('pookiebear '+pookieName+' deleted.');
		}
	},
};