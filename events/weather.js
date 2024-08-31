const { Events } = require('discord.js');
const { ActivityType } = require('discord.js');
const { getTotalPookies } = require('../helper.js');
const { getRandomInt, getSnowy, setSnowy, getRainy, setRainy, getStarnight, setStarnight } = require('../helper.js');

//This is Shit
var rainyChance = 9980;
var snowyChance = 9985;
var starNightChance = 9995;
let rainDuration = Math.floor(Date.now()/1000), snowDuration = Math.floor(Date.now()/1000), starnightDuration = Math.floor(Date.now()/1000);
let rainString = "", snowString = "", starString = "";
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
            let rainCheck = getRandomInt(10000);
            let snowCheck = getRandomInt(10000);
            let starCheck = getRandomInt(10000);
            //duration marked by minutes, min duration 1 minute, max weather duration 5 minutes
            //<t:"+endTimestamp+":R>
            const ms = Date.now();
			const currentTimestamp = Math.floor(ms/1000);
                //3540 = 59 minutes
                if(rainCheck > rainyChance && getRainy() == false) {
                    weatherString = "";
                    setRainy(true);
                    rainDuration = Math.floor((ms + 60*1000 + getRandomInt(10*1000))/1000);
                    let msg = await otherChannel.send("# Take cover! It's started to rain! Ends <t:"+rainDuration+":R>!");
                    weatherMessageID = msg.id;
                    rainString = "Latest **Rain** sighting: ending <t:"+rainDuration+":R>\n";
                }
                if(snowCheck > snowyChance && getSnowy() == false) {
                    weatherString = "";
                    setSnowy(true);
                    snowDuration = Math.floor((ms + 60*1000 + getRandomInt(10*1000))/1000);
                    let msg = await otherChannel.send("# It's the start of some snowfall! Ends <t:"+snowDuration+":R>!");
                    weatherMessageID = msg.id;
                    snowString = "Latest **Snow** sighting: ending <t:"+snowDuration+":R>\n";
                }
                if(starCheck > starNightChance && getStarnight() == false){
                    weatherString = "";
                    setStarnight(true);
                    starnightDuration = Math.floor((ms + 60*1000 + getRandomInt(300*1000))/1000);
                    let msg = await otherChannel.send("# Look above everyone! A starry sky has appeared! Ends <t:"+starnightDuration+":R>!");
                    weatherMessageID = msg.id;
                    starString = "Latest **Starry** sighting: ending <t:"+starnightDuration+":R>\n";
                } 
            
            //if a weather ends, remove modifier/return to single weather mode and change displays
                if(currentTimestamp > rainDuration && getRainy() == true)
                {
                    setRainy(false);
                    deleteMsg(weatherMessageID, otherChannel);
                    otherChannel.send("## The rain has cleared!");
                    rainString = "Last rain sighting was <t:"+rainDuration+":R>\n";
                }
                if(currentTimestamp > snowDuration && getSnowy() == true)
                {
                    setSnowy(false);
                    deleteMsg(weatherMessageID, otherChannel);
                    otherChannel.send("## The snowfall has stopped!");
                    snowString = "Last snow sighting was <t:"+snowDuration+":R>\n";
                }
                if(currentTimestamp > starnightDuration && getStarnight() == true)
                {
                    setStarnight(false);
                    deleteMsg(weatherMessageID, otherChannel);
                    otherChannel.send("## The starry sky has disappeared...");
                    starString = "Last starry sighting was <t:"+starnightDuration+":R>\n";
                }
            const next = currentTimestamp + 15;
            targetChannel.messages.fetch(messageID)
            .then(message => message.edit(weatherString+rainString+snowString+starString+"Next weather check: <t:"+next+":R>"))
            .catch(console.error);
            //put this somewhere else maybe
            client.user.setActivity('activity', { type: ActivityType.Custom, name: "custom", state: getTotalPookies()+" pookies down in the fantastic blowhole"});
		}, 15000);

		console.log(`Weather watch in progress...`);
    },
};
