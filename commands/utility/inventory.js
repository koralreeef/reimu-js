const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { Users, UserPookies, Pookiebears } = require('../../db/dbObjects.js');
const { blue, gold, white, yellow, cornsilk } = require('color-name');

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
        const attachment = new AttachmentBuilder(fav.file_path);
        if(fav.rarity == "100") embedColor = gold; //ssr
        if(fav.pookie_name.includes("+")) embedColor = white;
        if(fav.rarity == "300") embedColor = cornsilk; //starry ssr
        if(fav.rarity == "200") embedColor = yellow; //starry
        const invEmbed = new EmbedBuilder()
                .setTitle(target.tag+"\'s inventory:")
                .setThumbnail('attachment://'+fav.file_path.substring(9))
                .setColor(embedColor)
                .setDescription(`\`\`\`${pookies.map(i => `${i?.amount} ${i?.pookie.pookie_name}`).join('\n')}\`\`\``)
                .setFooter({ text: "total pookie attempts: "+user.lifetime+"\nfavorite pookie: "+fav.pookie_name });

        console.log(pookies.map(i => i.pookie.pookie_name));
        //how to sort by asc
        //interaction.reply(`${target.tag} currently has \n\`\`\`${pookies.map(i => `${i?.amount} ${i?.pookie.pookie_name}`).join('\n')}\`\`\``);
        return interaction.reply({ embeds: [invEmbed], files: [attachment]});
	},
};