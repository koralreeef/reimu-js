const { AttachmentBuilder, SlashCommandBuilder } = require("discord.js");
// const attachment = new AttachmentBuilder('textfile.jpg');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("textfile")
    .setDescription("will generate a textfile with input given")
    .addStringOption((option) =>
      option
        .setName("input")
        .setDescription("type things in")
        .setRequired(true),
    ),

  async execute(interaction) {
    const text = interaction.options.getString("input");
    const attachment = new AttachmentBuilder(Buffer.from(text), {
      name: "textfile.txt",
    });
    await interaction.reply({ files: [attachment] });
  },
};
