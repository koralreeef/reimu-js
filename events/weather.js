const { Events } = require('discord.js');
const { Pookiebears } = require('../db/dbObjects.js');
//just give it up bruh use h
const h = require('../helper.js');

//This is Shit
var rainyChance = 9980;
var hurricaneChance = 9980;
var snowyChance = 9990;
var starNightChance = 9995;
let hurricaneDuration = Math.floor(Date.now()/1000);
let rainString = "", snowString = "", starString = "", hurricaneString = "";
let weatherString = "No weather sightings since startup.\n";

async function deleteMsg(messageID, targetChannel) {
    targetChannel.messages.fetch(messageID)
            .then(message => message.delete())
            .catch(console.error);
}

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
        var targetChannel = client.channels.cache.get("1278845118862065758");
        var otherChannel = client.channels.cache.get("1273023049221935185");

        let message = await targetChannel.send(weatherString);
        let messageID = message.id;
        let weatherMessageID = 0;
        console.log(messageID);

        setInterval(async () => {
            let rainCheck = h.getRandomInt(10000);
            let snowCheck = h.getRandomInt(10000);
            let starCheck = h.getRandomInt(10000);
            let hurricaneCheck = h.getRandomInt(10000);
            //duration marked by minutes, min duration 1 minute, max weather duration 5 minutes
            //<t:"+endTimestamp+":R>
            const ms = Date.now();
			const currentTimestamp = Math.floor(ms/1000);
                //3540 = 59 minutes
                //please refactor this ASAP
                if(rainCheck > rainyChance && h.getRainy() == false) {
                    weatherString = "";
                    h.setRainy(true);
                    h.setRainDuration(Math.floor((ms + 60*1000 + h.getRandomInt(10*1000))/1000));
                    let msg = await otherChannel.send("# Take cover! It's started to rain! Ends <t:"+h.getRainDuration()+":R>!\n<@&1279809115291385990>");
                    weatherMessageID = msg.id;
                    rainString = "Latest **Rain** sighting: ending <t:"+h.getRainDuration()+":R>\n";
                }
                if(h.getRainy() == true) rainString = "Latest **Rain** sighting: ending <t:"+h.getRainDuration()+":R>\n";
                if(snowCheck > snowyChance && h.getSnowy() == false) {
                    weatherString = "";
                    h.setSnowy(true);
                    h.setSnowDuration(Math.floor((ms + 60*1000 + h.getRandomInt(10*1000))/1000));
                    let msg = await otherChannel.send("# It's the start of some snowfall! Ends <t:"+h.getSnowDuration()+":R>!\n<@&1279809139274682399>");
                    weatherMessageID = msg.id;
                    snowString = "Latest **Snow** sighting: ending <t:"+h.getSnowDuration()+":R>\n";
                }
                if(h.getSnowy() == true) snowString = "Latest **Snow** sighting: ending <t:"+h.getSnowDuration()+":R>\n";
                if((starCheck > starNightChance && h.getStarnight() == false)){
                    weatherString = "";
                    h.setStarnight(true);
                    h.setStarnightDuration(Math.floor((ms + 60*1000 + h.getRandomInt(300*1000))/1000));
                    let msg = await otherChannel.send("# Look above everyone! A starry sky has appeared! Ends <t:"+h.getStarnightDuration()+":R>! \n<@&1279809084459188264>");
                    weatherMessageID = msg.id;
                    starString = "Latest **Starry** sighting: ending <t:"+h.getStarnightDuration()+":R>\n";
                } 
                if(h.getStarnight() == true) rainString = "Latest **Starry** sighting: ending <t:"+h.getStarnightDuration()+":R>\n";
                if(hurricaneCheck > hurricaneChance && h.getHurricane() == false){
                    const pookies = await Pookiebears.findAll({where: {rarity: h.common }
                    });
                    let hurricanePookie = pookies[h.getRandomInt(pookies.length)];
                    h.setHurricanePookie(hurricanePookie.pookie_name);
                    weatherString = "";
                    h.setHurricane(true);
                    hurricaneDuration = Math.floor((ms + 60*1000 + h.getRandomInt(300*1000))/1000);
                    let msg = await otherChannel.send("# A hurricane of "+hurricanePookie.pookie_name+" approaches!  Ends <t:"+hurricaneDuration+":R>! \n<@&1279955197904293971>");
                    weatherMessageID = msg.id;
                    hurricaneString = "Latest **Hurricane** sighting: ending <t:"+hurricaneDuration+":R>\n";
                } 
                
            //if a weather ends, remove modifier and change displays
            //THIS SO BADDDD
                if(currentTimestamp > h.getRainDuration() && h.getRainy() == true)
                {
                    h.setRainy(false);
                    deleteMsg(weatherMessageID, otherChannel);
                    otherChannel.send("## The rain has cleared!");
                    rainString = "Last rain sighting was <t:"+h.getRainDuration()+":R>\n";
                }
                if(currentTimestamp > h.getSnowDuration() && h.getSnowy() == true)
                {
                    h.setSnowy(false);
                    deleteMsg(weatherMessageID, otherChannel);
                    otherChannel.send("## The snowfall has stopped!");
                    snowString = "Last snow sighting was <t:"+h.getSnowDuration()+":R>\n";
                }
                if(currentTimestamp > h.getStarnightDuration() && h.getStarnight() == true)
                {
                    h.setStarnight(false);
                    deleteMsg(weatherMessageID, otherChannel);
                    otherChannel.send("## The starry sky has disappeared...");
                    starString = "Last starry sighting was <t:"+h.getStarnightDuration()+":R>\n";
                }
                if(currentTimestamp > hurricaneDuration && h.getHurricane() == true)
                {
                    h.setHurricane(false);
                    deleteMsg(weatherMessageID, otherChannel);
                    otherChannel.send("## The hurricane has faded!");
                    hurricaneString = "Last hurricane sighting was <t:"+hurricaneDuration+":R>\n";
                }
            h.setWeatherClear(false);
            const next = currentTimestamp + 15;
            targetChannel.messages.fetch(messageID)
            .then(message => message.edit(weatherString+rainString+snowString+starString+hurricaneString+"Next weather check: <t:"+next+":R>"))
            .catch(console.error);
		}, 15000);

		console.log(`Weather watch in progress...`);
    },
};
