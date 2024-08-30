const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { Pookiebears } = require('../../db/dbObjects.js');
const { blue, gold, white, yellow, cornsilk } = require('color-name');

let embedColor = blue;
module.exports = {
	data: new SlashCommandBuilder()
		.setName('pookieinfo')
		.setDescription('find information on a single pookiebear')
        .addStringOption(option =>
			option.setName('name')
				.setDescription('what\'s their name')
				.setAutocomplete(true)
				.setRequired(true)),
	async autocomplete(interaction) {
		const focusedValue = interaction.options.getFocused();
		const pookies = await Pookiebears.findAll({ attributes: ['pookie_name'] });
		const choices = pookies.map(i => i.pookie_name);
		const filtered = choices.filter(choice => choice.startsWith(focusedValue)).slice(0, 25);
		await interaction.respond(
			filtered.map(choice => ({ name: choice, value: choice })),
		);
	},
	async execute(interaction) {
		
		const n = interaction.options.getString('name');
		const pookie = await Pookiebears.findOne(
			{ where: {pookie_name: n}});

		console.log(await pookie);
		if(pookie.rarity == "SSR") embedColor = gold;
		if(pookie.rarity.includes("+")) embedColor = white;
		if(pookie.rarity == "starry SSR") embedColor = cornsilk;
		if(pookie.rarity == "starry") embedColor = yellow;

		console.log(await Pookiebears.findAll());
		const attachment = new AttachmentBuilder(pookie.file_path);
		let pookieDate = pookie.createdAt;
		let pookieEmbed = new EmbedBuilder()
				.setAuthor({name: "pookiebear #"+pookie.id })
				.setTitle(pookie.pookie_name+"\nsummon count: "+pookie.summon_count)
                .setImage('attachment://'+pookie.file_path.substring(9))
                .setColor(embedColor)
                .setFooter({ text: `Creator: `+pookie.creator+" at "+pookieDate.toLocaleString(), 
                            iconURL: pookie.creatorURL })
    
		return interaction.reply({ embeds: [pookieEmbed], files: [attachment]});
	},
};