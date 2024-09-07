const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
  AttachmentBuilder,
} = require("discord.js");
const { Users, Quests, Pookiebears } = require("../../db/dbObjects.js");
const {
  locationMap,
  getEmbedColor,
  tierMap,
  starry,
} = require("../../helper.js");

async function buildEmbed(pookie, tier, amount) {
  const embedColor = getEmbedColor(pookie.pookie_name, pookie.rarity);
  const reward = (amount / 2).toFixed(0);
  const pookieEmbed = new EmbedBuilder()
    .setAuthor({ name: "quest tier: " + tier })
    .setTitle(pookie.pookie_name + "s needed: " + amount)
    .setThumbnail("attachment://" + pookie.file_path.substring(9))
    .setColor(embedColor)
    .setFooter({
      text:
        "reward: " +
        reward +
        " " +
        pookie.pookie_name +
        " " +
        tierMap.get(tier),
      iconURL: "attachment://" + pookie.file_path.substring(9),
    });
  return pookieEmbed;
}

async function buildCompleteEmbed(pookie, tier, amount) {
  const embedColor = getEmbedColor(pookie.pookie_name, pookie.rarity);
  const pookieEmbed = new EmbedBuilder()
    .setAuthor({ name: "quest tier: " + tier })
    .setTitle(pookie.pookie_name + "s recieved: " + amount)
    .setThumbnail("attachment://" + pookie.file_path.substring(9))
    .setColor(embedColor)
    .setFooter({
      text: "great work!",
      iconURL: "attachment://" + pookie.file_path.substring(9),
    });
  return pookieEmbed;
}

async function makeStarryPookie(
  name,
  fileName,
  avatarURL,
  username,
  rarity,
  source,
) {
  const pookie = await Pookiebears.create({
    pookie_name: "starry night " + name,
    file_path: "./images/" + fileName,
    creator: username,
    creatorURL: avatarURL,
    summon_count: 1,
    rarity: starry + rarity,
    source,
  });
  return pookie;
}

async function makePlusPookie(name, fileName, avatarURL, username, rarity) {
  const pookie = await Pookiebears.create({
    pookie_name: name + "+",
    file_path: "./images/" + fileName,
    creator: username,
    creatorURL: avatarURL,
    summon_count: 1,
    rarity: rarity + 5,
  });
  return pookie;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("turnin")
    .setDescription("check/turn in current quest"),
  async execute(interaction) {
    const user = await Users.findOne({
      where: { user_id: interaction.user.id },
    });
    const id = user.user_id;
    const quest = await Quests.findOne({ where: { user_id: id } });
    console.log(quest);
    if ((await quest) == null) {
      return await interaction.reply("no quest found!");
    }

    console.log(quest.due_amount);
    const loss = -quest.due_amount;
    console.log(loss);
    const p = await Pookiebears.findOne({ where: { id: quest.pookie_id } });

    const accept = new ButtonBuilder()
      .setCustomId("yes")
      .setLabel("yes")
      .setStyle(ButtonStyle.Success);

    const deny = new ButtonBuilder()
      .setCustomId("no")
      .setLabel("no")
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder().addComponents(accept, deny);

    const pookie = await Pookiebears.findOne({
      where: { id: quest.pookie_id },
    });
    const check = user.checkPookies(pookie, id, loss);
    const pookieEmbed = await buildEmbed(
      pookie,
      quest.questTier,
      quest.due_amount,
    );
    const attachment = new AttachmentBuilder(pookie.file_path);

    await interaction.deferReply();
    if ((await check) === true) {
      const response = await interaction.editReply({
        content: "would you like to turn in the current quest?",
        embeds: [pookieEmbed],
        files: [attachment],
        components: [row],
      });
      try {
        const collectorFilter = (i) => {
          if (i.user.id === interaction.user.id) return true;
          interaction.followUp({
            content: "this isnt your quest!",
            ephemeral: true,
          });
        };
        const confirmation = await response.awaitMessageComponent({
          filter: collectorFilter,
          time: 60_000,
        });
        if (confirmation.customId === "yes") {
          const reward = quest.reward;
          // idk
          if ((await user.checkAmount(p, id, loss)) == true) {
            user.addPookies(p, id, loss, p.rarity);
            user.destroyPookies(p, id);
            console.log(p.pookie_name + " destroyed.");
          } else {
            user.addPookies(p, id, loss, p.rarity);
          }

          let pookie = await Pookiebears.findOne({
            where: { pookie_name: reward },
          });
          if (pookie) {
            user.addPookies(pookie, id, quest.reward_amount, pookie.rarity);
          } else if (quest.questTier == 1) {
            const p = await Pookiebears.findOne({
              where: { id: quest.pookie_id },
            });
            const starName = p.pookie_name;
            const pookieFileName = p.file_path.substring(9);
            const avatarURL = interaction.user.displayAvatarURL();
            const userUsername = interaction.user.username;

            pookie = await makeStarryPookie(
              starName,
              pookieFileName,
              avatarURL,
              userUsername,
              p.rarity,
              p.source,
            );
            user.addPookies(pookie, id, quest.reward_amount, pookie.rarity);
          } else if (quest.questTier > 1) {
            const p = await Pookiebears.findOne({
              where: { id: quest.pookie_id },
            });
            const name = p.pookie_name;
            const pookieFileName = p.file_path.substring(9);
            const avatarURL = interaction.user.displayAvatarURL();
            const userUsername = interaction.user.username;

            pookie = await makePlusPookie(
              name,
              pookieFileName,
              avatarURL,
              userUsername,
              p.rarity,
            );
            user.addPookies(pookie, id, quest.reward_amount, pookie.rarity);
          }
          let newcount;
          let turnedin = false;
          if (
            quest.questTier == user.questTier ||
            quest.questTier == user.questTier - 1
          ) {
            newcount = user.questLifetime + 1;
            user.update(
              { questLifetime: newcount },
              { where: { user_id: user.id } },
            );
            turnedin = true;
          }
          console.log("lifetime quests: " + user.questLifetime);
          console.log("quest tier: " + user.questTier);
          let locationString = "";
          if (user.questLifetime % 5 == 0 && turnedin == true) {
            const newcount = user.questTier + 1;
            user.update(
              { questTier: newcount },
              { where: { user_id: user.id } },
            );

            const location = locationMap.get(user.questTier);
            if (user.questTier == 1) {
              locationString =
                "you unlocked the " +
                location +
                "! (/setlocation)" +
                "\nthis location has a chance to summon double pookies whenever you summon one!";
            }
            if (user.questTier == 2) {
              locationString =
                "you unlocked " +
                location +
                "!" +
                "\nthis mountain passively spews out 12 random pookies for you every hour!";
            }
            if (user.questTier == 3) {
              locationString =
                "you unlocked the " +
                location +
                "!" +
                "\nthis zone boosts the chance of the doublepookie skill by 25%!";
            }
            if (user.questTier == 4) {
              locationString =
                "you unlocked the " +
                location +
                "!" +
                "\nthis starry peak boosts the chances of starforce and allows you to find starry night pookies at any time!";
            }
          }

          const attachment = new AttachmentBuilder(pookie.file_path);
          const pookieEmbed = await buildCompleteEmbed(
            pookie,
            quest.questTier,
            quest.reward_amount,
          );
          quest.destroy();
          await confirmation.update({
            content: "**quest complete!**\n" + locationString,
            embeds: [pookieEmbed],
            files: [attachment],
            components: [],
          });
        } else if (confirmation.customId === "no") {
          await confirmation.update({
            content: "",
            embeds: [pookieEmbed],
            files: [attachment],
            components: [],
          });
        }
      } catch (err) {
        console.log(err);
        return await interaction.followUp("it broke");
      }
    } else {
      return await interaction.editReply({
        content: "",
        embeds: [pookieEmbed],
        files: [attachment],
        components: [],
      });
    }
  },
};
