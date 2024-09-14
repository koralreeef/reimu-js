const { Collection } = require("discord.js");
const { Readable } = require("stream");
const { finished } = require("stream/promises");
const { Users } = require("./db/dbObjects.js");
const { cornsilk, yellow, gold, blue } = require("color-name");
const path = require("path");
const currency = new Collection();
const fs = require("fs");

const tierMap = new Map([
  [0, "ssr pookies"],
  [1, "starry night pookies"],
  [2, "starry night pookies"],
  [3, "plus pookies"],
  [4, "plus plus pookies"],
]);

const locationMap = new Map([
  [0, "pookieville"],
  [1, "pookie forest"],
  [2, "mt. pookie"],
  [3, "casino zone"],
  [4, "star peak"],
]);

const starryMap = new Map([
  [1, "65FA02"],
  [2, "02FAB4"],
  [3, "0244FA"],
  [4, "AE0AFA"],
  [5, "FC12BA"],
  [6, "FA002A"],
]);

const plusMap = new Map([
  [1, "f08080"],
  [2, "ffe4b5"],
  [3, "66ddaa"],
  [4, "00ffff"],
  [5, "663399"],
  [6, "da70d6"],
]);

const ssrMap = new Map([
  [1, "db07bf"],
  [2, "0dc7d1"],
  [3, "d95e00"],
  [4, "00cf22"],
  [5, "c4040e"],
  [6, "042ec4"],
]);

const starryssrMap = new Map([
  [1, "ffd1ef"],
  [2, "e3d1ff"],
  [3, "cfe4ff"],
  [4, "cafada"],
  [5, "fafaca"],
  [6, "fadac0"],
]);

const HIGHEST_STARRY_SSR_COLOR = "fab1b1";
const HIGHEST_STARRY_COLOR = "c74298";
const HIGHEST_SSR_COLOR = "ff03ee";
const HIGHEST_PLUS_COLOR = "ffffff";

let rainDuration = Math.floor(Date.now() / 1000),
  snowDuration = Math.floor(Date.now() / 1000),
  starnightDuration = Math.floor(Date.now() / 1000);
const common = 0,
  ssr = 100,
  starry = 200,
  starry_ssr = 300; // + is +3 rarity
const commonSR = 60;
const SSR = 90;
let totalPookies = 0;
let hurricanePookie = "";
let rainy = false,
  snowy = false,
  starnight = false,
  hurricane = false;

function setTotalPookies(i) {
  totalPookies = i;
}

function getTotalPookies() {
  return totalPookies;
}

function getSnowy() {
  return snowy;
}

function getSnowDuration() {
  return snowDuration;
}

function setSnowDuration(s) {
  snowDuration = s;
}

function setSnowy(bool) {
  snowy = bool;
}

function getHurricane() {
  return hurricane;
}

function setHurricane(bool) {
  hurricane = bool;
}

function getHurricanePookie() {
  return hurricanePookie;
}

function setHurricanePookie(p) {
  hurricanePookie = p;
}

function getRainy() {
  return rainy;
}

function setRainy(bool) {
  rainy = bool;
}

function getRainDuration() {
  return rainDuration;
}

function setRainDuration(r) {
  rainDuration = r;
}

function getStarnight() {
  return starnight;
}

function setStarnight(bool) {
  starnight = bool;
}

function getStarnightDuration() {
  return starnightDuration;
}

function setStarnightDuration(s) {
  starnightDuration = s;
}

function getLifetime(id) {
  const user = currency.get(id);
  return user ? user.lifetime : 0;
}

async function addBalance(id, amount) {
  const user = currency.get(id);

  if (user) {
    user.balance += Number(amount);
    user.lifetime += Number(amount);
    return user.save();
  }

  const newUser = await Users.create({
    user_id: id,
    balance: amount,
    lifetime: amount,
    favoritePookie: "lappy",
    location: "pookieville",
    questTier: 0,
    questLifetime: 0,
  });
  currency.set(id, newUser);
  return newUser;
}

function getBalance(id) {
  const user = currency.get(id);
  return user ? user.balance : 0;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function wipeBalance(id) {
  const user = currency.get(id);
  user.balance = 0;
  return user.save();
}

const downloadFile = async (url) => {
  const res = await fetch(url);

  const destination = path.resolve("./images", "dummy.jpeg");
  fs.unlink("./images/dummy.jpeg", function (err) {
    if (err && err.code == "ENOENT") {
      // file doens't exist
      console.log("File doesn't exist, won't remove it.");
    } else if (err) {
      // other errors, e.g. maybe we don't have enough permission
      console.error("Error occurred while trying to remove file");
    } else {
      console.log(`removed`);
    }
  });
  if (!fs.existsSync("./images")) fs.mkdirSync("./images"); // make downloads directory if none
  const fileStream = fs.createWriteStream(destination, { flags: "wx" });
  await finished(Readable.fromWeb(res.body).pipe(fileStream));
  return "./images/dummy.jpeg";
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function arrayExists(array) {
  if (Array.isArray(array) && array.length) return true;
  return false;
}

function getEmbedColor(pookie, rarity) {
  if (pookie.indexOf("+") == -1) {
    switch (rarity) {
      case ssr:
        return gold;
      case starry_ssr:
        return cornsilk;
      case starry:
        return yellow;
      default:
        return blue;
    }
  }

  const plusNumber = pookie.length - pookie.indexOf("+");

  switch (rarity) {
    case starry_ssr:
      return starryssrMap.get(plusNumber) ?? HIGHEST_STARRY_SSR_COLOR;
    case starry:
      return starryMap.get(plusNumber) ?? HIGHEST_STARRY_COLOR;
    case ssr:
      return ssrMap.get(plusNumber) ?? HIGHEST_SSR_COLOR;
    default:
      return plusMap.get(plusNumber) ?? HIGHEST_PLUS_COLOR;
  }
}

module.exports = {
  currency,
  commonSR,
  SSR,
  getLifetime,
  getRandomInt,
  addBalance,
  wipeBalance,
  getBalance,
  downloadFile,
  sleep,
  getSnowy,
  getRainy,
  getStarnight,
  getSnowDuration,
  getRainDuration,
  getStarnightDuration,
  setSnowDuration,
  setRainDuration,
  setStarnightDuration,
  setSnowy,
  setRainy,
  setStarnight,
  getTotalPookies,
  setTotalPookies,
  setHurricane,
  getHurricane,
  common,
  ssr,
  starry,
  starry_ssr,
  setHurricanePookie,
  getHurricanePookie,
  arrayExists,
  getEmbedColor,
  locationMap,
  tierMap,
};
