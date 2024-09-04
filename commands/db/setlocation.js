const { SlashCommandBuilder } = require('discord.js');
const { Users } = require('../../db/dbObjects.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setlocation')
		.setDescription('sets current location if you have any unlocked')
        .addStringOption(option =>
            option.setName('location')
                  .setDescription('where we droppin')
                  .addChoices(
                    { name: 'pookie forest', value: 'pookie forest' },
                    { name: 'casino zone', value: 'casino zone' },
                    { name: 'star peak', value: 'star peak' },
                    )),
	async execute(interaction) {
        const location = interaction.options.getString("location");
        const user = await Users.findOne({ where: { user_id: interaction.user.id } });
        if(user.questTier < 1)
		return await interaction.reply("you dont have any locations yet! have you tried using /quest?");
        if(location == 'pookie forest')
        {
            user.update({ location: location}, 
                {where: {user_id: user.id} });
                return await interaction.reply("location set to pookie forest!");    
        }
        if(location == 'casino zone')
            {
                if(user.questTier >= 2){
                    user.update({ location: location}, 
                        {where: {user_id: user.id} });
                        return await interaction.reply("location set to casino zone!"); 
                    } else {
                        return await interaction.reply("quest tier isnt high enough!");
                    }
            }
        if(location == 'star peak')
            {
                if(user.questTier >= 3){
                    user.update({ location: location}, 
                        {where: {user_id: user.id} });
                        return await interaction.reply("location set to star peak!"); 
                    }  else {
                        return await interaction.reply("quest tier isnt high enough!");
                    }
            }
	},
};