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
		rarity: pookie.rarity+3
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
        const p = interaction.options.getString('pookie');
        const amount = interaction.options.getInteger('amount');
		let embedColor = lightcoral;
		let roll = getRandomInt(100);
		let scaler = (p.match(regex)||[]).length;
		let starMultiplier = 0;
		if (getStarnight()) starMultiplier = 30;
		let allIn = 0;
		let str = "the";
        const loss = -amount;
		try{
			const pookie = await Pookiebears.findOne({ where: { pookie_name: p} } );
			const user = await Users.findOne({ where: { user_id: userID } });
			const check = user.checkPookies(pookie, userID, loss);
			const date = new Date();
			if(await check == true)
			{
				user.addPookies(pookie, userID, loss, pookie.rarity);
				
				if(await user.checkAmount(pookie, userID, loss) == true || amount == 25) 
				{
					user.destroyPookies(pookie, userID, user.favoritePookie);
					allIn = 3;
					//this fucking sucks idk what the allin boolean is for yet
					str = "**ALL** of the";
				} else if (amount == 25) allIn = 3;	
				let rollToBeat = 50 - amount*2 - allIn + (5 * scaler);
				//if(rollToBeat >= 70) rollToBeat = 70;
				const message = await interaction.reply({ content: "good luck to <@"+userID+">! goodbye to "+str+" **"+amount+"** "+pookie.pookie_name+"(s)...", fetchReply: true });
					//GUYS IS THERE ANY BETTER WAY TO DO THIS
					await message.react('🇵');
					await sleep(1000);
					await message.react('0️⃣');
					await sleep(1000);
					await message.react('🇴');
					await sleep(1000);
					await message.react('🇰');
					await sleep(1000);
					await message.react('🇮');
					await sleep(1000);
					await message.react('🇪');

					//100 - amount*2
					if(roll + starMultiplier > rollToBeat){
						console.log("hey guys");
						//await interaction.followUp({ content: "congrats <@"+userID+"> on the new **"+pookie.pookie_name+"+**!!! \nyour winning roll: "+roll+" > "+rollToBeat}); 

						let newpookie = await Pookiebears.findOne({ where: {pookie_name: pookie.pookie_name+"\+"}});
						if(newpookie){
							console.log("already made "+newpookie.pookie_name);
						} else { 
							newpookie = await makeStarPookie(pookie, interaction);
						}

						let newCount = await newpookie.summon_count + 1;
						console.log(newCount);
						await Pookiebears.update({ summon_count: newCount }, 
							{ where: {id: newpookie.id} 
						 });
						embedColor = getEmbedColor(newpookie.pookie_name, newpookie.rarity);
						user.addPookies(newpookie, userID, 1, newpookie.rarity);
						const attachment = new AttachmentBuilder(newpookie.file_path);
						let pookieEmbed = new EmbedBuilder()
							.setAuthor({name: "pookiebear #"+newpookie.id })
														//DUDE
							.setTitle(newpookie.pookie_name+"\nsummon count: "+newCount)
							.setImage('attachment://'+newpookie.file_path.substring(9))
							.setColor(embedColor)
							.setFooter({ text: `Summoned by: `+interaction.user.username+" at "+date.toLocaleString()+"\nwinning roll: "+roll+" (\+"+starMultiplier+") > "+rollToBeat, 
										iconURL: newpookie.creatorURL })

								
						return interaction.editReply({ embeds: [pookieEmbed], files: [attachment]});
					} else {
						return interaction.editReply({ content: "unlucky... you just boomed "+amount+" "+pookie.pookie_name+"(s) away...." 
													  +"\nyour unlucky roll: "+roll+" (\+"+starMultiplier+") < "+rollToBeat}); 
					}
			} else {
				return interaction.reply({ content: "you dont have enough of those brokie", ephemeral: true })
			}
		} catch(err)
		{
			console.log(err);
			return interaction.followUp({ content: "it broke", ephemeral: true })
		}
	},
};