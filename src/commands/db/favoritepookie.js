const { SlashCommandBuilder } = require("discord.js");
const { Users, UserPookies, Pookiebears } = require("../../db/dbObjects.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("favoritepookie")
    .setDescription("display your favorite pookie in your inventory")
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription(
          "which pookie is your favorite (automatically overwrites previous pookie)",
        )
        .setAutocomplete(true)
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
    const pookie = interaction.options.getString("name");
    const userPookie = await Pookiebears.findOne({
      where: { pookie_name: pookie },
    });
    const user = await Users.findOne({
      where: { user_id: interaction.user.id },
    });
    const p = await UserPookies.findOne({
      where: { pookie_id: userPookie.id, user_id: interaction.user.id },
    });
    console.log(userPookie);
    if (p) {
      user.update(
        { favoritePookie: userPookie.pookie_name },
        { where: { user_id: user.id } },
      );
      return await interaction.reply(
        "favorite pookiebear set to " + userPookie.pookie_name,
      );
    } else {
      return await interaction.reply("you dont have that pookiebear");
    }
  },
};
