const { Events } = require('discord.js');

const regex = /^\.osu \d{1,7}/gm;

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
        let msg = message.content;
        if (regex.test(msg)){
            let beatmapID = msg.substring(5);
            message.channel.send("https://osu.ppy.sh/b/"+beatmapID);
            console.log("https://osu.ppy.sh/b/"+beatmapID);
        }
    }
}

//https://discordjs.guide/popular-topics/canvas.html#getting-started