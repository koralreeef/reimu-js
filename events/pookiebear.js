const {
  Events,
  EmbedBuilder,
  AttachmentBuilder,
  Message,
} = require("discord.js");
const { Users, Pookiebears } = require("../db/dbObjects.js");
const { blue, gold, cornsilk, yellow } = require("color-name");
const { pookiewatch } = require(".././config.json");
const h = require("../helper.js");

let latestID, latestPookie;
let rainMultiplier, snowMultiplier;

async function makeStarryPookie(
  name,
  fileName,
  avatarURL,
  username,
  rarity,
  source,
) {
  const ssr = rarity;
  const pookie = await Pookiebears.create({
    pookie_name: name,
    file_path: "./images/" + fileName,
    creator: username,
    creatorURL: avatarURL,
    summon_count: 1,
    rarity: h.starry + ssr,
    source: source,
  });
  return pookie;
}

// LOL
async function buildEmbed(
  message,
  file_path,
  pookieFileName,
  userUsername,
  pookie_name,
  userID,
  newCount,
  pookie_id,
  ssr,
  star,
  color,
) {
  newCount += 1;
  let doubleChance = 1;
  let text = "";
  let text3 = "";
  let text2 = "";

  // add pookiebear to inventory
  const pookie = await Pookiebears.findOne({ where: { id: pookie_id } });
  const user = await Users.findOne({ where: { user_id: userID } });
  if (user) {
    if (user.location == "pookie forest") {
      if (h.getRandomInt(100) > 50) {
        doubleChance = 2;
        text3 = "**L U C K Y !**";
        text2 = " * 2!";
        newCount += 1;
      }
    }
  }
  // use switch soon
  if (ssr && star) {
    text = `OH MY STARS!! A starry night makes anything possible!\nTotal summon count: ${newCount}`;
  } else if (ssr) {
    text = `Holy shit! An SSR pookiebear!\nTotal summon count: ${newCount}`;
  } else if (star) {
    text = `A pookiebear found on a starry night!\nTotal summon count: ${newCount}`;
  } else {
    text = `What a lovely pookiebear!\nTotal summon count: ${newCount}`;
  }
  {
    const attachment = new AttachmentBuilder(file_path);

    const embed = new EmbedBuilder()
      .setAuthor({
        name:
          "summoned by: " +
          userUsername +
          "\nattempt count: " +
          h.getBalance(userID),
      })
      .setTitle(pookie_name + text2 + "\n" + text3)
      .setImage("attachment://" + pookieFileName)
      .setColor(color)
      .setFooter({ text: text, iconURL: "attachment://" + pookieFileName });

    message.channel.send({ embeds: [embed], files: [attachment] });

    user.addPookies(pookie, userID, doubleChance, pookie.rarity);
    h.wipeBalance(userID);
  }
  return;
}

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    // if (message.author.bot) return;
    if (
      message.content.toLowerCase() === "pookiebear" &&
      pookiewatch.includes(message.channel.id)
    ) {
      if (h.getSnowy() == true) snowMultiplier = 30;
      else snowMultiplier = 0;

      if (h.getRainy() == true) rainMultiplier = 20;
      else rainMultiplier = 0;

      latestPookie = await Pookiebears.findOne({
        order: [["id", "DESC"]],
      });
      latestID = latestPookie.id;
      h.addBalance(message.author.id, 1);
      const userID = message.author.id;
      let newbonus = 0;
      let starRoll = 0;
      const u = await Users.findOne({ where: { user_id: userID } });
      if (u) {
        if (u.location == "pookieville") {
          newbonus = 10;
        }
        if (u.location == "star peak") {
          starRoll = h.getRandomInt(100);
        }
      }
      if (h.getRandomInt(100) > h.commonSR - rainMultiplier - newbonus) {
        const userUsername = message.author.username;
        const avatarURL = message.author.displayAvatarURL();

        const pookieCommons = await Pookiebears.findAll({
          where: { rarity: h.common },
        });
        const pookiebearID = h.getRandomInt(pookieCommons.length);
        const star = h.getStarnight();
        let currentPookie;
        if (h.getHurricane()) {
          currentPookie = await Pookiebears.findOne({
            where: { pookie_name: h.getHurricanePookie() },
          });
        } else {
          currentPookie = pookieCommons[pookiebearID];
        }
        const pookieFileName = currentPookie.file_path.substring(9);

        if (h.getRandomInt(100) > h.SSR - snowMultiplier) {
          if (star || starRoll > 70) {
            const starName =
              "starry night " + currentPookie.pookie_name + " ssr";
            const starpookie = await Pookiebears.findOne({
              where: { pookie_name: starName, rarity: h.starry_ssr },
            });
            if (starpookie) {
              const newCount = starpookie.summon_count + 1;
              Pookiebears.update(
                { summon_count: newCount },
                { where: { id: starpookie.id } },
              );
            } else {
              await makeStarryPookie(
                starName,
                pookieFileName,
                avatarURL,
                userUsername,
                h.ssr,
                currentPookie.source,
              );
            }
            const newpookie = await Pookiebears.findOne({
              where: { pookie_name: starName, rarity: h.starry_ssr },
            });
            // console.log(newpookie);
            await buildEmbed(
              message,
              newpookie.file_path,
              pookieFileName,
              userUsername,
              newpookie.pookie_name,
              userID,
              newpookie.summon_count,
              newpookie.id,
              true,
              star,
              cornsilk,
            );
            return;
          }
          const ssrName = currentPookie.pookie_name + " ssr";
          const ssrPookie = await Pookiebears.findOne({
            where: { pookie_name: ssrName, rarity: h.ssr },
          });

          const newCount = ssrPookie.summon_count + 1;

          Pookiebears.update(
            { summon_count: newCount },
            { where: { id: ssrPookie.id } },
          );

          await buildEmbed(
            message,
            ssrPookie.file_path,
            pookieFileName,
            userUsername,
            ssrPookie.pookie_name,
            userID,
            ssrPookie.summon_count,
            ssrPookie.id,
            true,
            star,
            gold,
          );
          return;
        }

        // refactor later
        if (star || starRoll > 70) {
          const starName = "starry night " + currentPookie.pookie_name;
          const starpookie = await Pookiebears.findOne({
            where: { pookie_name: starName, rarity: h.starry },
          });
          if (starpookie) {
            const newCount = starpookie.summon_count + 1;
            Pookiebears.update(
              { summon_count: newCount },
              { where: { id: starpookie.id } },
            );
          } else {
            await makeStarryPookie(
              starName,
              pookieFileName,
              avatarURL,
              userUsername,
              "",
              currentPookie.source,
            );
          }
          const newpookie = await Pookiebears.findOne({
            where: { pookie_name: starName, rarity: h.starry },
          });
          // console.log(newpookie);
          await buildEmbed(
            message,
            newpookie.file_path,
            pookieFileName,
            userUsername,
            newpookie.pookie_name,
            userID,
            newpookie.summon_count,
            newpookie.id,
            false,
            star,
            yellow,
          );
          return;
        }
        const newCount = currentPookie.summon_count + 1;

        Pookiebears.update(
          { summon_count: newCount },
          { where: { id: currentPookie.id } },
        );

        await buildEmbed(
          message,
          currentPookie.file_path,
          pookieFileName,
          userUsername,
          currentPookie.pookie_name,
          userID,
          currentPookie.summon_count,
          currentPookie.id,
          false,
          star,
          blue,
        );
        return;
      }
    }
  },
};

// https://stackoverflow.com/questions/37614649/how-can-i-download-and-save-a-file-using-the-fetch-api-node-js
