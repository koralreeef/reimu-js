const { SlashCommandBuilder } = require("discord.js");
const { Quests } = require("../../db/dbObjects.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dropquest")
    .setDescription("drops current quest"),
  async execute(interaction) {
    const quest = await Quests.findOne({
      where: { user_id: interaction.user.id },
    });
    quest.destroy();
    return await interaction.reply("quest dropped.");
  },
};
