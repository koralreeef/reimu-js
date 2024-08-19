const { AttachmentBuilder, Events } = require('discord.js');
const Canvas = require('@napi-rs/canvas');

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
        if (message.content === 'gif'){
            const file = new AttachmentBuilder('images\\pookiebear4.gif');
            message.channel.send({ files: [file] });
        }

        if (message.content === '.utc'){
            let currentDate = new Date();
            let currentDatetime = currentDate.toUTCString();
            let localTimestamp = Math.floor(Date.now() / 1000);
            message.channel.send("UTC: "+currentDatetime+"\n"
                                 +"Local: <t:"+localTimestamp+">");
        }

    }
}

//https://discordjs.guide/popular-topics/canvas.html#getting-started