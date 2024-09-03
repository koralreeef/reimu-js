const { Events } = require('discord.js');
const { AccessToken, token } = require('../config.json');
const { LegacyClient, calcModStat, isOsuJSError } = require('osu-web.js');
const { hr, dt } = calcModStat;
const legacyApi = new LegacyClient(AccessToken);

function getLength(s) {
	minutes = Math.trunc(s/60);
	seconds = Math.trunc(s - minutes*60);
	if(seconds < 10) return minutes+":0"+seconds;
    return minutes+":"+seconds;
}

function arrayExists(array) {
	if(Array.isArray(array) && array.length)
		return true;
	return false;
}

function onlyUnique(value, index, array) {
	return array.indexOf(value) === index;
  }

function findTopDiff(beatmaps) {
	let topDiff = 0;
	let topDiffIndex = 0;
	for(let i = 0; i < beatmaps.length; i++)
		{
			if(beatmaps[i].difficultyrating > topDiff){
			topDiff = beatmaps[i].difficultyrating;
			topDiffIndex = i;
			}
		}
	return topDiffIndex;
}

function findDT(beatmaps) {
	let diffMap = new Map();
	for(let i = 0; i < beatmaps.length; i++)
		{
			if(beatmaps[i].difficultyrating >= 4.3 && beatmaps[i].difficultyrating.toFixed(2) <= 5.49){
			diffMap.set(beatmaps[i].difficultyrating, i);
			}
		}
		//how do i read this
		//.entries = grab all map key and value pairs
		//.sort(x, y) = do something with both key and value pairs
		//=> b[0] - a[0], 
	diffMap = new Map([...diffMap.entries()].sort((a, b) => b[0] - a[0]));
	console.log(diffMap);
	let indexes = [...diffMap.values()];
	return indexes;
}

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		var targetChannel = client.channels.cache.get("1274178425774538892");

		setInterval(async () => {

			//3 (* actual beatmaps) api call(s) (+however many dtable beatmaps) every 60s
			//HOW TO FIX THE DOUBLEPOSTING
			const ms = Date.now() - 59*1000;
			const date = new Date(ms);
			let firstMap = true;
			const startTimestamp = Math.floor(Date.now()/1000);
			try {
				//initial search
				const beatmaps = await legacyApi.getBeatmaps({
					m: "0",
					since: date,
					limit: 100
				  });
				if(arrayExists(beatmaps)) {
					//sort into unique beatmapset ids
					let beatmapArray = [];
					for(let i = 0; i < beatmaps.length; i++){
					beatmapArray[i] = beatmaps[i].beatmapset_id;
					}
					let sortedArray = beatmapArray.filter(onlyUnique);	

					let extraString = "";
					for(let i = 0; i < sortedArray.length; i++)
					{
						console.log(sortedArray);
						const beatmaps = await legacyApi.getBeatmaps({
							m: "0",
							s: sortedArray[i],
							limit: 100
						  });
						const hrBeatmaps = await legacyApi.getBeatmaps({
							m: "0",
							s: sortedArray[i],
							limit: 100,
							mods: ['HR']
						  });
						let topDiffIndex = findTopDiff(beatmaps);
						let dtIndexes = findDT(beatmaps);
						let dtString = "", dtString2 = "", bpmString = "", lengthString = "";
						let dtLength = 0;
						let nmString = "";
						//console.log(beatmaps[topDiffIndex]);
						let mapNM = beatmaps[topDiffIndex];
						let mapHR = hrBeatmaps[topDiffIndex];
						if(arrayExists(dtIndexes))
							{
								bpmString = "/"+dt.bpm(mapNM.bpm);
								lengthString = "/"+getLength(dt.length(mapNM.hit_length));
							}
						console.log("new map: https://osu.ppy.sh/b/"+mapNM.beatmap_id+" SR: "+mapNM.difficultyrating.toFixed(2));
						// -> \\\* <- LOOKS LIKE SHIT
						//processes nm/hr stats if star rating > 5.5 else if sr > 4.3 spits out dt
						if(mapNM.difficultyrating.toFixed(2) > 5.49){
						nmString = "A new beatmap by **"+mapNM.creator+"** just got "+mapNM.approved+" <t:"+startTimestamp+
											":R>!\n"+mapNM.version+": "+mapNM.difficultyrating.toFixed(2)+
											"\\\*, aim/speed SR: "+mapNM.diff_aim.toFixed(2)+"\\\*/"+mapNM.diff_speed.toFixed(2)+
											"\\\*\nhr SR: "+mapHR.difficultyrating.toFixed(2)+
											"\\\*, aim/speed SR: "+mapHR.diff_aim.toFixed(2)+"\\\*/"+mapHR.diff_speed.toFixed(2)+
											"\\\*\ncs: "+mapNM.diff_size.toFixed(2)+"/"+hr.cs(mapHR.diff_size).toFixed(2)+
											", ar: "+mapNM.diff_approach+
											", bpm: "+mapNM.bpm+bpmString+
											", length: "+getLength(mapNM.hit_length)+lengthString;
											firstMap = false;
						}

						//new dt map check
						//jnxvzxvxzcv NICE VARIABLES
						if(arrayExists(dtIndexes)) {
							if(firstMap == false) extraString = "dtable diffs: \n";
							for(let i = 0; i < dtIndexes.length; i++){
								const dtBeatmaps = await legacyApi.getBeatmaps({
									m: "0",
									//Jesus christ
									b: beatmaps[dtIndexes[i]].beatmap_id,
									limit: 1,
									mods: ['DT']
							});
							let mapDT = dtBeatmaps[0];
							let baseAR = mapDT.diff_approach;
							dtBPM = dt.bpm(mapDT.bpm);
							dtLength = dt.length(mapDT.hit_length);
							//its alright actually 
							if(firstMap == true){
											dtString = "A new DTable beatmap by **"+mapDT.creator+"** just got "+mapDT.approved+" <t:"+startTimestamp+
													":R>!\nar: "+baseAR+"/"+dt.ar(baseAR).toFixed(2)+
													", bpm: "+dt.bpm(mapDT.bpm)+
													", length: "+getLength(dtLength)+
													"\n"+mapDT.version+": "+mapDT.difficultyrating.toFixed(2)+
													"\\\*, aim/speed SR: "+mapDT.diff_aim.toFixed(2)+"\\\*/"+mapDT.diff_speed.toFixed(2)+
													"\\\*\n";
													firstMap = false;
								} else {
											dtString2 += mapDT.version+
													": "+mapDT.difficultyrating.toFixed(2)+
													"\\\*, ar: "+dt.ar(baseAR).toFixed(2)+
													", stats: "+mapDT.diff_aim.toFixed(2)+"\\\*/"+mapDT.diff_speed.toFixed(2)+"\\\*\n";	
								}
							}
							//Lmao
							targetChannel.send(nmString+"\n"+
												dtString+
												extraString+
												dtString2+
												"https://osu.ppy.sh/b/"+mapNM.beatmap_id);
						} else if(mapNM.difficultyrating.toFixed(2) > 5.4)
							{
								targetChannel.send(nmString+"\n"+
							    "https://osu.ppy.sh/b/"+mapNM.beatmap_id);
						}
					}
				} 
			} catch (error) {
				if (isOsuJSError(err)) {
					// `err` is now of type `OsuJSError`
				
					if (err.type === 'invalid_json_syntax') {
					  // `err` is now of type `OsuJSGeneralError`
					  console.error('Error while parsing response as JSON');
					} else if (err.type === 'network_error') {
					  // `err` is now of type `OsuJSGeneralError`
					  console.error('Network error');
					} else if (err.type === 'unexpected_response') {
					  // `err` is now of type `OsuJSUnexpectedResponseError`
				
					  /**
					   * If using the fetch polyfill instead of the native fetch API, write:
					   * `err.response(true)`
					   * "true" means that it will return the Response type from "node-fetch" instead of the native Response
					   */
					  const response = err.response(); // Type: `Response`
				
					  console.error('Unexpected response');
					  console.log(`Details: ${response.status} - ${response.statusText}`);
					  consoe.log('JSON: ', await response.json());
					}
				client.login(token);
				return targetChannel.send('couldn\'t process new map');
			}
		}
		}, 60001);

		console.log(`Starting search for new beatmaps...`);
	},
};