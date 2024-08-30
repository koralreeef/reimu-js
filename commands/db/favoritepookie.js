const { SlashCommandBuilder } = require('discord.js');
const { LegacyClient } = require('osu-web.js');
const { osuUsers } = require('../../db/dbObjects.js');
const { AccessToken } = require('../../config.json');
const legacyApi = new LegacyClient(AccessToken);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('favoritepookie')
		.setDescription('display your favorite pookie in your inventory')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('what is your osu name (automatically overwrites previous name')
                .setRequired(true)),

	async execute(interaction) {
        
    }
};