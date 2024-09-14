const { Events } = require("discord.js");
const { Pookiebears } = require("../db/dbObjects.js");
const { statusChannel, rainrole, snowyrole, starryrole, hurricanerole, weatherMsg, } = require("../../config.json");
// just give it up bruh use h
const h = require("../helper.js");
// This is Shit
const rainyChance = 9980;
const hurricaneChance = 9980;
const snowyChance = 9990;
const starNightChance = 9995;
let hurricaneDuration = Math.floor(Date.now() / 1000);
let rainString = "", snowString = "", starString = "", hurricaneString = "";
let weatherString = "No weather sightings since startup.\n";
async function deleteMsg(messageID, targetChannel) {
    targetChannel.messages
        .fetch(messageID)
        .then((message) => message.delete())
        .catch(console.error);
}
module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        const status = client.channels.cache.get(statusChannel);
        //const pookie = client.channels.cache.get(pookieChannel);
        // let message = await status.send(weatherString);
        let messageID = weatherMsg;
        let weatherMessageID = 0;
        setInterval(async () => {
            const rainCheck = h.getRandomInt(10000);
            const snowCheck = h.getRandomInt(10000);
            const starCheck = h.getRandomInt(10000);
            const hurricaneCheck = h.getRandomInt(10000);
            // duration marked by minutes, min duration 1 minute, max weather duration 5 minutes
            // <t:"+endTimestamp+":R>
            const ms = Date.now();
            const currentTimestamp = Math.floor(ms / 1000);
            // 3540 = 59 minutes
            // please refactor this ASAP
            if (rainCheck > rainyChance && h.getRainy() == false) {
                weatherString = "";
                h.setRainy(true);
                h.setRainDuration(Math.floor((ms + 60 * 1000 + h.getRandomInt(10 * 1000)) / 1000));
                const msg = await status.send("# Take cover! It's started to rain! Ends <t:" +
                    h.getRainDuration() +
                    ":R>!\n<@&" +
                    rainrole +
                    ">");
                weatherMessageID = msg.id;
                rainString =
                    "Latest **Rain** sighting: ending <t:" +
                        h.getRainDuration() +
                        ":R>\n";
            }
            if (h.getRainy() == true) {
                rainString =
                    "Latest **Rain** sighting: ending <t:" +
                        h.getRainDuration() +
                        ":R>\n";
            }
            if (snowCheck > snowyChance && h.getSnowy() == false) {
                weatherString = "";
                h.setSnowy(true);
                h.setSnowDuration(Math.floor((ms + 60 * 1000 + h.getRandomInt(10 * 1000)) / 1000));
                const msg = await status.send("# It's the start of some snowfall! Ends <t:" +
                    h.getSnowDuration() +
                    ":R>!\n<@&" +
                    snowyrole +
                    ">");
                weatherMessageID = msg.id;
                snowString =
                    "Latest **Snow** sighting: ending <t:" +
                        h.getSnowDuration() +
                        ":R>\n";
            }
            if (h.getSnowy() == true) {
                snowString =
                    "Latest **Snow** sighting: ending <t:" +
                        h.getSnowDuration() +
                        ":R>\n";
            }
            if (starCheck > starNightChance && h.getStarnight() == false) {
                weatherString = "";
                h.setStarnight(true);
                h.setStarnightDuration(Math.floor((ms + 60 * 1000 + h.getRandomInt(300 * 1000)) / 1000));
                const msg = await status.send("# Look above everyone! A starry sky has appeared! Ends <t:" +
                    h.getStarnightDuration() +
                    ":R>! \n<@&" +
                    starryrole +
                    ">");
                weatherMessageID = msg.id;
                starString =
                    "Latest **Starry** sighting: ending <t:" +
                        h.getStarnightDuration() +
                        ":R>\n";
            }
            if (h.getStarnight() == true) {
                rainString =
                    "Latest **Starry** sighting: ending <t:" +
                        h.getStarnightDuration() +
                        ":R>\n";
            }
            if (hurricaneCheck > hurricaneChance && h.getHurricane() == false) {
                const pookies = await Pookiebears.findAll({
                    where: { rarity: h.common },
                });
                const hurricanePookie = pookies[h.getRandomInt(pookies.length)];
                h.setHurricanePookie(hurricanePookie.pookie_name);
                weatherString = "";
                h.setHurricane(true);
                hurricaneDuration = Math.floor((ms + 60 * 1000 + h.getRandomInt(300 * 1000)) / 1000);
                const msg = await status.send("# A hurricane of " +
                    hurricanePookie.pookie_name +
                    " approaches!  Ends <t:" +
                    hurricaneDuration +
                    ":R>! \n<@&" +
                    hurricanerole +
                    ">");
                weatherMessageID = msg.id;
                hurricaneString =
                    "Latest **Hurricane** sighting: ending <t:" +
                        hurricaneDuration +
                        ":R>\n";
            }
            // if a weather ends, remove modifier and change displays
            // THIS SO BADDDD
            if (currentTimestamp > h.getRainDuration() && h.getRainy() == true) {
                h.setRainy(false);
                deleteMsg(weatherMessageID, status);
                //status.send("## The rain has cleared!");
                rainString =
                    "Last rain sighting was <t:" + h.getRainDuration() + ":R>\n";
            }
            if (currentTimestamp > h.getSnowDuration() && h.getSnowy() == true) {
                h.setSnowy(false);
                deleteMsg(weatherMessageID, status);
                //status.send("## The snowfall has stopped!");
                snowString =
                    "Last snow sighting was <t:" + h.getSnowDuration() + ":R>\n";
            }
            if (currentTimestamp > h.getStarnightDuration() &&
                h.getStarnight() == true) {
                h.setStarnight(false);
                deleteMsg(weatherMessageID, status);
                //status.send("## The starry sky has disappeared...");
                starString =
                    "Last starry sighting was <t:" + h.getStarnightDuration() + ":R>\n";
            }
            if (currentTimestamp > hurricaneDuration && h.getHurricane() == true) {
                h.setHurricane(false);
                deleteMsg(weatherMessageID, status);
                //status.send("## The hurricane has faded!");
                hurricaneString =
                    "Last hurricane sighting was <t:" + hurricaneDuration + ":R>\n";
            }
            const next = currentTimestamp + 15;
            const weatherMsg = weatherString +
                rainString +
                snowString +
                starString +
                hurricaneString +
                "Next weather check: <t:" +
                next +
                ":R>";
            try {
                const message = await status.messages.fetch(messageID);
                await message.edit(weatherMsg);
            }
            catch (e) {
                const msg = await status.send(weatherMsg);
                messageID = msg.id;
            }
        }, 15000);
        console.log("Weather watch in progress...");
    },
};
