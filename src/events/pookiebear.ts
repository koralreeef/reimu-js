import {
  POOKIEVILLE_EXTRA_ROLL_CHANCE,
} from "../constants/locationConstants.js";
import {
  SNOW_EXTRA_SSR_CHANCE,
  RAIN_EXTRA_ROLL_CHANCE,
} from "../constants/weatherConstants.js";
import { Events, EmbedBuilder, AttachmentBuilder } from "discord.js";
import { Users, Pookiebears } from "../db/dbObjects.js";
import { pookiewatch } from "../../config.json";
import * as h from "../helper.js";

const rollPookie = async (starry: boolean, ssr: boolean): Promise<any> => {
  const starryMultiplier = starry ? h.starry : 0;
  const ssrMultiplier = ssr ? h.ssr : 0;

  const rarity = starryMultiplier + ssrMultiplier;

  return await fetchFittingPookie({ rarity: rarity });
};

const getHurricanePookie = async () => {
  const pookieToGet = h.getHurricanePookie();
  return await fetchFittingPookie({ pookie_name: pookieToGet });
};

const fetchFittingPookie = async (conditions) => {
  console.log("a");
  const possiblePookies = await Pookiebears.findAll({
    where: conditions,
  });

  return possiblePookies[h.getRandomInt(possiblePookies.length)];
};

const buildEmbed = (pookie, summonerName, summonAttempts, pookiesToSummon) => {
  const extraPookiesAddendum = ` *${pookiesToSummon} ! \n **L U C K Y !**`;
  const title = `${pookie.pookie_name}${pookiesToSummon > 1 ? extraPookiesAddendum : ""}`;
  const footer = `${getPookieEmbedMessage(pookie.rarity)}Total summon count: ${pookie.summon_count}`;
  const pookieImage = pookie.file_path.substring(9);

  const attachment = new AttachmentBuilder(pookie.file_path);

  const embed = new EmbedBuilder()
    .setAuthor({
      name:
        "summoned by: " + summonerName + "\nattempt count: " + summonAttempts,
    })
    .setTitle(title)
    .setImage("attachment://" + pookieImage)
    .setColor(h.getEmbedColor(pookie.pookie_name, pookie.rarity))
    .setFooter({ text: footer, iconURL: "attachment://" + pookieImage });

  return { embeds: [embed], files: [attachment] };
};

const getPookieEmbedMessage = (rarity) => {
  switch (rarity) {
    case h.ssr:
      return `Holy shit! An SSR pookiebear!\n`;
    case h.starry:
      return `A pookiebear found on a starry night\n`;
    case h.starry_ssr:
      return `OH MY STARS!! A starry night makes anything possible!\n`;
    default:
      return `What a lovely pookiebear!\n`;
  }
};

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    console.log("hey");
    if (
      message.content.toLowerCase() !== "pookiebear" ||
      !pookiewatch.includes(message.channel.id)
    )
      return;

    const userID = message.author.id;
    h.addBalance(userID, 1); // This creates the user if it didn't exist yet. This means the user cannot be undefined later

    const u = await Users.findOne({ where: { user_id: userID } });

    const userLocation = u?.location;

    const snowMultiplier = h.getSnowy() ? SNOW_EXTRA_SSR_CHANCE : 0;
    const rainMultiplier = h.getRainy() ? RAIN_EXTRA_ROLL_CHANCE : 0;
    const pookieVilleMultiplier =
      userLocation === "pookieville" ? POOKIEVILLE_EXTRA_ROLL_CHANCE : 0;

    const pookieChance = h.commonSR + rainMultiplier + pookieVilleMultiplier;
    const starryPookie =
      h.getStarnight() ||
      (userLocation === "star peak" && Math.random() >= 0.7);
    const ssrPookie = h.SSR + snowMultiplier > h.getRandomInt(1000);

    if (pookieChance < h.getRandomInt(100)) return;

    const pookie = h.getHurricane()
      ? await getHurricanePookie()
      : await rollPookie(starryPookie, ssrPookie);
    const pookiesToSummon =
      userLocation === "pookie forest" && Math.random() >= 0.5 ? 2 : 1;

    u.addPookies(pookie, userID, pookiesToSummon, pookie.rarity);

    Pookiebears.update(
      { summon_count: pookie.summon_count + pookiesToSummon },
      { where: { id: pookie.id } },
    );
    pookie.summon_count += pookiesToSummon;

    const messagePayload = buildEmbed(
      pookie,
      message.author.username,
      h.getBalance(userID),
      pookiesToSummon,
    );
    h.wipeBalance(userID);

    await message.channel.send({
      embeds: messagePayload.embeds,
      files: messagePayload.files,
    });
  },
  rollPookie: rollPookie,
  getHurricanePookie: getHurricanePookie,
  fetchFittingPookie: fetchFittingPookie,
  buildEmbed: buildEmbed,
  getPookieEmbedMessage: getPookieEmbedMessage,
};

// https://stackoverflow.com/questions/37614649/how-can-i-download-and-save-a-file-using-the-fetch-api-node-js
