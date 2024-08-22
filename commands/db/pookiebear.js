const { SlashCommandBuilder } = require('discord.js');
const { Pookiebears } = require('../../db/dbObjects.js');
const { downloadFile } = require('../../helper.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pookiebear')
		.setDescription('register a pookiebear here')
        .addStringOption(option =>
			option.setName('name')
				.setDescription('what\'s their name')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('link')
				.setDescription('enter an image link')
				.setRequired(true)),

	async execute(interaction) {

		const name = interaction.options.getString('name');
		const url = interaction.options.getString('link');
		const fileName = name.replace(/ /g,"_");

        if(!url.startsWith("https://cdn.discordapp.com/attachments/")) 
		return await interaction.reply({ content: "only discord image links will be accepted (post your image in a channel and copy its link)", ephemeral: true});
		if(name.includes("+")) 
		return await interaction.reply({ content: "nice try man however thats reserved for the gamblers", ephemeral: true});
		let avatarURL = interaction.user.displayAvatarURL();
			try {
				// equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
				const pookie = await Pookiebears.create({
					pookie_name: name,
					file_path: "./images/"+fileName+".jpg",
					creator: interaction.user.username,
					creatorURL: avatarURL,
					summon_count: 0,
					rarity: "common"
				});
				await Pookiebears.create({
					pookie_name: name+" SSR",
					file_path: "./images/"+fileName+".jpg",
					creator: interaction.user.username,
					creatorURL: avatarURL,
					summon_count: 0,
					rarity: "SSR"
				})

				downloadFile(url, fileName+".jpg");
				interaction.reply(`pookiebear ${pookie.pookie_name} added.`);
        		let user = interaction.client.users.cache.get(interaction.user.id);
				return await interaction.client.users.send('109299841519099904', user.username+" just sent this epic pookiebear hell yaah brother \n"+url);
			}
			catch (error) {
				console.log(error);
				if (error.name === 'SequelizeUniqueConstraintError') {
					return interaction.reply('That pookiebear already exists.');
				}
				return interaction.reply('Something went wrong with adding a pookiebear.');
			}	
	},
};