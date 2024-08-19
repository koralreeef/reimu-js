const { Events, EmbedBuilder } = require('discord.js');
const { LegacyClient, getModsEnum, calcAccuracy, calcModStat  } = require('osu-web.js');
const { AccessToken } = require('../config.json');
const { coral } = require('color-name');
const { hr, dt, ez, ht } = calcModStat;
const legacyApi = new LegacyClient(AccessToken);

const regex = /^\.rs \D{1,}/gm;
const diff_increasing_mods = ['HR', 'DT', 'HT', 'EZ']
function getLength(s) {
	minutes = Math.trunc(s/60);
	seconds = Math.trunc(s - minutes*60);
	if(seconds < 10) return minutes+":0"+seconds;
    return minutes+":"+seconds;
}

function scrub(mods) {
    return mods.filter( //NF HD
        (x) => {
            console.log(x)
            return diff_increasing_mods.includes(x);
        }
    )
}

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
        let msg = message.content;
        if(regex.test(msg)) {
            let usr = msg.substring(4);
            console.log(usr);
            try{
            const r = await legacyApi.getUserRecentScores({
                u: usr,
                limit: 1,
                m: '0'
              });

            const rs = r[0];
            let mod = rs.enabled_mods;
            console.log(mod);
            console.log(scrub(mod));
            const u = await legacyApi.getUser({
                u: usr
            })

            const m = await legacyApi.getBeatmaps({
                b: rs.beatmap_id,
                limit: 1,
                m: '0',
                mods: scrub(mod)
            })

            console.log(getModsEnum(mod));
            const user = u;
            const map = m[0];
            let diffValues = "";

            let mapCS = "CS:  "+map.diff_size;
            let mapAR = "  AR:  "+map.diff_approach.toFixed(2);
            let mapOD = "  OD:  "+map.diff_overall.toFixed(2);
            let mapBPM = "\nBPM:  "+map.bpm.toFixed(2);
            let mapLength = "  Length:  "+getLength(map.hit_length);

            let dtLength = dt.length(map.hit_length);
            let htLength = ht.length(map.hit_length);
            console.log(map.difficultyrating);
            const accuracy = calcAccuracy.osu(rs.count300, rs.count100, rs.count50, rs.countmiss) * 100;

            //THIS FUCKING SUCKS (edit its a little better)
            if(mod.includes("HR")){
                mapCS = "CS:  "+hr.cs(map.diff_size).toFixed(2);
                mapAR = "  AR:  "+hr.ar(map.diff_approach).toFixed(2);
                mapOD = "  OD:  "+hr.od(map.diff_overall).toFixed(2);
            }  
            if(mod.includes("EZ")){
                mapCS = "CS:  "+ez.cs(map.diff_size).toFixed(2);
                mapAR = "  AR:  "+ez.ar(map.diff_approach).toFixed(2);
                mapOD = "  OD:  "+ez.od(map.diff_overall).toFixed(2);
            } 
            if(mod.includes("DT"))
            {     
                mapAR = "  AR:  "+dt.ar(map.diff_approach).toFixed(2);  
                mapOD = "  OD:  "+dt.od(map.diff_overall).toFixed(2);
                mapBPM = "\nBPM:  "+dt.bpm(map.bpm).toFixed(2);  
                mapLength = "  Length:  "+getLength(dtLength);

                    if(mod.includes("HR")){
                            mapAR = "  AR:  "+dt.ar(hr.ar(map.diff_approach)).toFixed(2);
                            mapOD = "  OD:  "+dt.ar(hr.od(map.diff_overall)).toFixed(2);
                    }
                    else if(mod.includes("EZ")){
                            mapAR = "  AR:  "+dt.ar(ez.ar(map.diff_approach)).toFixed(2);
                            mapOD = "  OD:  "+dt.od(ez.od(map.diff_overall)).toFixed(2);
                    } 
            }
            else if(mod.includes("HT"))
            {  
                mapAR = "  AR:  "+ht.ar(map.diff_approach).toFixed(2);  
                mapOD = "  OD:  "+ht.od(map.diff_overall).toFixed(2);
                mapBPM = "\nBPM:  "+ht.bpm(map.bpm).toFixed(2);  
                mapLength = "  Length:  "+getLength(htLength);

                    if(mod.includes("HR")){
                            mapAR = "  AR:  "+ht.ar(hr.ar(map.diff_approach)).toFixed(2);
                            mapOD = "  OD:  "+ht.ar(hr.od(map.diff_overall)).toFixed(2);
                    }
                    else if(mod.includes("EZ")){
                            mapAR = "  AR:  "+ht.ar(ez.ar(map.diff_approach)).toFixed(2);
                            mapOD = "  OD:  "+ht.od(ez.od(map.diff_overall)).toFixed(2);
                    } 
            }  

            diffValues = mapCS+mapAR+mapOD+mapBPM+mapLength;
            console.log(diffValues);
            let t = rs.date;
            let date = Date.parse(t);
            let timestamp = Math.floor(date/1000) - (7 * 60 * 60);
            if(mod.length == 0) mod = ['NM'];
            let total = map.count_slider + map.count_normal + map.count_spinner;
            let percentage = ((rs.count300 + rs.count100 + rs.count50 + rs.countmiss));
            percentage = (percentage / total) * 100


            let rsEmbed = new EmbedBuilder()
                .setAuthor({ name: "Most recent score by "+user.username,
                    iconURL: "https://a.ppy.sh/"+u.user_id
                })
                .setTitle(map.artist+" - "+map.title+" ["+map.version+"] "+map.difficultyrating.toFixed(2)+"✰")
                .setURL("https://osu.ppy.sh/b/"+map.beatmap_id)
                .setThumbnail("https://b.ppy.sh/thumb/"+map.beatmapset_id+"l.jpg")
                .addFields(
                    {
                        name: "@"+Math.round(percentage)+"%**   "+rs.rank+"**   |   +**"+mod+"**   |   **"+rs.maxcombo+"x/**"+map.max_combo+"x   |   **"+rs.score.toLocaleString()+"**",
                        value: "         **"+accuracy.toFixed(2)+"%**"  +"     {"+rs.count300+" | "+rs.count100+" | "+rs.count50+" | "+rs.countmiss+"} "+"  <t:"+timestamp+":R>",
                        inline: false
                    },
                    {
                        name: diffValues,
                        value: " ",
                        inline: false
                    },
                )
                .setColor(coral)
                .setFooter({text : map.approved+" mapset by "+map.creator,
                    iconURL: "https://a.ppy.sh/"+map.creator_id 
                });
            message.channel.send({ embeds: [rsEmbed]});
            } catch (error){
                console.log(error);
                //do errors later loololol
                return message.channel.send({ content: 'no scores set in 24 hours or user doesnt exist', ephemeral: true });
            }
        }
    }
}

//https://discordjs.guide/popular-topics/canvas.html#getting-started
//https://b.ppy.sh/thumb/<beatmapset_id>l.jpg
//need to implement collections to make rs easier