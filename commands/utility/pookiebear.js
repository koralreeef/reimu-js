const { SlashCommandBuilder } = require("discord.js");
const { Pookiebears } = require("../../db/dbObjects.js");
const {
  downloadFile,
  common,
  ssr,
  starry,
  starry_ssr,
} = require("../../helper.js");
const sharp = require("sharp");

const regex = /[^èéòàùì\w\s]/gi;

function isValidHttpUrl(string) {
  try {
    const newUrl = new URL(string);
    return newUrl.protocol === "http:" || newUrl.protocol === "https:";
  } catch (err) {
    return false;
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pookiebear")
    .setDescription("register a pookiebear here")
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("what's their name")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("link")
        .setDescription("enter an image link")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("source")
        .setDescription(
          "source link for any fanart (twitter or pixiv or other)",
        ),
    ),

  async execute(interaction) {
    const name = interaction.options.getString("name").toLowerCase();
    let source = interaction.options.getString("source") || "no source listed";
    const url = interaction.options.getString("link");
    const fileName = name.replace(/ /g, "_");

    if (!url.startsWith("https://cdn.discordapp.com/attachments/")) {
      return await interaction.reply({
        content:
          "only discord image links will be accepted (post your image in a channel and copy its link)",
        ephemeral: true,
      });
    }
    if (source != "no source listed" && !isValidHttpUrl(source)) {
      return await interaction.reply({
        content: "please have a proper link for your source",
        ephemeral: true,
      });
    }
    if (name.includes("+")) {
      return await interaction.reply({
        content: "nice try man however thats reserved for the gamblers",
        ephemeral: true,
      });
    }
    if (name.length > 31) {
      return await interaction.reply({
        content: "name is too long",
        ephemeral: true,
      });
    }
    if (regex.test(name)) {
      return await interaction.reply({
        content: "only regular letters, numbers, and spaces are allowed",
        ephemeral: true,
      });
    }
    if (name.includes("starry night")) {
      return await interaction.reply({
        content: "these are only avaliable on special nights silly",
        ephemeral: true,
      });
    }
    if (source != "no source listed") source = "[source](" + source + ")";
    const avatarURL = interaction.user.displayAvatarURL();
    try {
      const filelink = await downloadFile(url, fileName);
      await sharp(filelink)
        .resize(500)
        .jpeg({ quality: 70 })
        .toFile("./images/" + fileName + ".jpg");

      // equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
      const pookie = await Pookiebears.create({
        pookie_name: name,
        file_path: "./images/" + fileName + ".jpg",
        creator: interaction.user.username,
        creatorURL: avatarURL,
        summon_count: 0,
        rarity: common,
        source: source,
      });
      await Pookiebears.create({
        pookie_name: name + " ssr",
        file_path: "./images/" + fileName + ".jpg",
        creator: interaction.user.username,
        creatorURL: avatarURL,
        summon_count: 0,
        rarity: ssr,
        source: source,
      });

      await Pookiebears.create({
        pookie_name: `starry night ${name}`,
        file_path: "./images/" + fileName,
        creator: interaction.user.username,
        creatorURL: avatarURL,
        summon_count: 0,
        rarity: starry,
        source: source,
      });

      await Pookiebears.create({
        pookie_name: `starry night ${name} ssr`,
        file_path: "./images/" + fileName,
        creator: interaction.user.username,
        creatorURL: avatarURL,
        summon_count: 0,
        rarity: starry_ssr,
        source: source,
      });

      interaction.reply(`pookiebear ${pookie.pookie_name} added.`);
      const user = interaction.client.users.cache.get(interaction.user.id);
      return await interaction.client.users.send(
        "109299841519099904",
        user.username +
          " just sent this epic pookiebear hell yaah brother \n" +
          url,
      );
    } catch (error) {
      console.log(error);
      if (error.name === "SequelizeUniqueConstraintError") {
        return interaction.reply("That pookiebear already exists.");
      }
      return interaction.reply(
        "Something went wrong with adding a pookiebear.",
      );
    }
  },
};
