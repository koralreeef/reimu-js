const { SlashCommandBuilder } = require('discord.js');
const { Users } = require('../../db/dbObjects.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('inventory')
		.setDescription('check your pookiebears or someone else\s')
                .addUserOption(option =>
			option.setName('user')
				.setDescription('who\'s inventory do you want to see')),

	async execute(interaction) {
        const target = interaction.options.getUser('user') ?? interaction.user;
        console.log("chosen user: "+target.id);

        const user = await Users.findOne({ where: { user_id: target.id } });
        if (user == null) return interaction.reply(`${target.tag} has nothing!`);

        const pookies = await user.getPookies(target.id);

        return interaction.reply(`${target.tag} currently has ${pookies.map(i => `${i?.amount} ${i?.pookie.pookie_name}`).join(', ')}`);
	},
};