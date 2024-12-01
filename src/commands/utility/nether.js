const { SlashCommandBuilder } = require("discord.js");

function convertToNether(n) {
  if (n == 0) return 0;
  return (n / 8).toFixed(0);
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("nether")
    .setDescription(
      "converts overworld coords to nether coords (overworld x or z / 8)",
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

    let newX = convertToNether(x);
    let newZ = convertToNether(z);

    return interaction.reply(
      `overworld coords ${x}, ${z} converted to ${newX}, ${newZ}`,
    );
  },
};
