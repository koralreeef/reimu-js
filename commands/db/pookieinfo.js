const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { Pookiebears } = require('../../db/dbObjects.js');
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
		const pookie = await Pookiebears.findOne(
			{ where: {pookie_name: n}});

		if(pookie.rarity == "SSR") embedColor = gold;

		const attachment = new AttachmentBuilder(pookie.file_path);
		let pookieDate = pookie.createdAt;
		let pookieEmbed = new EmbedBuilder()
				.setAuthor({name: "pookiebear #"+pookie.id })
											//DUDE
				.setTitle(pookie.pookie_name+"\t\t\t\t\t\tsummon count: "+pookie.summon_count)
                .setImage('attachment://'+pookie.file_path.substring(9))
                .setColor(embedColor)
                .setFooter({ text: `Creator: `+pookie.creator+" at "+pookieDate.toLocaleString(), 
                            iconURL: pookie.creatorURL })
    
		return interaction.reply({ embeds: [pookieEmbed], files: [attachment]});
	},
};