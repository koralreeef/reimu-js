const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Users, UserPookies } = require('../../db/dbObjects.js');

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

        //check if someone is a user but doesnt have any pookiebears
        const unlucky = await UserPookies.findOne({ where: { user_id: target.id } }); 
        const user = await Users.findOne({ where: { user_id: target.id } });
        if (unlucky == null) return interaction.reply(`${target.tag} has nothing!`);

        const pookies = await user.getPookies(target.id);
        const invEmbed = new EmbedBuilder()
                .setTitle(target.tag+"\'s inventory:")
                .setDescription(`\`\`\`${pookies.map(i => `${i?.amount} ${i?.pookie.pookie_name}`).join('\n')}\`\`\``);

        console.log(await pookies.map);
        //how to sort by asc
        //interaction.reply(`${target.tag} currently has \n\`\`\`${pookies.map(i => `${i?.amount} ${i?.pookie.pookie_name}`).join('\n')}\`\`\``);
        return interaction.reply({ embeds: [invEmbed]});
	},
};