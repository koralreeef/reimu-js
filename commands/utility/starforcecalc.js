const { SlashCommandBuilder } = require('discord.js');
const { Pookiebears } = require('../../db/dbObjects.js');
const regex = /\+/gm;

module.exports = {
	data: new SlashCommandBuilder()
        .setName('starforcecalc')
        .setDescription('calculates chance for a single starforce to succeed')
        .addStringOption(option =>
            option.setName('pookie')
                .setDescription('what pookie are you giving')
                .setAutocomplete(true)
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('how many are you giving')
                .setMinValue(1)
                .setMaxValue(25)
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName('all')
                .setDescription('+3% flat if gambling all pookies in inventory or gambling max number'))
        .addBooleanOption(option =>
            option.setName('starrynight')
                .setDescription('+30% flat if a starry night'))
        .addStringOption(option =>
            option.setName('location')
                .setDescription("does nothing rn")),
    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused();
        const pookies = await Pookiebears.findAll({ attributes: ['pookie_name'] });
        const choices = pookies.map(i => i.pookie_name);
        const filtered = choices.filter(choice => choice.startsWith(focusedValue)).slice(0, 5);
        await interaction.respond(
            filtered.map(choice => ({ name: choice, value: choice })),
        );
    },    
    
	async execute(interaction) {
        let pookie = interaction.options.getString('pookie');
        let amount = interaction.options.getInteger('amount');
        let allIn = interaction.options.getBoolean('all') || false;
        let star = interaction.options.getBoolean('starrynight') || false;
        let location = interaction.options.getString('location');

        let starMultiplier = 0;
        let all = 0;
        if (star) starMultiplier = 30;
        if (allIn) all = 3;

        let scaler = (pookie.match(regex)||[]).length;

        let rollToBeat = 50 - amount*2 - all - starMultiplier + (8 * scaler);
        let final = 100 - rollToBeat;
		return await interaction.reply('chance for a '+pookie+' star force to succeed: '+final+
                                '%\n50 - '+amount+'(2) - '+all+' - '+starMultiplier+' + (5('+scaler+
                                '))\nallIn: '+allIn+', starrynight: '+star+', scaler(+ amount): '+scaler);
	},
};