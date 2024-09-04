const { SlashCommandBuilder } = require('discord.js');
const { Users, Pookiebears } = require('../../db/dbObjects.js');
const h = require('../../helper.js');

const weatherMap = new Map([
	['rain', 1],
	['snow', 2],
	['star', 4],
]);

function getLength(s) {
	minutes = Math.trunc(s/60);
	seconds = Math.trunc(s - minutes*60);
    if(seconds < 60 && minutes == 0){
        return seconds+" seconds!";
    }
    if(seconds == 0)
        return minutes+" minutes!";
    return minutes+" minutes and "+seconds+" seconds!";
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('summonweather')
		.setDescription('summon any type of weather for some pookies')
        .addStringOption(option =>
            option.setName('pookie')
                .setDescription('rarer pookies are worth more')
                .setAutocomplete(true)
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('how many are you using (need 20 in total at least)')
                .setMinValue(1)
                .setRequired(true))

        .addStringOption(option =>
            option.setName('weather')
                .setDescription('some weathers are unavaliable or more expensive to upkeep')
                .addChoices(
                    { name: 'rainy', value: 'rain' },
                    { name: 'snowy', value: 'snow' },
                    { name: 'starry', value: 'star' },
                )
                .setRequired(true))

        .addStringOption(option =>
            option.setName('pookie2')
                .setDescription('rarer pookies are worth more')
                .setAutocomplete(true))
        .addIntegerOption(option =>
            option.setName('amount2')
                .setMinValue(1)
                .setDescription('how many are you using'))
 
        .addStringOption(option =>
            option.setName('pookie3')
                .setDescription('rarer pookies are worth more')
                .setAutocomplete(true))
        .addIntegerOption(option =>
            option.setName('amount3')
                .setMinValue(1)
                .setDescription('how many are you using')),
 
    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused();
        const user = await Users.findOne({ where: { user_id: interaction.user.id } });
        const pookies = await user.getPookies(interaction.user.id);
        const choices = pookies.map(i => i.pookie.pookie_name);
        const filtered = choices.filter(choice => choice.startsWith(focusedValue)).slice(0, 5);
        await interaction.respond(
            filtered.map(choice => ({ name: choice, value: choice })),
        );
    },  

	async execute(interaction) {
        let pookie = interaction.options.getString('pookie');
        let pookie2 = interaction.options.getString('pookie2') || "";
        let pookie3 = interaction.options.getString('pookie3') || "";

        let amount = interaction.options.getInteger('amount');
        let amount2 = interaction.options.getInteger('amount2');
        let amount3 = interaction.options.getInteger('amount3');

        let loss = -amount;
        let loss2 = -amount2;
        let loss3 = -amount3;

        const user = await Users.findOne({ where: { user_id: interaction.user.id}})
        const p1 = await Pookiebears.findOne({ where: { pookie_name: pookie}})
        const p2 = await Pookiebears.findOne({ where: { pookie_name: pookie2}})
        const p3 = await Pookiebears.findOne({ where: { pookie_name: pookie3}})
        const userID = user.user_id;

        const checkWeather = new Map([
            ['rain', h.getRainy()],
            ['snow', h.getSnowy()],
            ['star', h.getStarnight()],
        ]);

        let weather = interaction.options.getString('weather');
        let weatherMultiplier = weatherMap.get(weather);
        if(amount + amount2 + amount3 < 20)
            return await interaction.reply({ content: 'that is not enough pookies (need 20)', ephemeral: true});

        if(pookie2 != "" && pookie3 != ""){
        if(pookie == pookie2 || pookie2 == pookie3 || pookie3 == pookie)
            return await interaction.reply({ content: 'you cannot use the same pookies', ephemeral: true});
        }
    
        if(checkWeather.get(weather) == true)
            return await interaction.reply({ content: weather+ ' is already happening!', ephemeral: true});

        let check2 = false;
        let check3 = false;
        let check = await user.checkPookies(p1, userID, loss);
        console.log("fart 2");
        if(p2)
        check2 = await user.checkPookies(p2, userID, loss2);
        if(p3)
        check3 = await user.checkPookies(p3, userID, loss3);

        console.log(await check);
        console.log("fart");
        if(await check == true){
            if(await user.checkAmount(p1, userID, loss) == true) 
                user.destroyPookies(p1, userID, user.favoritePookie);
            else
            user.addPookies(p1, userID, loss, p1.rarity);
            console.log(await check);
        if(check2 == true){
            if(await user.checkAmount(p2, userID, loss) == true) 
                user.destroyPookies(p2, userID, user.favoritePookie);
            else
            user.addPookies(p2, userID, loss2, p2.rarity);
            }
        if(check3 == true)               
            if(await user.checkAmount(p3, userID, loss3) == true) 
                    user.destroyPookies(p3, userID, user.favoritePookie);
            else
            user.addPookies(p3, userID, loss3, p3.rarity); 
        } else return await interaction.reply("you dont have enough of those!");

        const pookieMap = new Map([
            [p1, amount],
            [p2, amount2],
            [p3, amount3]
        ]);

        let weatherTime = 0;
        for (let [key, value] of pookieMap) {
            if(key != "" && value > 0){
                let rareMultiplier = (key.rarity/50).toFixed(2);
                if(key.rarity == 0) rareMultiplier = 1;
                /*
                console.log(r.rarity);
                console.log("rare: "+rareMultiplier);
                console.log("total: "+((value * 5 * rareMultiplier)/weatherMultiplier));
                */
                weatherTime = weatherTime + (value * 10 * rareMultiplier)/weatherMultiplier;
            }
        }

        let weatherDuration = Math.floor((Date.now() + weatherTime*1000) /1000);
        console.log("time: "+weatherTime);
        let weatherString = "";
        let ping = "";
        switch(weather) {
            case "rain":
                h.setRainDuration(weatherDuration);
                h.setRainy(true);
                console.log(weather+" set")
                weatherString = "A rainy sky has been summoned by ";
                ping = "<@&1279809115291385990>";
                break;
            case "snow":
                h.setSnowDuration(weatherDuration);
                h.setSnowy(true);
                console.log(weather+" set")
                weatherString = "A snowfall has been summoned by ";
                ping = "<@&1279809139274682399>";
                break;
            case "star":
                h.setStarnightDuration(weatherDuration);
                h.setStarnight(true);
                console.log(weather+" set")
                weatherString = "A starry night has been summoned by ";
                ping = "<@&1279809084459188264>";
        }

		return await interaction.reply('# '+weatherString+'<@'+interaction.user.id+'> for '+getLength(weatherTime.toFixed(0))+'!\n');
	},
};