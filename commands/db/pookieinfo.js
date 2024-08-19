const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Tags } = require('../../db/dbObjects.js');
const { blue, gold } = require('color-name');

let embedColor = blue;
module.exports = {
	data: new SlashCommandBuilder()
		.setName('pookieinfo')
		.setDescription('find information on a single pookiebear')
        .addStringOption(option =>
			option.setName('name')
				.setDescription('what\'s their name')
				.setRequired(true)),

	async execute(interaction) {
		
		const n = interaction.options.getString('name');
		const currentTag = await Tags.findOne(
			{ where: {name: n}});
		if(currentTag.rarity == "SSR") embedColor = gold;

		let tagDate = currentTag.createdAt;
		let pookieEmbed = new EmbedBuilder()
				.setAuthor({name: "pookiebear #"+currentTag.id })
											//DUDE
				.setTitle(currentTag.name+"\t\t\t\t\t\tsummon count: "+currentTag.usage_count)
                .setImage(currentTag.description)
                .setColor(embedColor)
                .setFooter({ text: `Creator: `+currentTag.username+" at "+tagDate.toLocaleString(), 
                            iconURL: currentTag.userAvatar })
    
		return interaction.reply({ embeds: [pookieEmbed]});
	},
};