const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const { Users, Pookiebears, Quests } = require('../../db/dbObjects.js');
const { getRandomInt, common, ssr, starry, starry_ssr, getEmbedColor } = require('../../helper.js');
const { Op } = require("sequelize");

let tierMap = new Map([
    [0, "ssr pookies"],
	[1, "starry night pookies"],
	[2, "plus pookies"],
    [3, "plus pookies"],
    [4, "plus plus pookies"],
])

let p;
let amount = 0;

async function buildEmbed(pookie, tier, amount){
    let embedColor = getEmbedColor(pookie.pookie_name, pookie.rarity);
    let reward = (amount/2).toFixed(0);
    let tierString = tierMap.get(tier);
    let starString = "";
    let string = "";
    //PLEASE REWRITE THIS OH MY GOD
    if(tierMap.get(tier).includes("starry night"))
    {
        starString = "starry night ";
        string = "pookies";
        tierString = "";
    }
	let pookieEmbed = new EmbedBuilder()
	.setAuthor({name: "quest tier: "+tier })
	.setTitle(pookie.pookie_name+"s needed: "+amount)
	.setThumbnail('attachment://'+pookie.file_path.substring(9))
	.setColor(embedColor)
	.setFooter({ text: `reward: `+reward+` `+starString+``+pookie.pookie_name+` `+tierString+string, 
				iconURL: 'attachment://'+pookie.file_path.substring(9) })
	return pookieEmbed;
}
async function pookieGenerator(tier){
    let pookie;
        if(tier == 0)
            pookie = await Pookiebears.findAll({ where: { rarity: common }});
        if(tier == 1)
            pookie = await Pookiebears.findAll( { where: {rarity: { [Op.or]: [common, ssr]}}});  
        if(tier == 2)
            pookie = await Pookiebears.findAll( { where: {rarity: { [Op.or]: [common, ssr, starry]}}});   
        if(tier == 3)
            pookie = await Pookiebears.findAll( { where: {rarity: { [Op.or]: [common, ssr, starry, starry_ssr]}}});  
        if(tier == 4)
            pookie = await Pookiebears.findAll( { where: {rarity: { [Op.or]: [common, ssr, starry, starry_ssr]}}});  
            const name = pookie[getRandomInt(pookie.length)];
            p = name;
            //questString = "i need "+amount+" "+name.pookie_name+"s please!!!!! ill convert them half of them to ssrs just for you!!"
            //questString = "i need "+amount+" "+name.pookie_name+"s please!!!!! ill convert them half of them to starry night pookies just for you!!"
            //questString = "i need "+amount+" "+name.pookie_name+"s please!!!!! ill convert them half of them to starry night pookies just for you!!"

        return p;
}
/* testing purposes
async function amountGenerator(tier, p){
    if(tier == 0)
        amount = 2 + getRandomInt(3);
    if(tier == 1)
    {
        amount = 4 + getRandomInt(6);
        if(p.rarity == ssr) amount = (amount/4).toFixed(0);
    }
    if(tier == 2)
    {
        amount = 8 + getRandomInt(12);
        if(p.rarity == ssr) amount = (amount/4).toFixed(0);
        if(p.rarity == starry) amount = (amount/2).toFixed(0);
    }
    if(tier == 3)
        {
            amount = 16 + getRandomInt(24);
            if(p.rarity == ssr) amount = (amount/4).toFixed(0);
            if(p.rarity == starry) amount = (amount/2).toFixed(0);
            if(p.rarity == starry_ssr) amount = (amount/8).toFixed(0);
        }
    return amount;
}
*/
async function amountGenerator(tier, p){
    if(tier == 0)
        amount = 20 + getRandomInt(30);
    if(tier == 1)
    {
        amount = 40 + getRandomInt(60);
        if(p.rarity == ssr) amount = (amount/4).toFixed(0);
    }
    if(tier == 2)
    {
        amount = 80 + getRandomInt(120);
        if(p.rarity == ssr) amount = (amount/4).toFixed(0);
        if(p.rarity == starry) amount = (amount/6).toFixed(0);
    }
    if(tier == 3)
        {
            amount = 160 + getRandomInt(240);
            if(p.rarity == ssr) amount = (amount/4).toFixed(0);
            if(p.rarity == starry) amount = (amount/6).toFixed(0);
            if(p.rarity == starry_ssr) amount = (amount/8).toFixed(0);
        }
    if(tier == 4)
        {
            amount = 320 + getRandomInt(480);
            if(p.rarity == ssr) amount = (amount/4).toFixed(0);
            if(p.rarity == starry) amount = (amount/6).toFixed(0);
            if(p.rarity == starry_ssr) amount = (amount/8).toFixed(0);
        }
    return amount;
}

async function rewardGenerator(tier, p){
    let pookie;
        if(tier == 0)
            pookie = p.pookie_name+" ssr";
        if(tier == 1)
            pookie = "starry night "+p.pookie_name;
        if(tier == 2)
            pookie = p.pookie_name+"\+";
        if(tier == 3)
            pookie = p.pookie_name+"\+";
        if(tier == 4)
            pookie = p.pookie_name+"\+\+";
            //questString = "i need "+amount+" "+name.pookie_name+"s please!!!!! ill convert them half of them to ssrs just for you!!"
            //questString = "i need "+amount+" "+name.pookie_name+"s please!!!!! ill convert them half of them to starry night pookies just for you!!"
            //questString = "i need "+amount+" "+name.pookie_name+"s please!!!!! ill convert them half of them to starry night pookies just for you!!"

        return pookie;
}
module.exports = {
    cooldown: 60,
	data: new SlashCommandBuilder()
		.setName('quest')
		.setDescription('check current quest')
        .addIntegerOption(option =>
            option.setName('questtier')
                  .setDescription('specify what tier of quests to generate')
                  .setRequired(true)),
	async execute(interaction) {
        const tier = interaction.options.getInteger('questtier');
        const user = await Users.findOne({ where: { user_id: interaction.user.id } });
        const check = await Quests.findOne({ where: { user_id: interaction.user.id }});
        if(check){
            console.log(await check);
            return await interaction.reply("you already have a quest!");
        }
        if(tier > user.questTier){
            return await interaction.reply("your quest tier isnt high enough! ("+user.questTier+" < "+tier+")");
        }
        //const userTier = Math.floor(user.quest/4);
        //figure out how to assign boss quests 

        const reroll = new ButtonBuilder()
        .setCustomId(user.user_id)
        .setLabel('🎲')
        .setStyle(ButtonStyle.Primary);

        const accept = new ButtonBuilder()
        .setCustomId(user.user_id+"1")
        .setLabel('accept')
        .setStyle(ButtonStyle.Success);

        const deny = new ButtonBuilder()
        .setCustomId(user.user_id+"2")
        .setLabel('stop search')
        .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder()
        .addComponents(reroll, accept, deny);

        p = await pookieGenerator(tier);
        amount = await amountGenerator(tier, p);
        const attachment = new AttachmentBuilder(p.file_path);
        console.log(p.name);

		const pookieEmbed = await buildEmbed(p, tier, amount);
        await interaction.reply({ embeds: [pookieEmbed],
								  files: [attachment],
                                  components: [row]
		});
        try {
        const filter = i => i.user.id === interaction.user.id;
		const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60_000 });
        collector.on('collect', async i => {
        if (i.customId === user.user_id){
            p = await pookieGenerator(tier);
            amount = await amountGenerator(tier, p);
            const attachment = new AttachmentBuilder(p.file_path);
            const pookieEmbed = await buildEmbed(p, tier, amount);
               await i.update({  content: "",
                              embeds: [pookieEmbed],
                              files: [attachment],
                              components: [row]
            })
        }
        if (i.customId === user.user_id+"1"){
            collector.stop();
            const attachment = new AttachmentBuilder(p.file_path);
            const pookieEmbed = await buildEmbed(p, tier, amount);
               await i.update({  content: "**quest accepted!**\nuse /turnin whenever you have enough pookies.",
                              embeds: [pookieEmbed],
                              files: [attachment],
                              components: []
            })
            let reward = await rewardGenerator(tier, p);
            const quest = await Quests.create({
                user_id: user.user_id,
                pookie_id: p.id,
                due_amount: amount,
                reward: reward,
                reward_amount: (amount/2).toFixed(0),
                questTier: tier
            })
            console.log(quest);
        }
        if (i.customId === user.user_id+"2"){
            collector.stop();
               await i.update({  content: "quest search stopped.",
                              embeds: [],
                              files: [],
                              components: []
            })
        }
    })
        }   catch (e) {
            await interaction.editReply({ content: 'quest not accepted within 3 minutes, cancelling', components: [] });
        }
		//await interaction.reply(questString);
	},
};