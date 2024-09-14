const { SlashCommandBuilder } = require("discord.js");

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function dubsChecker(num) {
  // Find the last digit
  const digit = num % 10;
  while (num != 0) {
    const current_digit = num % 10;
    num = parseInt(num / 10);
    if (current_digit != digit) {
      return false;
    }
  }
  return true;
}

let roll;
roll = 0;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("roll")
    .setDescription("Rolls a number from 1 to a number (default/max 1000)")
    .addIntegerOption((option) =>
      option
        .setName("number")
        .setDescription("number to set max roll to")
        .setMaxValue(1000)
        .setMinValue(1)
        .setRequired(true),
    ),

  async execute(interaction) {
    const num = interaction.options.getInteger("number");
    roll = getRandomInt(num);
    await interaction.reply("You rolled: " + roll);
    if (dubsChecker(roll) == true) {
      if (roll < 100 && roll > 10) await interaction.followUp("dubs!!");
      if (roll > 100) await interaction.followUp("trips!!");
    }
  },
};
