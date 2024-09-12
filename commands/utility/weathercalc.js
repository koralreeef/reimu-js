const { SlashCommandBuilder } = require("discord.js");
const { Users } = require("./db/dbObjects.js");

const weatherCheck = 9999;
module.exports = {
  data: new SlashCommandBuilder()
    .setName("weathercalc")
    .setDescription("calculates weather chances over period of time")
    .addIntegerOption((option) =>
      option
        .setName("minutes")
        .setDescription("epic")
        .setMinValue(1)
        .setRequired(true),
    )
    .addIntegerOption((option) =>
      option
        .setName("chance")
        .setDescription("1-chance/1000")
        .setMinValue(1)
        .setMaxValue(10000)
        .setRequired(true),
    ),
  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused();
    const user = await Users.findOne({
      where: { user_id: interaction.user.id },
    });
    const pookies = await user.getPookies(interaction.user.id);
    const choices = pookies.map((i) => i.pookie.pookie_name);
    const filtered = choices
      .filter((choice) => choice.startsWith(focusedValue))
      .slice(0, 5);
    await interaction.respond(
      filtered.map((choice) => ({ name: choice, value: choice })),
    );
  },
  async execute(interaction) {
    let roll = interaction.options.getInteger("minutes");
    const select = interaction.options.getInteger("chance");
    const chance = select / 10000;
    let final = 1 - Math.pow(chance, roll);
    final = final.toFixed(2) * 100;
    await interaction.reply(
      "chance for weather over " +
        roll +
        " minutes: " +
        final +
        "%\nweather chance: " +
        select +
        "\\10000, " +
        "second weather chance: " +
        weatherCheck +
        "\\10000",
    );
  },
};
