const { Events } = require("discord.js");
module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.content === ".utc") {
            const currentDate = new Date();
            const currentDatetime = currentDate.toUTCString();
            const localTimestamp = Math.floor(Date.now() / 1000);
            message.channel.send("UTC: " + currentDatetime + "\n" + "Local: <t:" + localTimestamp + ">");
        }
    },
};
// https://discordjs.guide/popular-topics/canvas.html#getting-started
