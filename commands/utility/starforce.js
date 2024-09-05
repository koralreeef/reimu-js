const { SlashCommandBuilder, Events, GatewayIntentBits, EmbedBuilder, AttachmentBuilder, User } = require('discord.js');
const { Users, Pookiebears } = require('../../db/dbObjects.js');
const { lightcoral } = require('color-name');
const { getRandomInt, sleep, getStarnight, getEmbedColor } = require('../../helper.js');
const regex = /\+/gm;

async function makeStarPookie(pookie, interaction)
{
	const n = await Pookiebears.create({
		pookie_name: pookie.pookie_name+"\+",
		file_path: pookie.file_path,
		creator: interaction.user.username,
		creatorURL: interaction.user.displayAvatarURL(),
		summon_count: 0,
		rarity: pookie.rarity+5
	})
	console.log(n);
	return n;
}

//you gotta spend pookies to make pookies
module.exports = {
	data: new SlashCommandBuilder()
		.setName('starforce')
		.setDescription('summon a special version of your pookie (use /starforce calc for odds)')
        .addStringOption(option =>
			option.setName('pookie')
				.setDescription('what pookie are you using')
				.setAutocomplete(true)
				.setRequired(true))
		.addIntegerOption(option =>
			option.setName('amount')
				.setDescription('how many pookies are we using')
				.setMinValue(1)
				.setMaxValue(25)
				.setRequired(true))
		.addIntegerOption(option =>
			option.setName('pookies')
				.setDescription('how many pookies per roll (ex. 20 amount/ 5 pookies = 4; 4 rolls')
				.setMinValue(1)
				.setMaxValue(25)
				.setRequired(true)),	
	async autocomplete(interaction) {
		//find a way to autocomplete all in?
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
        const userID = interaction.user.id;
		const u = await Users.findOne({ where: { user_id: interaction.user.id } });
		if(u) {} else {
            return await interaction.reply("you havent summoned a pookiebear yet!");}
        const p = interaction.options.getString('pookie');
        let amount = interaction.options.getInteger('amount');
		const r = interaction.options.getInteger('pookies') || amount;

		const rolls = Math.floor(amount/r);
		let leftovers = amount%r; 
		let embedColor = lightcoral;
		amount = amount - leftovers;

		let scaler = (p.match(regex)||[]).length;
		let starMultiplier = 0;
		if (getStarnight()) starMultiplier = 15;
		if(u.location == 'star peak') starMultiplier = starMultiplier + 10;
		let allIn = 0;
		let str = "the";
		let wincount = 0;

        const loss = -amount;
		const pookie = await Pookiebears.findOne({ where: { pookie_name: p} } );
		const user = await Users.findOne({ where: { user_id: userID } });
		const check = user.checkPookies(pookie, userID, loss);
		const date = new Date();

		if (await check == false){
			return interaction.reply({ content: "you dont have enough of those brokie", ephemeral: true });
		} else { 
			if (rolls == 0)
				return interaction.reply({ content: "pookies cannot be greater than amount given (ex. 5 amount/6 pookies)", ephemeral: true });
			user.addPookies(pookie, userID, loss, pookie.rarity);
			if(await user.checkAmount(pookie, userID, loss) == true) 
				{
					user.destroyPookies(pookie, userID, user.favoritePookie);
					allIn = 3;
					str = "**ALL** of the";
				} else if (amount == 25) allIn = 3;	
			const message = await interaction.reply({ content: "good luck to <@"+userID+"> with these "+rolls+" roll(s)! goodbye to "
														+str+" **"+amount+"** "+pookie.pookie_name+"(s)...", fetchReply: true });
			//GUYS IS THERE ANY BETTER WAY TO DO THIS
			await message.react('🇵');
			await sleep(1000);
			await message.react('0️⃣');
			await sleep(1000);


		let newpookie;
		let newCount;
		let rollString = "";
		let rollToBeat = 0;
		for(let i = 0; i < rolls; i++){
			let roll = getRandomInt(100);
			rollToBeat = 50 - r*2 - allIn + (8 * scaler);
			if(rollToBeat >= 99) rollToBeat = 99;
			//100 - amount*2

			//console.log("roll: "+roll+", rollToBeat: "+rollToBeat);
			rollString += "roll: "+roll+"\n";
			roll = roll + starMultiplier;
			if(roll> rollToBeat){
				//console.log("one win");
				wincount++;
				//await interaction.followUp({ content: "congrats <@"+userID+"> on the new **"+pookie.pookie_name+"+**!!! \nyour winning roll: "+roll+" > "+rollToBeat}); 

				newpookie = await Pookiebears.findOne({ where: {pookie_name: pookie.pookie_name+"\+"}});
				if(newpookie){
					//console.log("already made "+newpookie.pookie_name);
				} else { 
					newpookie = await makeStarPookie(pookie, interaction);
				}

				newCount = await newpookie.summon_count + 1;
				//console.log(newCount);
				await Pookiebears.update({ summon_count: newCount }, 
					{ where: {id: newpookie.id} 
				});
				
				user.addPookies(newpookie, userID, 1, newpookie.rarity);						
			} 
		} 

				await message.react('🇴');
				await sleep(1000);
				await message.react('🇰');
				await sleep(1000);
				await message.react('🇮');
				await sleep(1000);
				await message.react('🇪');

		//add back transparency somehow maybe txt file
		if(wincount > 0){
		embedColor = getEmbedColor(newpookie.pookie_name, newpookie.rarity);
		const attachment = new AttachmentBuilder(newpookie.file_path);
		let pookieEmbed = new EmbedBuilder()
			.setAuthor({name: "pookiebear #"+newpookie.id })
										//DUDE
			.setTitle(newpookie.pookie_name+"\nroll results: "+wincount+"/"+rolls+" ("+r+" pookies/roll)")
			//.setDescription("roll to beat: "+rollToBeat+"\n"+rollString)
			.setImage('attachment://'+newpookie.file_path.substring(9))
			.setColor(embedColor)
			.setFooter({ text: `Summoned by: `+interaction.user.username+" at "+date.toLocaleString()+
								"\nsummon count: "+newCount, 
						iconURL: newpookie.creatorURL })
		return interaction.editReply({ embeds: [pookieEmbed], files: [attachment]});
		} else {
			rollToBeat = rollToBeat - starMultiplier;
			return interaction.editReply({ content: "unlucky... you just boomed "+amount+" "+pookie.pookie_name+
										"(s) away....\nroll to beat: "+rollToBeat+"\nunlucky rolls: \n"+rollString}); 
		}
	}
	},
};