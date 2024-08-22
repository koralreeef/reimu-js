const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { Pookiebears } = require('../../db/dbObjects.js');

//HAGGLE SYSTEM IF YOU TRADE WITH THE BOT (RANDOM CHANCE TO GET DEALS)
module.exports = {
	data: new SlashCommandBuilder()
		.setName('tradepookie')
		.setDescription('give another user a trade offer for their pookies (WIP)'),
        /*
        .addStringOption(option =>
			option.setName('pookie11')
				.setDescription('what pookie are you trading')
				.setRequired(true))
        .addIntegerOption(option =>
            option.setName('amount11')
                .setDescription('how many are you trading')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('amount11')
                .setDescription('who is recieving this trade')
                .setRequired(true)),  
*/
	async execute(interaction) {
		return interaction.reply({ content: "wip", ephemeral: true})
	},
};