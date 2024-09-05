const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
	.setName('display')
	.setDescription('displays a number of your choosing')
    .addIntegerOption(option =>
        option.setName('number')
            .setDescription('epic')
            .setRequired(true)),
	async execute(interaction) {
        const roll = interaction.options.getInteger('number');
		await interaction.reply('Nice number dude you chose: ' +roll);
	},
};