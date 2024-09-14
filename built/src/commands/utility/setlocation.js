const { SlashCommandBuilder } = require("discord.js");
const { Users } = require("../../db/dbObjects.js");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("setlocation")
        .setDescription("sets current location if you have any unlocked")
        .addStringOption((option) => option
        .setName("location")
        .setDescription("where we droppin")
        .addChoices({ name: "pookieville", value: "pookieville" }, { name: "pookie forest", value: "pookie forest" }, { name: "mt. pookie", value: "mt. pookie" }, { name: "casino zone", value: "casino zone" }, { name: "star peak", value: "star peak" })),
    async execute(interaction) {
        const location = interaction.options.getString("location");
        const user = await Users.findOne({
            where: { user_id: interaction.user.id },
        });
        if (!user) {
            return await interaction.reply("you havent summoned a pookiebear yet!");
        }
        if (user.questTier < 1) {
            return await interaction.reply("you dont have any locations yet! have you tried using /quest?");
        }
        if (location == user.location) {
            return await interaction.reply("you're already at " + location + "!");
        }
        if (location == "pookieville") {
            user.update({ location: location }, { where: { user_id: user.id } });
            return await interaction.reply("location set to pookieville!");
        }
        if (location == "pookie forest") {
            user.update({ location: location }, { where: { user_id: user.id } });
            return await interaction.reply("location set to pookie forest!");
        }
        if (location == "mt. pookie") {
            user.update({ location: location }, { where: { user_id: user.id } });
            return await interaction.reply("location set to mt. pookie!");
        }
        if (location == "casino zone") {
            if (user.questTier >= 3) {
                user.update({ location: location }, { where: { user_id: user.id } });
                return await interaction.reply("location set to casino zone!");
            }
            else {
                return await interaction.reply("quest tier isnt high enough!");
            }
        }
        if (location == "star peak") {
            if (user.questTier >= 4) {
                user.update({ location: location }, { where: { user_id: user.id } });
                return await interaction.reply("location set to star peak!");
            }
            else {
                return await interaction.reply("quest tier isnt high enough!");
            }
        }
    },
};
