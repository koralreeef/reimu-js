const { SlashCommandBuilder } = require('discord.js');
const { LegacyClient } = require('osu-web.js');
const { osuUsers } = require('../../db/dbObjects.js');
const { AccessToken } = require('../../config.json');
const legacyApi = new LegacyClient(AccessToken);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('osuset')
		.setDescription('register your osu name')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('what is your osu name (automatically overwrites previous name')
                .setRequired(true)),

	async execute(interaction) {
        id = interaction.user.id;
        const osuName = interaction.options.getString('name');

        const u = await legacyApi.getUser({
            u: osuName
        })     

        console.log(u);
        const check = await osuUsers.findOne({ where: {user_id: id }});
        if(u){
            if(!check) {
                await osuUsers.create({ user_id: id, username: osuName });
                console.log("hey guys");
                return interaction.reply("registered "+osuName+"!");
            } else {
                osuUsers.update({ username: osuName}, 
                    {where: {user_id: id} }
             )};
             return interaction.reply("updated "+interaction.user.username+" to be "+osuName+"!");
        } else{
        return interaction.reply("couldnt find player!");
        }
	},
};