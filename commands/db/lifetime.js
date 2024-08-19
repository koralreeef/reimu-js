const { SlashCommandBuilder } = require('discord.js');
const { getLifetime } = require('../../helper.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('lifetime')
		.setDescription('check pookiebear attempts'),

	async execute(interaction) {
		const target = interaction.options.getUser('user') ?? interaction.user;
        console.log(target.tag);
        console.log(target.id);
		return interaction.reply(`${target.tag} has tried to summon a pookiebear ${getLifetime(target.id)} times in their lifetime!`);
	},
};