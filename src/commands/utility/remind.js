const {
    SlashCommandBuilder,
  } = require("discord.js");
  const { Reminders } = require("../../db/dbObjects.js");
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("remind")
      .setDescription(
        "reminds you with a chosen message in a desired timeframe",
      )
      .addStringOption((option) =>
        option
          .setName("note")
          .setDescription("what will you say to your future self")
          .setMaxLength(200)
          .setRequired(true),
      )
      .addIntegerOption((option) =>
        option
          .setName("days")
          .setDescription("days before ping")
          .setMinValue(1),
      )
      .addIntegerOption((option) =>
        option
          .setName("hours")
          .setDescription("hours before ping")
          .setMinValue(1),
      )
      .addIntegerOption((option) =>
        option
          .setName("minutes")
          .setDescription("minutes before ping")
          .setMinValue(1),
      ),
    async execute(interaction) {
        const id = interaction.user.id;
        const guildId = interaction.guildId;
        const channelId = interaction.channelId;
        //console.log(interaction);
        const note = interaction.options.getString("note") + " <@"+id+">";
        const days = interaction.options.getInteger("days") * 86400;
        const hours = interaction.options.getInteger("hours") * 3600;
        const minutes = interaction.options.getInteger("minutes") * 60;
        let date = Math.floor(Date.now()/1000) + days + hours + minutes;
        const msg = await interaction.reply("got it! <@"+id+">, i will remind you <t:"+date+":R>");
        await Reminders.create({
            note: note + " (jump to origin: https://discord.com/channels/"+guildId+"/"+channelId+"/"+msg.id+")",
            date: date,
            channelID: channelId,
            guildID: guildId,
            messageID: msg.id
        })
        return;
    },
  };
  