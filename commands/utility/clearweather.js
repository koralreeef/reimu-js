const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const {
  setSnowy,
  setStarnight,
  setRainy,
  setHurricane,
  setRainDuration,
  setSnowDuration,
  setStarnightDuration,
} = require("../../helper.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clearweather")
    .setDescription("clears weather")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    setSnowy(false);
    setSnowDuration(0);
    setStarnight(false);
    setStarnightDuration(0);
    setRainy(false);
    setRainDuration(0);
    setHurricane(false);
    true;
    return await interaction.reply("weather cleared");
  },
};
