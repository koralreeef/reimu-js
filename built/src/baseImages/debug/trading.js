const { SlashCommandBuilder, ButtonStyle, ComponentType, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ButtonBuilder, ActionRowBuilder, PermissionFlagsBits, } = require("discord.js");
const { Users } = require("../../db/dbObjects.js");
// HAGGLE SYSTEM IF YOU TRADE WITH THE BOT (RANDOM CHANCE TO GET DEALS)
// UNUSABLE
module.exports = {
    data: new SlashCommandBuilder()
        .setName("trading")
        .setDescription("give another user a trade offer for their pookies (WIP)")
        .addUserOption((option) => option
        .setName("user")
        .setDescription("who is recieving this trade")
        .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const r = interaction.options.getUser("user");
        const user = await Users.findOne({
            where: { user_id: interaction.user.id },
        });
        const reciever = await Users.findOne({ where: { user_id: r.id } });
        const pookies = await user.getPookies(interaction.user.id);
        const pookies2 = await reciever.getPookies(r.id);
        // console.log(pookies);
        const select = new StringSelectMenuBuilder()
            .setCustomId(interaction.id)
            .setPlaceholder("your inventory")
            .setMinValues(1)
            .setMaxValues(pookies.length)
            .addOptions(pookies.map((i) => new StringSelectMenuOptionBuilder()
            .setLabel(i.pookie.pookie_name)
            .setDescription(i.amount + " remaining")
            .setValue(i.pookie.pookie_name)));
        const selectOther = new StringSelectMenuBuilder()
            .setCustomId(interaction.id + "2")
            .setPlaceholder(r.username + "'s inventory")
            .setMinValues(1)
            .setMaxValues(pookies2.length)
            .addOptions(pookies2.map((i) => new StringSelectMenuOptionBuilder()
            .setLabel(i.pookie.pookie_name)
            .setDescription(i.amount + " remaining")
            .setValue(i.pookie.pookie_name)));
        const sendTrade = new ButtonBuilder()
            .setCustomId(interaction.id + "3")
            .setLabel("Send offer")
            .setStyle(ButtonStyle.Success);
        const row = new ActionRowBuilder().addComponents(select);
        const row2 = new ActionRowBuilder().addComponents(selectOther);
        const row3 = new ActionRowBuilder().addComponents(sendTrade);
        // make sure only sender can interact with ui
        const response = await interaction.reply({
            content: "choose which pookies to trade",
            components: [row],
        });
        const response2 = await interaction.followUp({
            content: "choose which pookies you want from " + r.username + "'s inventory",
            components: [row2],
        });
        const response3 = await interaction.followUp({ components: [row3] });
        let msg = "";
        let msg2 = "";
        let offer = "";
        let want = "";
        const filter = (i) => i.user.id === interaction.user.id && i.customId === interaction.id;
        const filter2 = (i) => i.user.id === interaction.user.id && i.customId === interaction.id + "2";
        const filter3 = (i) => i.user.id === interaction.user.id && i.customId === interaction.id + "3";
        const collector = response.createMessageComponentCollector({
            componentType: ComponentType.StringSelect,
            filter,
            time: 60_000,
        });
        const collector2 = response2.createMessageComponentCollector({
            componentType: ComponentType.StringSelect,
            filter2,
            time: 60_000,
        });
        collector.on("collect", async (interaction) => {
            if (!interaction.values.length) {
                interaction.update("You have emptied your selection.");
                return;
            }
            if (msg) {
                msg.edit(interaction.user.username +
                    " is offering " +
                    interaction.values.join(", "));
                interaction.reply({ content: "trade updated", ephemeral: true });
            }
            else {
                msg = await interaction.reply({
                    content: interaction.user.username +
                        " is offering " +
                        interaction.values.join(", "),
                    ephemeral: true,
                });
                offer =
                    interaction.user.username +
                        " is offering " +
                        interaction.values.join(", ");
            }
            // msg.edit(interaction.user.username+" is offering "+interaction.values.join(", "));
        });
        collector2.on("collect", async (interaction) => {
            if (!interaction.values.length) {
                interaction.update("You have emptied your selection.");
                return;
            }
            if (msg2) {
                msg.edit(interaction.user.username + " wants " + interaction.values.join(", "));
                interaction.reply({ content: "trade updated", ephemeral: true });
            }
            else {
                msg2 = await interaction.reply({
                    content: interaction.user.username +
                        " wants " +
                        interaction.values.join(", "),
                    ephemeral: true,
                });
                want =
                    interaction.user.username + " wants " + interaction.values.join(", ");
            }
        });
        const confirmation = await response3.awaitMessageComponent({
            filter: filter3,
            time: 60_000,
        });
        if (confirmation.customId === interaction.id + "3") {
            await confirmation.update({ content: "offer sent", components: [] });
            await interaction.client.users.send(r.id, "hey man " +
                interaction.user.username +
                " just sent you a trade request:\n" +
                offer +
                "\n" +
                want);
            return;
        }
    },
};
// https://discordjs.guide/message-components/select-menus.html#multi-selects
