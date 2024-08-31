const { Events, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { Users, Pookiebears } = require('../db/dbObjects.js');
const { blue, gold, cornsilk, yellow } = require('color-name');
const h = require('../helper.js')

let latestID, latestPookie;
let rainMultiplier, snowMultiplier;

async function makeStarryPookie(name, fileName, avatarURL, username, rarity){
    let ssr = rarity;
    const pookie = await Pookiebears.create({
        pookie_name: name,
        file_path: "./images/"+fileName,
        creator: username,
        creatorURL: avatarURL,
        summon_count: 1,
        rarity: 200+ssr
    });
    return pookie;
}

//LOL
async function buildEmbed(message, file_path, pookieFileName, userUsername, pookie_name, userID, newCount, pookie_id, ssr, star, color){
        newCount += 1;
        let text = "";
        //use switch soon
        if(ssr && star){
            text = `OH MY STARS!! A starry night makes anything possible!\nTotal summon count: ${newCount}`;
        } else if(ssr){
            text = `Holy shit! An SSR pookiebear!\nTotal summon count: ${newCount}`;
        } else if(star){
            text = `A pookiebear found on a starry night!\nTotal summon count: ${newCount}`;
        } else {
            text = `What a lovely pookiebear!\nTotal summon count: ${newCount}`;
        }
        {
        const attachment = new AttachmentBuilder(file_path)
    
        let embed = new EmbedBuilder()
        .setAuthor({name: "summoned by: "+userUsername+"\nattempt count: "+h.getBalance(userID)})
        .setTitle(pookie_name)
        .setImage('attachment://'+pookieFileName)
        .setColor(color)
        .setFooter({ text: text, iconURL: 'attachment://'+pookieFileName })

        //add pookiebear to inventory
        const pookie = await Pookiebears.findOne({ where: { id: pookie_id} } );
        const user = await Users.findOne({ where: { user_id: userID } });
        user.addPookies(pookie, userID, 1, pookie.rarity);
        message.channel.send({ embeds: [embed], files: [attachment]});
        
        h.addTotalPookies(1);
        h.wipeBalance(userID);}
        return;
}

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
        //if (message.author.bot) return;
        if(message.content === 'pookiebear')
        {
            if(h.getSnowy() == true) snowMultiplier = 30;
            else snowMultiplier = 0;

            if(h.getRainy() == true) rainMultiplier = 20;
            else rainMultiplier = 0;

            latestPookie = await Pookiebears.findOne({
                order: [[ 'id', 'DESC' ]]
            })
            latestID = latestPookie.id;
            h.addBalance(message.author.id, 1);
            if(h.getRandomInt(100) > (h.commonSR - rainMultiplier)) {
                
            let userID = message.author.id;
            let userUsername = message.author.username;
            let avatarURL = message.author.displayAvatarURL();

            let pookieCommons = await Pookiebears.findAll({where: {rarity: 0}} );
            let pookiebearID = h.getRandomInt(pookieCommons.length);
            let star = h.getStarnight();

            const currentPookie = pookieCommons[pookiebearID];
            const pookieFileName = currentPookie.file_path.substring(9)

                if(h.getRandomInt(100) > (h.SSR - snowMultiplier))
                {              
                        if(star){
                        let starName = "starry night "+currentPookie.pookie_name+" ssr";
                        const starpookie = await Pookiebears.findOne({ where: {pookie_name: starName, rarity: 300}});
                        if(starpookie)
                        {
                            let newCount = starpookie.summon_count + 1;
                            Pookiebears.update({ summon_count: newCount }, 
                                { where: {id: starpookie.id} 
                             });
                        } else{
                        await makeStarryPookie(starName, pookieFileName, avatarURL, userUsername, 100);
                        }
                        const newpookie = await Pookiebears.findOne({ where: {pookie_name: starName, rarity: 300}});
                        console.log(newpookie);
                        await buildEmbed(message, newpookie.file_path, pookieFileName, userUsername, newpookie.pookie_name, userID, newpookie.summon_count, newpookie.id, true, star, cornsilk);
                        return;
                    }
                    let ssrName = currentPookie.pookie_name+" ssr";
                    const ssrPookie = await Pookiebears.findOne({ where: {pookie_name: ssrName, rarity: 100}});
    
                    let newCount = ssrPookie.summon_count + 1;
    
                    Pookiebears.update({ summon_count: newCount }, 
                        { where: {id: ssrPookie.id} 
                     });
    
                    await buildEmbed(message, ssrPookie.file_path,
                                    pookieFileName, userUsername,
                                    ssrPookie.pookie_name, userID, 
                                    ssrPookie.summon_count, ssrPookie.id, 
                                    true, star, gold);
                    return;
                }
                
            //refactor later
            if(star){
                let starName = "starry night "+currentPookie.pookie_name;
                const starpookie = await Pookiebears.findOne({ where: {pookie_name: starName, rarity: 200}});
                if(starpookie)
                {
                    let newCount = starpookie.summon_count + 1;
                    Pookiebears.update({ summon_count: newCount }, 
                        { where: {id: starpookie.id} 
                        });
                } else{
                await makeStarryPookie(starName, pookieFileName, avatarURL, userUsername, "");
                }
                const newpookie = await Pookiebears.findOne({ where: {pookie_name: starName, rarity: 200}});
                console.log(newpookie);
                await buildEmbed(message, newpookie.file_path, pookieFileName, userUsername, newpookie.pookie_name, userID, newpookie.summon_count, newpookie.id, false, star, yellow);
                return;
            }
            let newCount = currentPookie.summon_count + 1;
            
            Pookiebears.update({ summon_count: newCount }, 
                { where: {id: currentPookie.id} 
             });

            await buildEmbed(message, currentPookie.file_path, 
                            pookieFileName, userUsername, 
                            currentPookie.pookie_name, userID, 
                            currentPookie.summon_count, currentPookie.id, 
                            false, star, blue);
            return;
            }
        }
    }
}

//https://stackoverflow.com/questions/37614649/how-can-i-download-and-save-a-file-using-the-fetch-api-node-js
