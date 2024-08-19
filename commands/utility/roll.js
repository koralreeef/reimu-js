const { SlashCommandBuilder } = require('discord.js');

function getRandomInt(max) {
	return Math.floor(Math.random() * max);
  }

function dubsChecker(num) {
	    // Find the last digit
		var digit = num % 10;
	while (num != 0)
	{
		var current_digit = num % 10;
		num = parseInt(num / 10);
		if (current_digit != digit)
		{
			return false;
		}
	}
	return true;
}

var roll;
roll = 0;

module.exports = {
	data: new SlashCommandBuilder()
	.setName('roll')
	.setDescription('Rolls a number from 1 to a number (default/max 1000)')
    .addIntegerOption(option =>
        option.setName('number')
            .setDescription('number to set max roll to')
			.setMaxValue(1000)
			.setRequired(true)),
			
	async execute(interaction) {
		var num = interaction.options.getInteger('number');
		roll = getRandomInt(num);
		await interaction.reply('You rolled: ' + roll);
		if(dubsChecker(roll) == true)
		{
			if(roll < 100 && roll > 10)
				await interaction.followUp('dubs!!');
			if(roll> 100)
				await interaction.followUp('trips!!');
		}
	},
};