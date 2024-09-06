const {
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder,
} = require("discord.js");
const { Users, UserPookies, Pookiebears } = require("../../db/dbObjects.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("givepookie")
    .setDescription("give another user some pookies")
    .addStringOption((option) =>
      option
        .setName("pookie")
        .setDescription("what pookie are you giving")
        .setAutocomplete(true)
        .setRequired(true),
    )
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("how many are you giving")
        .setMinValue(1)
        .setRequired(true),
    )
    /*
        .addStringOption(option =>
            option.setName('pookie2')
                .setDescription('what pookie are you giving')
                .setAutocomplete(true))
        .addIntegerOption(option =>
            option.setName('amount2')
                .setDescription('how many are you giving')
                .setMinValue(1))

        .addStringOption(option =>
            option.setName('pookie3')
                .setDescription('what pookie are you giving')
                .setAutocomplete(true))
        .addIntegerOption(option =>
            option.setName('amount3')
                .setDescription('how many are you giving')
                .setMinValue(1))
*/
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("who is recieving these pookies")
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
    const tar = interaction.options.getUser("target");
    const senderID = interaction.user.id;
    if (senderID == tar.id) {
      return interaction.reply("you cannot send pookies to yourself...");
    }
    const pookie = interaction.options.getString("pookie");
    const amount = interaction.options.getInteger("amount");
    const loss = -amount;
    try {
      const senderPookie = await Pookiebears.findOne({
        where: { pookie_name: pookie },
      });
      const sender = await Users.findOne({ where: { user_id: senderID } });
      const target = await Users.findOne({ where: { user_id: tar.id } });
      const check = sender.checkPookies(senderPookie, senderID, loss);
      console.log(await check);
      if ((await check) == true) {
        sender.addPookies(senderPookie, senderID, loss, senderPookie.rarity);
        target.addPookies(senderPookie, tar.id, amount, senderPookie.rarity);
        if ((await sender.checkAmount(senderPookie, senderID, loss)) == true) {
          sender.destroyPookies(senderPookie, senderID);
          return interaction.reply(
            "gave **ALL " +
              amount +
              " of their " +
              pookie +
              "** to <@" +
              tar +
              ">! WHAT A GREAT PERSON!!!",
          );
        }
        return interaction.reply(
          "gave **" +
            amount +
            " " +
            pookie +
            "** to <@" +
            tar +
            ">! what a nice person!!",
        );
      } else {
        return interaction.reply({
          content: "you dont have enough of those brokie",
          ephemeral: true,
        });
      }
    } catch (err) {
      console.log(err);
      return interaction.reply({ content: "it broke", ephemeral: true });
    }
  },
};
