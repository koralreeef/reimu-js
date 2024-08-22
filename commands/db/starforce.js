const { SlashCommandBuilder, Events, GatewayIntentBits, EmbedBuilder, AttachmentBuilder, User } = require('discord.js');
const { Users, Pookiebears } = require('../../db/dbObjects.js');
const { blue, gold, white } = require('color-name');
const { getRandomInt, sleep } = require('../../helper.js');


async function makeStarPookie(pookie, interaction)
{
	const n = await Pookiebears.create({
		pookie_name: pookie.pookie_name+"\+",
		file_path: pookie.file_path,
		creator: interaction.user.username,
		creatorURL: interaction.user.displayAvatarURL(),
		summon_count: 0,
		rarity: pookie.rarity+"\+"
	})
	console.log(n);
	return n;
}

//you gotta spend pookies to make pookies
module.exports = {
	data: new SlashCommandBuilder()
		.setName('starforce')
		.setDescription('summon a special version of your pookie (odds: amount/50)')
        .addStringOption(option =>
			option.setName('pookie')
				.setDescription('what pookie are you using')
				.setRequired(true))
		.addIntegerOption(option =>
			option.setName('amount')
				.setDescription('how many pookies are we using')
				.setMinValue(1)
				.setMaxValue(25)
				.setRequired(true)),

	async execute(interaction) {
        const userID = interaction.user.id;
        const p = interaction.options.getString('pookie');
        const amount = interaction.options.getInteger('amount');
		let roll = getRandomInt(100);
		let allIn = false;
		let str = "the";
        const loss = -amount;
		try{
			const pookie = await Pookiebears.findOne({ where: { pookie_name: p} } );
			const user = await Users.findOne({ where: { user_id: userID } });
			const check = user.checkPookies(pookie, userID, loss);
			if(await check == true)
			{
				user.addPookies(pookie, userID, loss);
				let rollToBeat = 100 - amount*2;
				if(await user.checkAmount(pookie, userID, loss) == true) 
				{
					user.destroyPookies(pookie, userID);
					allIn = true;
					//this fucking sucks idk what the allin boolean is for yet
					str = "**ALL** of the";
				}
				const message = await interaction.reply({ content: "good luck! goodbye to "+str+" "+pookie.pookie_name+"(s)...", fetchReply: true });
					//GUYS IS THERE ANY BETTER WAY TO DO THIS
					await message.react('🇵');
					await sleep(2000);
					await message.react('0️⃣');
					await sleep(2000);
					await message.react('🇴');
					await sleep(2000);
					await message.react('🇰');
					await sleep(2000);
					await message.react('🇮');
					await sleep(2000);
					await message.react('🇪');

					//100 - amount*2
					if(roll > rollToBeat){
						console.log("hey guys");
						await interaction.followUp({ content: "congrats on the new **"+pookie.pookie_name+"+**!!! \nyour winning roll: "+roll+" > "+rollToBeat}); 

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
						
						user.addPookies(newpookie, userID, 1);
						let pookieDate = newpookie.createdAt;
						const attachment = new AttachmentBuilder(newpookie.file_path);
						let pookieEmbed = new EmbedBuilder()
							.setAuthor({name: "pookiebear #"+newpookie.id })
														//DUDE
							.setTitle(newpookie.pookie_name+"\t\t\t\t\t\tsummon count: "+newCount)
							.setImage('attachment://'+newpookie.file_path.substring(9))
							.setColor(white)
							.setFooter({ text: `Creator: `+newpookie.creator+" at "+pookieDate.toLocaleString(), 
										iconURL: newpookie.creatorURL })

								
						return interaction.followUp({ embeds: [pookieEmbed], files: [attachment]});
					} else {
						return interaction.followUp({ content: "unlucky... you just boomed "+amount+" "+pookie.pookie_name+"(s) away...." 
													  +"\nyour unlucky roll: "+roll+" < "+rollToBeat}); 
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