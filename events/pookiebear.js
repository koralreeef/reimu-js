const { Events, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { Users, Pookiebears } = require('../db/dbObjects.js');
const { blue, gold } = require('color-name');
const h = require('../helper.js')

let latestID, latestPookie;

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
        //if (message.author.bot) return;
        if(message.content === 'pookiebear')
        {
            latestPookie = await Pookiebears.findOne({
                order: [[ 'id', 'DESC' ]]
            })
            latestID = latestPookie.id;
            h.addBalance(message.author.id, 1);
            if(h.getRandomInt(100) > h.commonSR) {
    
            //console.log("current db limit: "+latestID);
            let userID = message.author.id;
            let userUsername = message.author.username;
            
            let pookieCommons = await Pookiebears.findAll({where: {rarity: "common"}} );
            let pookiebearID = h.getRandomInt(pookieCommons.length);
    
            const currentPookie = pookieCommons[pookiebearID];
            const pookieFileName = currentPookie.file_path.substring(9)

                if(h.getRandomInt(100) > h.SSR)
                {
                    let ssrName = currentPookie.pookie_name+" SSR";
                    const ssrPookie = await Pookiebears.findOne({ where: {pookie_name: ssrName, rarity: "SSR"}});
    
                    let newCount = ssrPookie.summon_count + 1;
    
                    Pookiebears.update({ summon_count: newCount }, 
                        { where: {id: ssrPookie.id} 
                     });
    
                console.log(await ssrPookie);
                const attachment = new AttachmentBuilder(ssrPookie.file_path)
                
                let embedSSR = new EmbedBuilder()
                .setImage('attachment://'+pookieFileName)
                .setColor(gold)
                .setFooter({ text: `Holy shit! ${userUsername} just summoned ${ssrPookie.pookie_name} in ${h.getBalance(userID)} attempt(s)!
                            \nThis rare pookiebear has been summoned ${newCount} time(s).`, 
                            iconURL: 'attachment://'+pookieFileName })
    
                const pookie = await Pookiebears.findOne({ where: { id: ssrPookie.id} } );
                const user = await Users.findOne({ where: { user_id: userID } });
                user.addPookies(pookie, userID, 1);
    
                message.channel.send({ embeds: [embedSSR], files: [attachment]});
                h.wipeBalance(userID);
                return;
                }
                
            let newCount = currentPookie.summon_count + 1;
            
            Pookiebears.update({ summon_count: newCount }, 
                { where: {id: currentPookie.id} 
             });
                
            const attachment = new AttachmentBuilder(currentPookie.file_path)
            //console.log(attachment);
            let embed = new EmbedBuilder()
                .setImage('attachment://'+pookieFileName)
                .setColor(blue)
                .setFooter({ text: `${userUsername} took ${h.getBalance(userID)} attempt(s) to summon ${currentPookie.pookie_name}!
                            \nThis pookiebear has been summoned ${newCount} time(s).`, 
                            iconURL: 'attachment://'+pookieFileName })
    
            //add pookiebear to inventory
            const pookie = await Pookiebears.findOne({ where: { id: currentPookie.id} } );
            const user = await Users.findOne({ where: { user_id: userID } });
            user.addPookies(pookie, userID, 1);
            
            //console.log(await UserPookies.findAll());
            message.channel.send({ embeds: [embed], files: [attachment] });
            h.wipeBalance(userID);
            return;
            }
        }
}
}

//https://stackoverflow.com/questions/37614649/how-can-i-download-and-save-a-file-using-the-fetch-api-node-js
