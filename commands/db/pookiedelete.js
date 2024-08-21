const { SlashCommandBuilder } = require('discord.js');
const { Pookiebears, UserPookies } = require('../../db/dbObjects.js');
const fs = require('fs');

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
			const pookieName = interaction.options.getString('name');
			const ssrName = pookieName+" SSR";
			// equivalent to: DELETE from tags WHERE name = ?;
			const deletedPookie = await Pookiebears.findOne({ where: {pookie_name: pookieName}});
			const deletedSSRPookie = await Pookiebears.findOne({ where: {pookie_name: ssrName}});
	
			await UserPookies.destroy({ where: { pookie_id: deletedPookie.id } });
			await UserPookies.destroy({ where: { pookie_id: deletedSSRPookie.id } });
	
			//THIS FUCKING SUCKS
			const pookieDelete = await Pookiebears.destroy({ where: { pookie_name: pookieName } });
			await Pookiebears.destroy({ where: { pookie_name: ssrName } });

			// Asynchronously delete a file
			fs.unlinkSync(deletedPookie.file_path, (err) => {
			if (err) {
				// Handle specific error if any
				if (err.code === 'ENOENT') {
				console.error('File does not exist.');
				} else {
				throw err;
				}
			} else {
				console.log('File deleted!');
			}
			});

			if (!pookieDelete) return interaction.reply('That pookiebear doesn\'t exist.');
			
			return interaction.reply('pookiebear '+pookieName+' deleted.');
		}
	},
};