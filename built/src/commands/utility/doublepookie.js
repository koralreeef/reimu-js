const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, } = require("discord.js");
const { Users, Pookiebears } = require("../../db/dbObjects.js");
const { green } = require("color-name");
const { getRandomInt, sleep } = require("../../helper.js");
const regex = /\+/gm;
// buff by giving back half of pookies wagered
// you gotta spend pookies to make pookies
module.exports = {
    data: new SlashCommandBuilder()
        .setName("doublepookie")
        .setDescription("double your pookie amounts maybe (odds: 50/50 (scales after every + on rarity))")
        .addStringOption((option) => option
        .setName("pookie")
        .setDescription("what pookie are you using")
        .setAutocomplete(true)
        .setRequired(true))
        .addIntegerOption((option) => option
        .setName("amount")
        .setDescription("how many pookies are we using")
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true)),
    async autocomplete(interaction) {
        // find a way to autocomplete all in?
        const focusedValue = interaction.options.getFocused();
        const user = await Users.findOne({
            where: { user_id: interaction.user.id },
        });
        const pookies = await user.getPookies(interaction.user.id);
        const choices = pookies.map((i) => i.pookie.pookie_name);
        const filtered = choices
            .filter((choice) => choice.startsWith(focusedValue))
            .slice(0, 5);
        await interaction.respond(filtered.map((choice) => ({ name: choice, value: choice })));
    },
    async execute(interaction) {
        const userID = interaction.user.id;
        const p = interaction.options.getString("pookie");
        const amount = interaction.options.getInteger("amount");
        const roll = getRandomInt(100);
        const scaler = (p.match(regex) || []).length;
        let allIn = 0;
        let casino = 0;
        let str = "the";
        const date = new Date();
        const loss = -amount;
        try {
            const pookie = await Pookiebears.findOne({ where: { pookie_name: p } });
            const user = await Users.findOne({ where: { user_id: userID } });
            const check = user.checkPookies(pookie, userID, loss);
            if ((await check) == true) {
                user.addPookies(pookie, userID, loss, pookie.rarity);
                if ((await user.checkAmount(pookie, userID, loss)) == true) {
                    user.destroyPookies(pookie, userID);
                    allIn = 3;
                    // this fucking sucks idk what the allin boolean is for yet
                    str = "**ALL** of the";
                }
                if (user.location == "casino zone")
                    casino = 15;
                let rollToBeat = 50 - allIn - casino + 10 * scaler;
                if (rollToBeat >= 70)
                    rollToBeat = 70;
                const message = await interaction.reply({
                    content: "good luck to <@" +
                        userID +
                        ">! goodbye to " +
                        str +
                        " **" +
                        amount +
                        "** " +
                        pookie.pookie_name +
                        "(s)...",
                    fetchReply: true,
                });
                // GUYS IS THERE ANY BETTER WAY TO DO THIS
                await message.react("🇵");
                await sleep(1000);
                await message.react("0️⃣");
                await sleep(1000);
                await message.react("🇴");
                await sleep(1000);
                await message.react("🇰");
                await sleep(1000);
                await message.react("🇮");
                await sleep(1000);
                await message.react("🇪");
                // 100 - amount*2
                if (roll > rollToBeat) {
                    console.log("hey guys");
                    user.addPookies(pookie, userID, amount * 2, pookie.rarity);
                    const attachment = new AttachmentBuilder(pookie.file_path);
                    const pookieEmbed = new EmbedBuilder()
                        .setAuthor({ name: "pookiebear #" + pookie.id })
                        // DUDE
                        .setTitle(pookie.pookie_name + "\nresult: +" + amount)
                        .setImage("attachment://" + pookie.file_path.substring(9))
                        .setColor(green)
                        .setFooter({
                        text: "Doubled by: " +
                            interaction.user.username +
                            " at " +
                            date.toLocaleString() +
                            "\nwinning roll: " +
                            roll +
                            " > " +
                            rollToBeat,
                        iconURL: interaction.user.displayAvatarURL(),
                    });
                    return interaction.editReply({
                        embeds: [pookieEmbed],
                        files: [attachment],
                    });
                }
                else {
                    return interaction.editReply({
                        content: "unlucky... you just lost " +
                            amount +
                            " " +
                            pookie.pookie_name +
                            "(s)...." +
                            "\nyour unlucky roll: " +
                            roll +
                            " < " +
                            rollToBeat,
                    });
                }
            }
            else {
                return interaction.reply({
                    content: "you dont have enough of those brokie",
                    ephemeral: true,
                });
            }
        }
        catch (err) {
            console.log(err);
            return interaction.followUp({ content: "it broke", ephemeral: true });
        }
    },
};
