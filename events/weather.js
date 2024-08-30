const { Events } = require('discord.js');
const { getRandomInt, getSnowy, setSnowy, getRainy, setRainy, getStarnight, setStarnight } = require('../helper.js');

var rainyChance = 900;
var snowyChance = 950;
var starNightChance = 950;
let rainDuration = Math.floor(Date.now()/1000), snowDuration = Math.floor(Date.now()/1000), starnightDuration = Math.floor(Date.now()/1000);
let rainString = "", snowString = "", starString = "";
let weatherString = "No weather sightings since startup.\n";

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
        var targetChannel = client.channels.cache.get("1278845118862065758");
        var otherChannel = client.channels.cache.get("1273023049221935185");
        let message = await targetChannel.send(weatherString);
        let messageID = message.id;
        console.log(messageID);

        setInterval(async () => {
            let weatherCheck = getRandomInt(1000);
            let rainCheck = getRandomInt(1000);
            let snowCheck = getRandomInt(1000);
            let starCheck = getRandomInt(1000);
            //duration marked by minutes, min duration 1 minute, max weather duration 5 minutes
            //<t:"+endTimestamp+":R>
            const ms = Date.now();
			const currentTimestamp = Math.floor(ms/1000);

            if(weatherCheck > 950){
                weatherString = "";
                //3540 = 59 minutes
                if(rainCheck > rainyChance && getRainy() == false) {
                    setRainy(true);
                    rainDuration = Math.floor((ms + 60*1000 + getRandomInt(10*1000))/1000);
                    otherChannel.send("# Take cover! It's started to rain!");
                    rainString = "Latest **Rain** sighting: ending <t:"+rainDuration+":R>\n";
                }
                if(snowCheck > snowyChance && getSnowy() == false) {
                    setSnowy(true);
                    snowDuration = Math.floor((ms + 60*1000 + getRandomInt(10*1000))/1000);
                    otherChannel.send("# It's the start of some snowfall!");
                    snowString = "Latest **Snow** sighting: ending <t:"+snowDuration+":R>\n";
                }
                if(starCheck > starNightChance && getStarnight() == false){
                    setStarnight(true);
                    starnightDuration = Math.floor((ms + 60*1000 + getRandomInt(300*1000))/1000);
                    otherChannel.send("# Look above everyone! A starry sky has appeared for us!");
                    starString = "Latest **Starry** sighting: ending <t:"+starnightDuration+":R>\n";
                } 
            }
            //if a weather ends, remove modifier/return to single weather mode and change displays
                if(currentTimestamp > rainDuration && getRainy() == true)
                {
                    setRainy(false);
                    rainString = "Last rain sighting was <t:"+rainDuration+":R>\n";
                }
                if(currentTimestamp > snowDuration && getSnowy() == true)
                {
                    setSnowy(false);
                    snowString = "Last snow sighting was <t:"+snowDuration+":R>\n";
                }
                if(currentTimestamp > starnightDuration && getStarnight() == true)
                {
                    setStarnight(false);
                    starString = "Last starry sighting was <t:"+starnightDuration+":R>\n";
                }
            const next = currentTimestamp + 15;
            targetChannel.messages.fetch(messageID)
            .then(message => message.edit(weatherString+rainString+snowString+starString+"Next weather check: <t:"+next+":R>"))
            .catch(console.error);
		}, 15000);

		console.log(`Weather watch in progress...`);
    },
};
