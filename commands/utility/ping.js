const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('gives latency'),
	async execute(interaction) {
		const sent = await interaction.reply({ content: 'ping', fetchReply: true });
		return await interaction.editReply(`ping: ${sent.createdTimestamp - interaction.createdTimestamp}ms`);
	},
};