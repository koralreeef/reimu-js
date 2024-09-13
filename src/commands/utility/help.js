const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("use this if a mechanic is confusing")
    .addStringOption((option) =>
      option
        .setName("mechanics")
        .setDescription(
          "what mechanic of this lovely world would you like to know about",
        )
        .addChoices(
          { name: "pookiebears", value: "p" },
          { name: "quests", value: "q" },
          { name: "starforce", value: "s" },
          { name: "locations", value: "l" },
          { name: "weather", value: "w" },
          { name: "trading", value: "t" },
        ),
    ),
  async execute(interaction) {
    const option = interaction.options.getString("mechanics");
    if (option == "p") {
      return await interaction.reply(
        "this is an attempt of making a sorta gacha game but with user submitted characters or 'pookiebears'.\nif you send a chat message with \"pookiebear\" only," +
          " theres a chance you might find a pookiebear in the wild!\nif you want to make a pookiebear, use /pookiebear and submit a name and a cdn discord link (right click on any image sent in discord)",
      );
    }
    if (option == "q") {
      return await interaction.reply(
        "do enough quests with /quest and your quest tier goes up! your quest tier lets you travel to more locations that help with pookie gathering.\n" +
          "turn in your quests with /turnin and get a nice reward. if your questtier is above 0, try visiting a new location with /setlocation!",
      );
    }
    if (option == "s") {
      return await interaction.reply(
        "starforcing your pookies with /starforce gives them pluses at the end of their name! it also booms (destroys) the pookie if the starforce fails.\n" +
          "weather and location can influence if a starforce succeeds or not.",
      );
    }
    if (option == "l") {
      return await interaction.reply(
        "locations give passive bonuses to you, but you can only choose one! \n**pookieville** increases pookiebear chances overall, **pookie forest** gives a chance for double pookies on summon\n" +
          "**mt. pookie** gives a set amount of pookies every 30 minutes, the **casino zone** bumps your chances at the /doublepookies command, \n" +
          "and **star peak** boosts starforce chances and allows you to summon starry night pookies at any time!",
      );
    }
    if (option == "w") {
      return await interaction.reply(
        "weather can have crazy effects whenever you're manually hunting for pookiebears. rainy increases pookiebear chances overall, \n" +
          "snowy increases ssr chances, starry night lets everyone summon starry night pookies, and hurricane lets you only summon one type of pookie!",
      );
    }
    if (option == "t") {
      return await interaction.reply(
        "you can trade and/or give away pookies with /tradepookie and /givepookie respectively. work together to fulfill those quests!",
      );
    }
    return await interaction.reply(
      "spam pookiebear in a channel and see what happens!",
    );
  },
};
