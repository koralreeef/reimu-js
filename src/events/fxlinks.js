const { Events } = require("discord.js");

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    const msg = message.content;
    if (msg.substring(0, 14) === "https://x.com/") {
      console.log(msg.substring(0, 26));
      message.suppressEmbeds(true);
      if (message.author.bot) return false;
      message.channel.send(
        "https://fxtwitter.com/" + message.content.substring(14),
      );
    }
    if (msg.substring(0, 20) === "https://twitter.com/") {
      console.log(msg.substring(0, 26));
      message.suppressEmbeds(true);
      if (message.author.bot) return false;
      message.channel.send(
        "https://fxtwitter.com/" + message.content.substring(20),
      );
    }
    if (msg.substring(0, 26) === "https://www.instagram.com/") {
      console.log(msg.substring(0, 26));
      message.suppressEmbeds(true);
      if (message.author.bot) return false;
      message.channel.send(
        "https://www.ddinstagram.com/" + message.content.substring(26),
      );
    }
  },
};
