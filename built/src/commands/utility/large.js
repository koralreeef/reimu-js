const { AttachmentBuilder, SlashCommandBuilder } = require("discord.js");
const Canvas = require("@napi-rs/canvas");
function scrub(string) {
    return string.replace(/(:|<:|<a:)(|(\w{1,64}))(:|>)/gi, "");
}
module.exports = {
    data: new SlashCommandBuilder()
        .setName("large")
        .setDescription("makes an emoji large")
        .addStringOption((option) => option
        .setName("input")
        .setDescription("type in a server emoji")
        .setRequired(true)),
    async execute(interaction) {
        const text = interaction.options.getString("input");
        let newtext = scrub(text);
        newtext = newtext.substring(0, newtext.length - 1);
        console.log("emoji id: " + newtext);
        // <a:yippie:1170104164894904430>
        const canvas = Canvas.createCanvas(500, 500);
        const context = canvas.getContext("2d");
        if (text.substr(1, 1).includes("a")) {
            const attachment = new AttachmentBuilder("https://cdn.discordapp.com/emojis/" +
                newtext +
                ".gif?quality=lossless");
            await interaction.reply({ files: [attachment] });
        }
        else {
            // lol
            const background = await Canvas.loadImage("https://cdn.discordapp.com/emojis/" + newtext);
            // This uses the canvas dimensions to stretch the image onto the entire canvas
            context.drawImage(background, 0, 0, canvas.width, canvas.height);
            // Use the helpful Attachment class structure to process the file for you
            const attachment = new AttachmentBuilder(await canvas.encode("png"), {
                name: "emoji.png",
            });
            await interaction.reply({ files: [attachment] });
        }
    },
};
