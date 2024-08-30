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
			const starryName = "starry night "+pookieName;
			const starrySSR = "starry night "+pookieName+" SSR";
			// equivalent to: DELETE from tags WHERE name = ?;
			const deletedPookie = await Pookiebears.findOne({ where: {pookie_name: pookieName}});
			const deletedSSRPookie = await Pookiebears.findOne({ where: {pookie_name: ssrName}});
			const deletedstarPookie = await Pookiebears.findOne({ where: {pookie_name: starryName}});
			const deletedstarPookieSSR = await Pookiebears.findOne({ where: {pookie_name: starrySSR}});
	
			await UserPookies.destroy({ where: { pookie_id: deletedPookie.id } });
			await UserPookies.destroy({ where: { pookie_id: deletedSSRPookie.id } });
			await UserPookies.destroy({ where: { pookie_id: deletedstarPookie.id } });
			await UserPookies.destroy({ where: { pookie_id: deletedstarPookieSSR.id } });

			//THIS FUCKING SUCKS SOO BAD ASDFKMASDFKSAF
			const pookieDelete = await Pookiebears.destroy({ where: { pookie_name: pookieName } });
			await Pookiebears.destroy({ where: { pookie_name: ssrName } });
			await Pookiebears.destroy({ where: { pookie_name: starryName } });
			await Pookiebears.destroy({ where: { pookie_name: starrySSR } });

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