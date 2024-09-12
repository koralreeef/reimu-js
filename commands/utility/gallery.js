const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
  AttachmentBuilder,
} = require("discord.js");
const { Pookiebears, Users } = require("../../db/dbObjects.js");
const { blue } = require("color-name");
const { common } = require("../../helper.js");

// something with buttons

async function buildEmbed(pookie) {
  const embedColor = blue;
  const pookieEmbed = new EmbedBuilder()
    .setAuthor({ name: "pookiebear #" + pookie.id })
    .setTitle(pookie.pookie_name + "\nsummon count: " + pookie.summon_count)
    .setImage("attachment://" + pookie.file_path.substring(9))
    .setColor(embedColor)
    .setFooter({
      text:
        "Creator: " +
        pookie.creator +
        " at " +
        pookie.createdAt.toLocaleString(),
      iconURL: pookie.creatorURL,
    });
  return pookieEmbed;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("gallery")
    .setDescription("see all pookiebears registered"),

  // sort by rarity maybe eh
  async execute(interaction) {
    const pookieList = await Pookiebears.findAll({ where: { rarity: common } }); // find all where rarity common and rarity ssr + summon_count > 0
    const user = await Users.findOne({
      where: { user_id: interaction.user.id },
    });
    if (pookieList.length < 1) {
      return await interaction.reply("No pookiebears found!");
    }

    const epoch = Date.now();
    const forward = new ButtonBuilder()
      .setCustomId(user.user_id + "forwards" + epoch)
      .setLabel("⟶")
      .setStyle(ButtonStyle.Primary);

    const backward = new ButtonBuilder()
      .setCustomId(user.user_id + "backwards" + epoch)
      .setLabel("⟵")
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(backward, forward);

    // console.log(pookieList[0]);
    const attachment = new AttachmentBuilder(pookieList[0].file_path);
    const pookieEmbed = await buildEmbed(pookieList[0]);
    await interaction.reply({
      embeds: [pookieEmbed],
      files: [attachment],
      components: [row],
    });
    const collector = interaction.channel.createMessageComponentCollector();
    let index = 0;

    collector.on("collect", async (i) => {
      if (i.customId === user.user_id + "backwards" + epoch) {
        if (index == 0) {
          await i.update({ content: "cant go under first entry!" });
        } else {
          index--;
          const attachment = new AttachmentBuilder(pookieList[index].file_path);
          // console.log(pookieList[index]);
          const pookieEmbed = await buildEmbed(pookieList[index]);
          await i.update({
            content: "",
            embeds: [pookieEmbed],
            files: [attachment],
            components: [row],
          });
        }
      }
      if (i.customId === user.user_id + "forwards" + epoch) {
        if (index == pookieList.length - 1) {
          await i.update({ content: "cant go past last entry!" });
        } else {
          index++;
          const attachment = new AttachmentBuilder(pookieList[index].file_path);
          // console.log(pookieList[index]);
          const pookieEmbed = await buildEmbed(pookieList[index]);
          await i.update({
            content: "",
            embeds: [pookieEmbed],
            files: [attachment],
            components: [row],
          });
        }
      }

      collector.on("end", async () => {
        await interaction.editReply({
          content: "stopped gallery search",
          components: [],
        });
      });
    });
  },
};
