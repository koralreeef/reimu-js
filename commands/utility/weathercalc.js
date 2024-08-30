const { SlashCommandBuilder } = require('discord.js');

var rainyChance = 1000 - 900;
var snowyChance = 1000 - 950;
var starNightChance = 1000 - 950;
var weatherCheck = 1000 - 950;
module.exports = {
	data: new SlashCommandBuilder()
	.setName('weathercalc')
	.setDescription('calculates weather chances over period of time')
    .addIntegerOption(option =>
        option.setName('minutes')
            .setDescription('epic')
            .setMinValue(1)
            .setRequired(true)),
	async execute(interaction) {
        let roll = interaction.options.getInteger('minutes');
        roll = roll * 4;
        let chance = rainyChance/1000 * weatherCheck/1000; 
        let final = chance * roll;
		await interaction.reply('chance for weather over '+roll+' cycles: '+final+'%');
	},
};