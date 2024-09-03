const { SlashCommandBuilder } = require('discord.js');
const { getSnowy, getStarnight, getRainy, getHurricane, getHurricanePookie } = require('../../helper.js');

module.exports = {
	data: new SlashCommandBuilder()
	.setName('currentweather')
	.setDescription('displays weather and its duration'),

	async execute(interaction) {
        let snowyString = "";
        let rainyString = "";
        let starryString = "";
        let hurricaneString = "";
        if(getRainy())
            rainyString = "it is currently **raining**. pookiebears might be more common!\n";
        if(getSnowy())
            snowyString = "it is currently **snowing**. watch for those SSR pookiebears!\n";
        if(getStarnight())
            starryString = "it is currently **a starry night**. some rare pookiebears might appear...\n";
        if(getHurricane())
            hurricaneString = "there is a hurricane of "+getHurricanePookie()+" currently! save them all while you can!\n";
        if(getSnowy() == false && getRainy() == false && getStarnight() == false && getHurricane() == false)
        {
            return await interaction.reply("its a clear sky with no weather.");
        } else
        {
            return await interaction.reply(rainyString+snowyString+starryString+hurricaneString);
        }
	},
};