const { SlashCommandBuilder } = require("discord.js");

function convertToOverworld(n) {
  if (n == 0) return 0;
  return n * 8;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("overworld")
    .setDescription(
      "converts nether coords to overworld coords (overworld x or z * 8)",
    )
    .addIntegerOption((option) =>
      option.setName("x").setDescription("x value").setRequired(true),
    )
    .addIntegerOption((option) =>
      option.setName("z").setDescription("z value").setRequired(true),
    ),

  async execute(interaction) {
    let x = interaction.options.getInteger("x");
    let z = interaction.options.getInteger("z");

    let newX = convertToOverworld(x);
    let newZ = convertToOverworld(z);

    return interaction.reply(
      `nether coords ${x}, ${z} converted to ${newX}, ${newZ}`,
    );
  },
};
