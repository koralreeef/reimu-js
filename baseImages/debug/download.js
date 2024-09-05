const { downloadFile } = require('../../helper.js');
const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('download')
		.setDescription('test download')
        .addStringOption(option =>
			option.setName('link')
				.setDescription('download file to images dir')
				.setRequired(true))
        .addStringOption(option =>
            option.setName('filename')
				.setDescription('name of file being downloaded')
				.setRequired(true)),
                
        async execute(interaction) {
            const url = interaction.options.getString('link');
            const fileName = interaction.options.getString('filename')+".jpg";
            await downloadFile(url, fileName);
            const attachment = "./images/"+fileName;

            const gungaFile = new AttachmentBuilder(attachment)
            console.log(gungaFile);

            const embed = new EmbedBuilder()
                .setImage('attachment://'+fileName)
                .setFooter({ text: fileName })

            return interaction.reply({ embeds: [embed], files: [gungaFile] });
        },
};

