const { SlashCommandBuilder } = require('discord.js');

var rainyChance = 900;
var snowyChance = 950;
var starNightChance = 999;
var weatherCheck = 9999;
module.exports = {
	data: new SlashCommandBuilder()
	.setName('weathercalc')
	.setDescription('calculates weather chances over period of time')
    .addIntegerOption(option =>
        option.setName('minutes')
            .setDescription('epic')
            .setMinValue(1)
            .setRequired(true))
    .addIntegerOption(option =>
        option.setName('chance')
            .setDescription('1-chance/1000')
            .setMinValue(1)
            .setMaxValue(10000)
            .setRequired(true)),
	async execute(interaction) {
        let roll = interaction.options.getInteger('minutes');
        let select = interaction.options.getInteger('chance');
        roll = roll;
        let chance = select/10000
        let final = 1-(Math.pow(chance, roll));
        final = final.toFixed(2) * 100;
		await interaction.reply('chance for weather over '+roll+' minutes: '+final+
                    '%\nweather chance: '+select+'\\10000, '+'second weather chance: '+weatherCheck+'\\10000');
	},
};