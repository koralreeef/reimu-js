const { SlashCommandBuilder, Events, GatewayIntentBits, EmbedBuilder, AttachmentBuilder, User } = require('discord.js');
const { Users, Pookiebears } = require('../../db/dbObjects.js');
const { green } = require('color-name');
const { getRandomInt, sleep } = require('../../helper.js');

const regex = /\+/gm;

//you gotta spend pookies to make pookies
module.exports = {
	data: new SlashCommandBuilder()
		.setName('doublepookie')
		.setDescription('double your pookie amounts maybe (odds: 50/50 (scales after every + on rarity))')
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
		let scaler = (p.match(regex)||[]).length;
		let allIn = 0;
		let str = "the";
        const loss = -amount;
		try{
			const pookie = await Pookiebears.findOne({ where: { pookie_name: p} } );
			const user = await Users.findOne({ where: { user_id: userID } });
			const check = user.checkPookies(pookie, userID, loss);
			if(await check == true)
			{
				user.addPookies(pookie, userID, loss);
				
				if(await user.checkAmount(pookie, userID, loss) == true) 
				{
					user.destroyPookies(pookie, userID);
					allIn = 3;
					//this fucking sucks idk what the allin boolean is for yet
					str = "**ALL** of the";
				}
				let rollToBeat = 50 - allIn + (10 * scaler);
				if(rollToBeat >= 70) rollToBeat = 70;
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
					if(roll > rollToBeat){
						console.log("hey guys");
						
						user.addPookies(pookie, userID, amount*2);
						let pookieDate = pookie.createdAt;
						const attachment = new AttachmentBuilder(pookie.file_path);
						let pookieEmbed = new EmbedBuilder()
							.setAuthor({name: "pookiebear #"+pookie.id })
														//DUDE
							.setTitle(pookie.pookie_name+"\nresult: +"+amount)
							.setImage('attachment://'+pookie.file_path.substring(9))
							.setColor(green)
							.setFooter({ text: `Doubled by: `+interaction.user.username+" at "+pookieDate.toLocaleString()+"\nwinning roll: "+roll+" > "+rollToBeat, 
										iconURL: pookie.creatorURL })

								
						return interaction.editReply({ embeds: [pookieEmbed], files: [attachment]});
					} else {
						return interaction.editReply({ content: "unlucky... you just lost "+amount+" "+pookie.pookie_name+"(s)...." 
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