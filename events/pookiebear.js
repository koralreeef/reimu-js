const { Events, EmbedBuilder } = require('discord.js');
const { Users, Tags} = require('../db/dbObjects.js');
const { blue, gold } = require('color-name');
const h = require('../helper.js')

let latestID, latestTag;

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
        if (message.author.bot) return;
        if(message.content === 'pookiebear')
        {
            latestTag = await Tags.findOne({
                order: [[ 'id', 'DESC' ]]
            })
            latestID = latestTag.id;
            h.addBalance(message.author.id, 1);
            if(h.getRandomInt(100) > h.commonSR) {
    
            //console.log("current db limit: "+latestID);
            let userID = message.author.id;
            let userUsername = message.author.username;
            
            let pookiebearz = await Tags.findAll({where: {rarity: "common"}} );
            let pookiebearID = h.getRandomInt(pookiebearz.length);
    
            let currentTag = pookiebearz[pookiebearID];
    
                if(h.getRandomInt(100) > h.SSR)
                {
                    let ssrName = currentTag.name+" SSR";
                    const ssrTag = await Tags.findOne({ where: {name: ssrName, rarity: "SSR"}});
    
                let newCount = ssrTag.usage_count + 1;
    
                Tags.update({ 
                    usage_count: newCount
                 }, {
                     where: {id: ssrTag.id} 
                 });
    
                console.log(await ssrTag);
                let embedSSR = new EmbedBuilder()
                .setImage(currentTag.description)
                .setColor(gold)
                .setFooter({ text: `Holy shit! ${userUsername} just summoned ${ssrTag.name} in ${h.getBalance(userID)} attempt(s)!
                            \nThis rare pookiebear has been summoned ${newCount} time(s).`, 
                            iconURL: ssrTag.description })
    
                console.log(await ssrTag.id);
                const pookie = await Tags.findOne({ where: { id: ssrTag.id} } );
                const user = await Users.findOne({ where: { user_id: userID } });
                user.addPookie(pookie, userID);
    
                message.channel.send({ embeds: [embedSSR] });
                h.wipeBalance(userID);
                return;
                }
                
            let newCount = currentTag.usage_count + 1;
            
            Tags.update({ 
                usage_count: newCount
             }, {
                 where: {id: currentTag.id} 
             });
                
            let embed = new EmbedBuilder()
                .setImage(currentTag.description)
                .setColor(blue)
                .setFooter({ text: `${userUsername} took ${h.getBalance(userID)} attempt(s) to summon ${currentTag.name}!
                            \nThis pookiebear has been summoned ${newCount} time(s).`, 
                            iconURL: currentTag.description })
    
            //add pookiebear to inventory
            const pookie = await Tags.findOne({ where: { id: currentTag.id} } );
            const user = await Users.findOne({ where: { user_id: userID } });
            user.addPookie(pookie, userID);
    
            //console.log(await UserPookies.findAll());
            message.channel.send({ embeds: [embed] });
            h.wipeBalance(userID);
            return;
            }
        }
}
}

//https://stackoverflow.com/questions/37614649/how-can-i-download-and-save-a-file-using-the-fetch-api-node-js
