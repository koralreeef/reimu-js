const { Events } = require("discord.js");
const { Reminders } = require("../db/dbObjects.js");

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    setInterval(async () => {
      const date = Math.floor(Date.now() / 1000);
      const reminders = (await Reminders.findAll()) ?? "";
      if (reminders != "") {
        for (let i in reminders) {
          if (reminders[i].date < date) {
            const channel = client.channels.cache.get(reminders[i].channelID);
            await channel.send(reminders[i].note);
            await Reminders.destroy({
              where: { id: reminders[i].id },
            });
          }
        }
      }
    }, 60000);
    console.log("interval reminders are up");
  },
};
