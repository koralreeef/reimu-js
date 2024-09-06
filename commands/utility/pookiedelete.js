const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { Op } = require("sequelize");
const { Pookiebears, UserPookies } = require("../../db/dbObjects.js");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pookiedelete")
    .setDescription("kill a pookiebear (oh no)")
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("what's their name")
        .setRequired(true),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    {
      const pookieName = interaction.options.getString("name");
      const ssrName = pookieName + " ssr";
      const starryName = "starry night " + pookieName;
      const starrySSR = "starry night " + pookieName + " ssr";
      // equivalent to: DELETE from tags WHERE name = ?;
      // loop according to length? maybe?
      // const deletedPookie = await Pookiebears.findAll({ where: {pookie_name: pookieName}, rarity: { [Op.like]: '%+%',}});
      const deletedPookie = await Pookiebears.findOne({
        where: { pookie_name: pookieName },
      });
      const deletedSSRPookie = await Pookiebears.findOne({
        where: { pookie_name: ssrName },
      });
      const deletedstarPookie = await Pookiebears.findOne({
        where: { pookie_name: starryName },
      });
      const deletedstarPookieSSR = await Pookiebears.findOne({
        where: { pookie_name: starrySSR },
      });

      await UserPookies.destroy({ where: { pookie_id: deletedPookie.id } });
      await UserPookies.destroy({ where: { pookie_id: deletedSSRPookie.id } });
      if (deletedstarPookie) {
        await UserPookies.destroy({
          where: { pookie_id: deletedstarPookie.id },
        });
      }
      if (deletedstarPookieSSR) {
        await UserPookies.destroy({
          where: { pookie_id: deletedstarPookieSSR.id },
        });
      }

      // THIS FUCKING SUCKS SOO BAD ASDFKMASDFKSAF
      const pookieDelete = await Pookiebears.destroy({
        where: { pookie_name: pookieName },
      });
      await Pookiebears.destroy({ where: { pookie_name: ssrName } });
      if (deletedstarPookie) {
        await Pookiebears.destroy({ where: { pookie_name: starryName } });
      }
      if (deletedstarPookieSSR) {
        await Pookiebears.destroy({ where: { pookie_name: starrySSR } });
      }

      // Asynchronously delete a file
      fs.unlinkSync(deletedPookie.file_path, (err) => {
        if (err) {
          // Handle specific error if any
          if (err.code === "ENOENT") {
            console.error("File does not exist.");
          } else {
            throw err;
          }
        } else {
          console.log("File deleted!");
        }
      });

      if (!pookieDelete) {
        return interaction.reply("That pookiebear doesn't exist.");
      }

      return interaction.reply("pookiebear " + pookieName + " deleted.");
    }
  },
};
