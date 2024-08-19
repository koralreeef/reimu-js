const { SlashCommandBuilder } = require('discord.js');
const { Tags } = require('../../db/dbObjects.js');

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
        
        const link = interaction.options.getString('link');
		
        if(!link.startsWith("https")) 
		return await interaction.reply({ content: "we need regular links man ", ephemeral: true});

			const tagName = interaction.options.getString('name');
			const tagDescription = interaction.options.getString('link');
			let avatarURL = interaction.user.displayAvatarURL();
			try {
				// equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
				const tag = await Tags.create({
					name: tagName,
					description: tagDescription,
					username: interaction.user.username,
					userAvatar: avatarURL, 
					usage_count: 0,
					rarity: "common"
				});
				await Tags.create({
					name: tagName+" SSR",
					description: tagDescription,
					username: interaction.user.username,
					userAvatar: avatarURL, 
					usage_count: 0,
					rarity: "SSR"
				})
	
				interaction.reply(`pookiebear ${tag.name} added.`);
        		let user = interaction.client.users.cache.get(interaction.user.id);
				return await interaction.client.users.send('109299841519099904', user.username+" just sent this epic pookiebear hell yaah brother \n"+link);
			}
			catch (error) {
				if (error.name === 'SequelizeUniqueConstraintError') {
					return interaction.reply('That pookiebear already exists.');
				}
	
				return interaction.reply('Something went wrong with adding a tag.');
			}	
	},
};