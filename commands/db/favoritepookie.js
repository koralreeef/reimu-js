const { SlashCommandBuilder } = require('discord.js');
const { Users, Pookiebears } = require('../../db/dbObjects.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('favoritepookie')
		.setDescription('display your favorite pookie in your inventory')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('which pookie is your favorite (automatically overwrites previous pookie)')
                .setAutocomplete(true)
                .setRequired(true)),
    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused();
        const user = await Users.findOne({ where: { user_id: interaction.user.id } });
        const pookies = await user.getPookies(interaction.user.id);
        const choices = pookies.map(i => i.pookie.pookie_name);
        const filtered = choices.filter(choice => choice.startsWith(focusedValue)).slice(0, 5);
        await interaction.respond(
            filtered.map(choice => ({ name: choice, value: choice })),
        );
    },
	async execute(interaction) {
        const pookie = interaction.options.getString('name');
        const user = await Users.findOne({ where: {user_id: interaction.user.id}});
        const p = await Pookiebears.findOne({ where: {pookie_name: pookie}});
        if(p)
        { 
            user.update({ favoritePookie: p.pookie_name }, 
                { where: {user_id: user.id} 
             });
             return await interaction.reply("favorite pookiebear set to "+p.pookie_name);
        } else {
            return await interaction.reply("that pookiebear doesnt exist");
        }
    }
};