import { POOKIEVILLE_EXTRA_ROLL_CHANCE } from "../constants/locationConstants.js";
import {
  SNOW_EXTRA_SSR_CHANCE,
  RAIN_EXTRA_ROLL_CHANCE,
} from "../constants/weatherConstants.js";
import { Events, EmbedBuilder, AttachmentBuilder, Message } from "discord.js";
import { pookiewatch } from "../../config.json";
import * as h from "../helper.js";

import {
  findAllPookies,
  Pookiebear,
  updatePookie,
} from "../db/newModels/pookiebears";
import { findUser, User } from "../db/newModels/Users";
import { Op } from "sequelize";

export const rollPookie = async (pookieRarity: number): Promise<Pookiebear> => {
  return await fetchFittingPookie({ rarity: pookieRarity });
};

export const getHurricanePookie = async (
  pookieRarity: number,
): Promise<Pookiebear> => {
  const pookieToGet = h.getHurricanePookie();

  return await fetchFittingPookie({
    pookie_name: {
      [Op.in]: [
        `starry night ${pookieToGet}`,
        `starry night ${pookieToGet} ssr`,
        pookieToGet,
        `${pookieToGet} ssr`,
      ],
    },
    rarity: pookieRarity,
  });
};

export const fetchFittingPookie = async (conditions): Promise<Pookiebear> => {
  const possiblePookies = await findAllPookies({
    where: conditions,
  });

  return possiblePookies[h.getRandomInt(possiblePookies.length)];
};

export const buildEmbed = (
  pookie: Pookiebear,
  summonerName: string,
  summonAttempts: number,
  pookiesToSummon: number,
) => {
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

export const getPookieEmbedMessage = (rarity: number): string => {
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
  async execute(message: Message) {
    if (
      message.content.toLowerCase() !== "pookiebear" ||
      !pookiewatch.includes(message.channel.id)
    )
      return;

    const userID = message.author.id;
    await h.addBalance(userID, 1); // This creates the user if it didn't exist yet. This means the user cannot be undefined later

    const u: User = await findUser({ where: { user_id: userID } });

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

    const pookieRarity =
      h.common + (starryPookie ? h.starry : 0) + (ssrPookie ? h.ssr : 0);

    if (pookieChance < h.getRandomInt(100)) return;

    const pookie = h.getHurricane()
      ? await getHurricanePookie(pookieRarity)
      : await rollPookie(pookieRarity);
    const pookiesToSummon =
      userLocation === "pookie forest" && Math.random() >= 0.5 ? 2 : 1;

    await u.addPookies(pookie, userID, pookiesToSummon, pookie.rarity);

    await updatePookie(
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
