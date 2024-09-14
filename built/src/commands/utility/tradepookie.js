const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, } = require("discord.js");
const { Users, Pookiebears } = require("../../db/dbObjects.js");
module.exports = {
    cooldown: 10,
    data: new SlashCommandBuilder()
        .setName("tradepookie")
        .setDescription("give another user some pookies")
        .addStringOption((option) => option
        .setName("send")
        .setDescription("what pookie are you sending")
        .setAutocomplete(true)
        .setRequired(true))
        .addIntegerOption((option) => option
        .setName("number")
        .setDescription("how many are you sending")
        .setMinValue(1)
        .setRequired(true))
        .addStringOption((option) => option
        .setName("get")
        .setDescription("what pookie are you getting")
        .setAutocomplete(true)
        .setRequired(true))
        .addIntegerOption((option) => option
        .setName("amount")
        .setDescription("how many are you getting")
        .setMinValue(1)
        .setRequired(true))
        .addUserOption((option) => option
        .setName("target")
        .setDescription("who is recieving these pookies")
        .setRequired(true)),
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
              option.setName('target2')
                  .setDescription('what pookie do you want')
                  .setAutocomplete(true))
          .addIntegerOption(option =>
              option.setName('tamount2')
                  .setDescription('how many are you getting')
                  .setMinValue(1)),
                  */
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
        await interaction.respond(filtered.map((choice) => ({ name: choice, value: choice })));
    },
    async execute(interaction) {
        const u = await Users.findOne({ where: { user_id: interaction.user.id } });
        if (!u) {
            return await interaction.reply("you havent summoned a pookiebear yet!");
        }
        const tar = interaction.options.getUser("target");
        const senderID = interaction.user.id;
        if (tar.id == senderID) {
            return interaction.reply({
                content: "you cannot trade pookies to yourself dude",
                ephemeral: true,
            });
        }
        const ms = Date.now();
        const timer = Math.floor(ms / 1000) + 300;
        const p1 = interaction.options.getString("send");
        const a1 = interaction.options.getInteger("number");
        const t1 = interaction.options.getString("get");
        const ta1 = interaction.options.getInteger("amount");
        if (p1 == t1) {
            return interaction.reply({
                content: "you cannot trade the same pookies dude",
                ephemeral: true,
            });
        }
        /*
            const p2 = interaction.options.getString('pookie2');
            const a2 = interaction.options.getString('amount2');
            const t2 = interaction.options.getString('target2');
            const ta2 = interaction.options.getString('tamount2');
            */
        console.log(" sdfsdfa" + p1);
        const loss1 = -a1;
        const loss2 = -ta1;
        try {
            const senderPookie = await Pookiebears.findOne({
                where: { pookie_name: p1 },
            });
            const targetPookie = await Pookiebears.findOne({
                where: { pookie_name: t1 },
            });
            const sender = await Users.findOne({ where: { user_id: senderID } });
            const target = await Users.findOne({ where: { user_id: tar.id } });
            const check = sender.checkPookies(senderPookie, senderID, loss1);
            const checkTar = target.checkPookies(targetPookie, tar.id, loss2);
            // console.log(await check);
            const accept = new ButtonBuilder()
                .setCustomId(sender.user_id + "accept")
                .setLabel("Accept Trade")
                .setStyle(ButtonStyle.Success);
            const deny = new ButtonBuilder()
                .setCustomId(sender.user_id + "deny")
                .setLabel("Deny Trade")
                .setStyle(ButtonStyle.Danger);
            const row = new ActionRowBuilder().addComponents(accept, deny);
            if ((await check) == true && (await checkTar) == true) {
                const response = await interaction.reply({
                    content: `A new trade offer from ${interaction.user.username}! ${tar}, do you accept?
                                  \nYou will recieve **${a1} ${p1}**\n${interaction.user.username} wants **${ta1} ${t1}**\nexpires <t:${timer}:R>`,
                    components: [row],
                });
                const collectorFilter = (i) => {
                    if (i.user.id === tar.id)
                        return true;
                    // i.reply?
                    interaction.followUp({
                        content: "this isnt your trade!",
                        ephemeral: true,
                    });
                };
                try {
                    const confirmation = await response.awaitMessageComponent({
                        filter: collectorFilter,
                        time: 300_000,
                    });
                    if (confirmation.customId === sender.user_id + "accept") {
                        // handle sender trading pookies
                        if ((await sender.checkAmount(senderPookie, senderID, loss1)) == true) {
                            sender.destroyPookies(senderPookie, senderID);
                        }
                        else {
                            sender.addPookies(senderPookie, senderID, loss1, senderPookie.rarity);
                        }
                        if ((await target.checkAmount(targetPookie, tar.id, loss2)) == true) {
                            target.destroyPookies(targetPookie, tar.id);
                        }
                        else {
                            target.addPookies(targetPookie, tar.id, loss2, targetPookie.rarity);
                        }
                        // handle sender getting pookies
                        target.addPookies(senderPookie, tar.id, a1, senderPookie.rarity);
                        sender.addPookies(targetPookie, senderID, ta1, targetPookie.rarity);
                        return confirmation.update({
                            content: interaction.user.username +
                                " just traded **" +
                                a1 +
                                " " +
                                p1 +
                                "** to <@" +
                                tar +
                                "> for **" +
                                ta1 +
                                " " +
                                t1 +
                                "**!",
                            components: [],
                        });
                    }
                    else if (confirmation.customId === sender.user_id + "deny") {
                        await confirmation.update({
                            content: "trade not accepted :(",
                            components: [],
                        });
                    }
                }
                catch (e) {
                    await interaction.editReply({
                        content: "answer not received within 5 minutes, cancelling",
                        components: [],
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
            return interaction.reply({ content: "it broke", ephemeral: true });
        }
    },
};
