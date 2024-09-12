const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
  AttachmentBuilder,
} = require("discord.js");
const { Users, UserPookies, Pookiebears } = require("../../db/dbObjects.js");
const { blue } = require("color-name");
const { getEmbedColor } = require("../../helper.js");

async function buildEmbed(
  user,
  username,
  fav,
  embedColor,
  result,
  pageNumber,
  pageCount,
  sort,
) {
  console.log(sort);
  const page = await user.getPage(user.user_id, pageNumber, sort);
  const list = await page
    .map((i) => `${i?.amount} ${i?.pookie.pookie_name}`)
    .join("\n");
  let pageString = "pg. " + pageNumber + " of " + pageCount;
  if (pageCount == 0) pageString = "";
  const invEmbed = new EmbedBuilder()
    .setTitle(username + "'s inventory:")
    .setThumbnail("attachment://" + fav.file_path.substring(9))
    .setColor(embedColor)
    .setDescription(`\n\`\`\`${list}\`\`\``)
    .setFooter({
      text:
        pageString +
        "\nlocation: " +
        user.location +
        "\nquest tier: " +
        user.questTier +
        "  ||  " +
        result +
        " quests until next tier\ntotal pookie attempts: " +
        user.lifetime +
        "\nfavorite pookie: " +
        fav.pookie_name,
    });
  console.log(invEmbed);
  return invEmbed;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("inventory")
    .setDescription("check your pookiebears or someone elses")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("who's inventory do you want to see"),
    )
    .addStringOption((option) =>
      option
        .setName("sorting")
        .addChoices(
          { name: "ascending rarity", value: "ASC" },
          { name: "descending rarity", value: "DESC" },
        )
        .setDescription("default is descending rarity"),
    ),

  async execute(interaction) {
    const target = interaction.options.getUser("user") ?? interaction.user;
    const sort = interaction.options.getString("sorting") ?? "DESC";
    console.log("chosen user: " + target.id);

    let embedColor = blue;
    // check if someone is a user but doesnt have any pookiebears
    const unlucky = await UserPookies.findOne({
      where: { user_id: target.id },
    });
    const user = await Users.findOne({ where: { user_id: target.id } });
    if (unlucky == null) return interaction.reply(`${target.tag} has nothing!`);
    const pookies = await user.getPookies(target.id);
    const fav = await Pookiebears.findOne({
      where: { pookie_name: user.favoritePookie },
    });
    embedColor = getEmbedColor(fav.pookie_name, fav.rarity);
    const attachment = new AttachmentBuilder(fav.file_path);
    const remainder = user.questLifetime % 5;
    const result = 5 - remainder;

    const forward = new ButtonBuilder()
      .setCustomId(user.user_id)
      .setLabel("⟶")
      .setStyle(ButtonStyle.Primary);

    const backward = new ButtonBuilder()
      .setCustomId(user.user_id + "1")
      .setLabel("⟵")
      .setDisabled(true)
      .setStyle(ButtonStyle.Primary);

    const stop = new ButtonBuilder()
      .setCustomId(user.user_id + "2")
      .setLabel("stop search")
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder().addComponents(backward, forward, stop);
    const totalPookies = pookies.length;
    let pageCount = (totalPookies / 25).toFixed(0);
    const invEmbed = await buildEmbed(
      user,
      target.tag,
      fav,
      embedColor,
      result,
      1,
      pageCount,
      sort,
    );

    //if less than 26 pookies
    if (pageCount == 0) {
      return await interaction.editReply({
        embeds: [invEmbed],
        files: [attachment],
      });
    }

    await interaction.deferReply();
    await interaction.editReply({
      embeds: [invEmbed],
      files: [attachment],
      components: [row],
    });
    console.log(
      "total pookies: " + totalPookies + "\npage numbers: " + pageCount,
    );

    const filter = (i) => i.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector(
      filter,
      (time = 120_000),
    );
    let index = 1;
    collector.on("collect", async (i) => {
      //gray out buttons on page end
      if (i.customId === user.user_id + "1") {
        index--;
        if (index == 1) backward.setDisabled(true);
        forward.setDisabled(false);
        const invEmbed = await buildEmbed(
          user,
          target.tag,
          fav,
          embedColor,
          result,
          index,
          pageCount,
          sort,
        );
        await i.update({
          content: "",
          embeds: [invEmbed],
          files: [attachment],
          components: [row],
        });
      }
      if (i.customId === user.user_id) {
        index++;
        if (index == pageCount) forward.setDisabled(true);
        backward.setDisabled(false);
        const invEmbed = await buildEmbed(
          user,
          target.tag,
          fav,
          embedColor,
          result,
          index,
          pageCount,
          sort,
        );
        await i.update({
          content: "",
          embeds: [invEmbed],
          files: [attachment],
          components: [row],
        });
      }
      if (i.customId === user.user_id + "2") {
        collector.stop();
      }

      collector.on("end", async (i) => {
        await interaction.editReply({
          content: "stopped inventory search",
          components: [],
        });
      });
    });
  },
};
