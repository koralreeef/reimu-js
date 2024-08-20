const { Events } = require('discord.js');
const { PresenceUpdateStatus } = require('discord.js');
const { ActivityType } = require('discord.js');
const { AccessToken } = require('../config.json');
const { LegacyClient, calcModStat } = require('osu-web.js');
const { hr, dt } = calcModStat;
const { Users } = require('../db/dbObjects.js');
const { currency } = require('../helper.js');
const legacyApi = new LegacyClient(AccessToken);

function getLength(s) {
	minutes = Math.trunc(s/60);
	seconds = Math.trunc(s - minutes*60);
	if(seconds < 10) return minutes+":0"+seconds;
    return minutes+":"+seconds;
}

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		
		client.user.setActivity('activity', { type: ActivityType.Custom, name: "custom", state: "down in the fantastic blowhole"});
		client.user.setStatus(PresenceUpdateStatus.DoNotDisturb);

		const storedBalances = await Users.findAll();
		storedBalances.forEach(b => currency.set(b.user_id, b));
		
		var targetChannel = client.channels.cache.get("1274178425774538892");

		setInterval(async () => {

			//30s per 2 (or 3) api calls
			const ms = Date.now() - 30*1000;
			const date = new Date(ms);
			const startTimestamp = Math.floor(Date.now()/1000);
			//const newdate = addDays(new Date, -1);
			try {
				const beatmaps = await legacyApi.getBeatmaps({
					m: "0",
					since: date,
					limit: 1
				  });
				const hrBeatmaps = await legacyApi.getBeatmaps({
					m: "0",
					since: date,
					limit: 1,
					mods: ['HR']
				  });

				if(Array.isArray(beatmaps) && beatmaps.length) {
					/* maybe do something with multiple maps in a set later 
					let setIDs = beatmaps;
					for(let i = 0; i < beatmaps.length; i++)
					{
						if(setIDs.includes(beatmaps[i].beatmapset_id)) {
							setIDs.push(beatmaps[i]);
							console.log(setIDs[i].beatmapset_id);
						
					}
					for(let i = 0; i < setIDs.length; i++){
					//console.log(setIDs[i].title);
					}																
					*/
				
					let i = 0;
					let mapNM = beatmaps[i];
					let mapHR = hrBeatmaps[i];
					console.log("new map: https://osu.ppy.sh/b/"+mapNM.beatmap_id+" SR: "+mapNM.difficultyrating.toFixed(2));

					//processes nm/hr stats if star rating > 5.5 else if sr > 4.3 spits out dt
					if(mapNM.difficultyrating.toFixed(2) > 5.49){
					targetChannel.send("A new beatmap by **"+mapNM.creator+"** just got "+mapNM.approved+" <t:"+startTimestamp+
										":R>!\nnm SR: "+mapNM.difficultyrating.toFixed(2)+
										", aim/speed SR: "+mapNM.diff_aim.toFixed(2)+"/"+mapNM.diff_speed.toFixed(2)+
										"\nhr SR: "+mapHR.difficultyrating.toFixed(2)+
										", aim/speed SR: "+mapHR.diff_aim.toFixed(2)+"/"+mapHR.diff_speed.toFixed(2)+
										"\ncs: "+mapNM.diff_size.toFixed(2)+"/"+hr.cs(mapHR.diff_size).toFixed(2)+
										", ar: "+mapNM.diff_approach+
										", bpm: "+mapNM.bpm+
										", length: "+getLength(mapNM.hit_length)+
										"\nhttps://osu.ppy.sh/b/"+mapNM.beatmap_id);							
					} else if(mapNM.difficultyrating.toFixed(2) >= 4.3 && mapNM.difficultyrating.toFixed(2) <= 5.49) {
						const dtBeatmaps = await legacyApi.getBeatmaps({
							m: "0",
							b: mapNM.beatmap_id,
							limit: 1,
							mods: ['DT']
						  });

						  let mapDT = dtBeatmaps[i];
						  let baseAR = mapDT.diff_approach;
						  let dtLength = dt.length(mapDT.hit_length);
							targetChannel.send("A new DTable beatmap by **"+mapDT.creator+"** just got "+mapDT.approved+" <t:"+startTimestamp+
												":R>!\nSR: "+mapDT.difficultyrating.toFixed(2)+
												", aim/speed SR: "+mapDT.diff_aim.toFixed(2)+"/"+mapDT.diff_speed.toFixed(2)+
												"\nar: "+baseAR+"/"+dt.ar(baseAR).toFixed(2)+
												", bpm: "+dt.bpm(mapDT.bpm)+
												", length: "+getLength(dtLength)+
												"\nhttps://osu.ppy.sh/b/"+mapDT.beatmap_id);
					}
				//}
				} 
			} catch (error) {
				console.log(error);
				return targetChannel.send('couldn\'t process new map');
			}
			
		}, 30000);

		console.log(`DB loaded! Logged in as ${client.user.tag}`);
		console.log(`Starting search for new beatmaps...`);
	},
};