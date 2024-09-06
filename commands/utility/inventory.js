const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { Users, UserPookies, Pookiebears } = require('../../db/dbObjects.js');
const { blue } = require('color-name');
const { getEmbedColor } = require('../../helper.js');

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

        let embedColor = blue;
        //check if someone is a user but doesnt have any pookiebears
        const unlucky = await UserPookies.findOne({ where: { user_id: target.id } }); 
        const user = await Users.findOne({ where: { user_id: target.id } });
        if (unlucky == null) return interaction.reply(`${target.tag} has nothing!`);
        const pookies = await user.getPookies(target.id);
        const fav = await Pookiebears.findOne({ where: { pookie_name: user.favoritePookie }});
        embedColor = getEmbedColor(fav.pookie_name, fav.rarity);
        const attachment = new AttachmentBuilder(fav.file_path);
        let remainder = user.questLifetime%5;
        let result = 5 - remainder;
        const invEmbed = new EmbedBuilder()
                .setTitle(target.tag+"\'s inventory:")
                .setThumbnail('attachment://'+fav.file_path.substring(9))
                .setColor(embedColor)
                .setDescription(`\n\`\`\`${pookies.map(i => `${i?.amount} ${i?.pookie.pookie_name}`).join('\n')}\`\`\``)
                .setFooter({ text: "location: "+user.location+"\nquest tier: "+user.questTier+"  ||  "+result+" quests until next tier\ntotal pookie attempts: "+user.lifetime+"\nfavorite pookie: "+fav.pookie_name});

        console.log(pookies.map(i => i.pookie.pookie_name));
        //how to sort by asc
        //interaction.reply(`${target.tag} currently has \n\`\`\`${pookies.map(i => `${i?.amount} ${i?.pookie.pookie_name}`).join('\n')}\`\`\``);
        await interaction.deferReply();
        return interaction.editReply({ embeds: [invEmbed], files: [attachment]});
	},
};