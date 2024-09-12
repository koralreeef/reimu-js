const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
  AttachmentBuilder,
} = require("discord.js");
const { Users, Pookiebears, Quests } = require("../../db/dbObjects.js");
const {
  getRandomInt,
  common,
  ssr,
  starry,
  starry_ssr,
  getEmbedColor,
} = require("../../helper.js");
const { Op } = require("sequelize");

const tierMap = new Map([
  [0, "ssr pookies"],
  [1, "starry night pookies"],
  [2, "plus pookies"],
  [3, "plus pookies"],
  [4, "plus plus pookies"],
]);

async function buildEmbed(user, pookie, tier, amount) {
  const embedColor = getEmbedColor(pookie.pookie_name, pookie.rarity);
  const reward = (amount / 2).toFixed(0);
  let tierString = tierMap.get(tier);
  let starString = "";
  let string = "";
  // PLEASE REWRITE THIS OH MY GOD
  if (tierMap.get(tier).includes("starry night")) {
    starString = "starry night ";
    string = "pookies";
    tierString = "";
  }
  const pookieEmbed = new EmbedBuilder()
    .setAuthor({ name: "quest tier: " + tier })
    .setTitle(
      pookie.pookie_name +
        "s needed: " +
        amount +
        "\npookies on hand: " +
        (await user.getPookie(pookie, user.user_id)),
    )
    .setThumbnail("attachment://" + pookie.file_path.substring(9))
    .setColor(embedColor)
    .setFooter({
      text:
        "reward: " +
        reward +
        " " +
        starString +
        "" +
        pookie.pookie_name +
        " " +
        tierString +
        string,
      iconURL: "attachment://" + pookie.file_path.substring(9),
    });
  return pookieEmbed;
}
async function pookieGenerator(tier) {
  let pookie;
  if (tier == 0) {
    pookie = await Pookiebears.findAll({ where: { rarity: common } });
  }
  if (tier == 1) {
    pookie = await Pookiebears.findAll({
      where: { rarity: { [Op.or]: [common, ssr] } },
    });
  }
  if (tier == 2) {
    pookie = await Pookiebears.findAll({
      where: { rarity: { [Op.or]: [common, ssr, starry] } },
    });
  }
  if (tier == 3) {
    pookie = await Pookiebears.findAll({
      where: { rarity: { [Op.or]: [common, ssr, starry, starry_ssr] } },
    });
  }
  if (tier == 4) {
    pookie = await Pookiebears.findAll({
      where: { rarity: { [Op.or]: [common, ssr, starry, starry_ssr] } },
    });
  }
  const name = pookie[getRandomInt(pookie.length)];
  // questString = "i need "+amount+" "+name.pookie_name+"s please!!!!! ill convert them half of them to ssrs just for you!!"
  // questString = "i need "+amount+" "+name.pookie_name+"s please!!!!! ill convert them half of them to starry night pookies just for you!!"
  // questString = "i need "+amount+" "+name.pookie_name+"s please!!!!! ill convert them half of them to starry night pookies just for you!!"
  console.log(name);
  return name;
}
/* testing purposes
async function amountGenerator(tier, p){
    if(tier == 0)
        amount = 2 + getRandomInt(3);
    if(tier == 1)
    {
        amount = 4 + getRandomInt(6);
        if(p.rarity == ssr) amount = (amount/4).toFixed(0);
    }
    if(tier == 2)
    {
        amount = 8 + getRandomInt(12);
        if(p.rarity == ssr) amount = (amount/4).toFixed(0);
        if(p.rarity == starry) amount = (amount/2).toFixed(0);
    }
    if(tier == 3)
        {
            amount = 16 + getRandomInt(24);
            if(p.rarity == ssr) amount = (amount/4).toFixed(0);
            if(p.rarity == starry) amount = (amount/2).toFixed(0);
            if(p.rarity == starry_ssr) amount = (amount/8).toFixed(0);
        }
    return amount;
}
*/
async function amountGenerator(tier, p) {
  let amount;

  if (tier == 0) amount = 20 + getRandomInt(10);
  if (tier == 1) {
    amount = 40 + getRandomInt(30);
    if (p.rarity == ssr) amount = (amount / 4).toFixed(0);
  }
  if (tier == 2) {
    amount = 80 + getRandomInt(60);
    if (p.rarity == ssr) amount = (amount / 4).toFixed(0);
    if (p.rarity == starry) amount = (amount / 6).toFixed(0);
  }
  if (tier == 3) {
    amount = 160 + getRandomInt(120);
    if (p.rarity == ssr) amount = (amount / 4).toFixed(0);
    if (p.rarity == starry) amount = (amount / 6).toFixed(0);
    if (p.rarity == starry_ssr) amount = (amount / 8).toFixed(0);
  }
  if (tier == 4) {
    amount = 320 + getRandomInt(480);
    if (p.rarity == ssr) amount = (amount / 4).toFixed(0);
    if (p.rarity == starry) amount = (amount / 6).toFixed(0);
    if (p.rarity == starry_ssr) amount = (amount / 8).toFixed(0);
  }
  return amount;
}

async function rewardGenerator(tier, p) {
  let pookie;
  if (tier == 0) pookie = p.pookie_name + " ssr";
  if (tier == 1) pookie = "starry night " + p.pookie_name;
  if (tier == 2) pookie = p.pookie_name + "+";
  if (tier == 3) pookie = p.pookie_name + "+";
  if (tier == 4) pookie = p.pookie_name + "++";
  // questString = "i need "+amount+" "+name.pookie_name+"s please!!!!! ill convert them half of them to ssrs just for you!!"
  // questString = "i need "+amount+" "+name.pookie_name+"s please!!!!! ill convert them half of them to starry night pookies just for you!!"
  // questString = "i need "+amount+" "+name.pookie_name+"s please!!!!! ill convert them half of them to starry night pookies just for you!!"

  return pookie;
}
module.exports = {
  cooldown: 1,
  data: new SlashCommandBuilder()
    .setName("quest")
    .setDescription("check current quest")
    .addIntegerOption((option) =>
      option
        .setName("questtier")
        .setDescription("specify what tier of quests to generate"),
    ),

  async execute(interaction) {
    const user = await Users.findOne({
      where: { user_id: interaction.user.id },
    });
    if (!user) {
      return await interaction.reply("you havent summoned a pookiebear yet!");
    }

    const tier = Math.min(
      interaction.options.getInteger("questtier") ?? user.questTier,
      4,
    );
    const check = await Quests.findOne({
      where: { user_id: interaction.user.id },
    });
    if (check) {
      console.log(await check);
      return await interaction.reply("you already have a quest!");
    }
    if (tier > user.questTier) {
      return await interaction.reply(
        "your quest tier isnt high enough! (" +
          user.questTier +
          " < " +
          tier +
          ")",
      );
    }

    // const userTier = Math.floor(user.quest/4);
    // figure out how to assign boss quests

    const reroll = new ButtonBuilder()
      .setCustomId(user.user_id)
      .setLabel("🎲")
      .setStyle(ButtonStyle.Primary);

    const accept = new ButtonBuilder()
      .setCustomId(user.user_id + "1")
      .setLabel("accept")
      .setStyle(ButtonStyle.Success);

    const deny = new ButtonBuilder()
      .setCustomId(user.user_id + "2")
      .setLabel("stop search")
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder().addComponents(reroll, accept, deny);

    let currentQuestPookie = await pookieGenerator(tier);
    let amount = await amountGenerator(tier, currentQuestPookie);

    // TODO make this an Enum
    let questState = "PENDING";
    let lastInteraction = null;

    const attachment = new AttachmentBuilder(currentQuestPookie.file_path);
    console.log(currentQuestPookie.name);

    await interaction.deferReply();
    const pookieEmbed = await buildEmbed(
      user,
      currentQuestPookie,
      tier,
      amount,
    );
    await interaction.editReply({
      embeds: [pookieEmbed],
      files: [attachment],
      components: [row],
    });

    try {
      const filter = (i) => {
        if (i.user.id === interaction.user.id) return true;
      };
      const collector = interaction.channel.createMessageComponentCollector({
        filter,
        time: 60_000,
      });
      collector.on("collect", async (i) => {
        if (i.customId === user.user_id) {
          let ms = Date.now();
          currentQuestPookie = await pookieGenerator(tier);
          amount = await amountGenerator(tier, currentQuestPookie);
          const attachment = new AttachmentBuilder(
            currentQuestPookie.file_path,
          );
          const pookieEmbed = await buildEmbed(
            user,
            currentQuestPookie,
            tier,
            amount,
          );
          await i.update({
            content: "",
            embeds: [pookieEmbed],
            files: [attachment],
            components: [row],
          });
          let ping = Date.now() - ms;
          console.log("response time: " + ping + "ms");
        }

        // If quest interactions are accepted or deny, kill collector and keep track of state
        if (i.customId === user.user_id + "1") {
          questState = "ACCEPTED";
          lastInteraction = i;
          collector.stop();
        }
        if (i.customId === user.user_id + "2") {
          questState = "DENIED";
          lastInteraction = i;
          collector.stop();
        }
      });

      collector.on("end", async (i) => {
        switch (questState) {
          case "PENDING":
            await interaction.editReply({
              content: "quest not accepted within a minute, cancelling",
              components: [],
            });
            break;

          case "ACCEPTED":
            const attachment = new AttachmentBuilder(
              currentQuestPookie.file_path,
            );
            const pookieEmbed = await buildEmbed(
              user,
              currentQuestPookie,
              tier,
              amount,
            );
            await lastInteraction.update({
              content:
                "**quest accepted!**\nuse /turnin whenever you have enough pookies.",
              embeds: [pookieEmbed],
              files: [attachment],
              components: [],
            });
            const reward = await rewardGenerator(tier, currentQuestPookie);
            const quest = await Quests.create({
              user_id: user.user_id,
              pookie_id: currentQuestPookie.id,
              due_amount: amount,
              reward: reward,
              reward_amount: (amount / 2).toFixed(0),
              questTier: tier,
            });
            console.log(quest);
            break;

          case "DENIED":
            await lastInteraction.update({
              content: "quest denied",
              embeds: [],
              files: [],
              components: [],
            });
        }
      });
    } catch (e) {
      console.log("testasdf");
    }
    // await interaction.reply(questString);
  },
};
