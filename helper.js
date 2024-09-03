const { Collection } = require('discord.js');
const { Readable } = require('stream');
const { finished } = require('stream/promises');
const { Users } = require('./db/dbObjects.js')
const { cornsilk, yellow, gold, lightcoral, moccasin, mediumaquamarine, aqua, rebeccapurple, orchid, white, blue } = require('color-name');
const path = require("path");
const currency = new Collection();
const fs = require("fs");

const starryMap = new Map([
	[0, '65FA02'],
	[1, '02FAB4'],
	[2, '0244FA'],
	[3, 'AE0AFA'],
	[4, 'FC12BA'],
	[5, 'FA002A'],
]);

const plusMap = new Map([
	[0, lightcoral],
	[1, moccasin],
	[2, mediumaquamarine],
	[3, aqua],
	[4, rebeccapurple],
	[5, orchid],
]);
//somethin
const starryplusMap = new Map([
	[0, lightcoral],
	[1, moccasin],
	[2, mediumaquamarine],
	[3, aqua],
	[4, rebeccapurple],
	[5, orchid],
]);
//somehttin
const starryssrplusMap = new Map([
	[0, lightcoral],
	[1, moccasin],
	[2, mediumaquamarine],
	[3, aqua],
	[4, rebeccapurple],
	[5, orchid],
]);

const regex = /[+]/g;
let rainDuration = Math.floor(Date.now()/1000), snowDuration = Math.floor(Date.now()/1000), 
    starnightDuration = Math.floor(Date.now()/1000);
let common = 0, ssr = 100, starry = 200, starry_ssr = 300; //+ is +3 rarity
var commonSR = 60;
var SSR = 90;
let totalPookies = 0;
let weatherClear = false;
let hurricanePookie = "";
let rainy = false, snowy = false, starnight = false, hurricane = false; 

function setTotalPookies(i){
	totalPookies = i;
}

function getTotalPookies(){
	return totalPookies;
}

function getSnowy(){
	return snowy;
}

function getSnowDuration(){
	return snowDuration;
}

function setSnowDuration(s){
	snowDuration = s;
}

function setSnowy(bool){
	snowy = bool;
}

function getHurricane(){
	return hurricane;
}

function setWeatherClear(bool){
	weatherClear = bool;
}

function getWeatherClear(bool){
	weatherClear = bool;
}

function setHurricane(bool){
	hurricane = bool;
}

function getHurricanePookie(){
	return hurricanePookie;
}

function setHurricanePookie(p){
	hurricanePookie = p;
}

function getRainy(){
	return rainy;
}

function setRainy(bool){
	rainy = bool;
}

function getRainDuration(){
	return rainDuration;
}

function setRainDuration(r){
	rainDuration = r;
}

function getStarnight(){
	return starnight;
}

function setStarnight(bool){
	starnight = bool;
}

function getStarnightDuration(){
	return starnightDuration;
}

function setStarnightDuration(s){
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

	const newUser = await Users.create({ user_id: id, balance: amount, lifetime: amount, favoritePookie: "lappy" });
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
	return user.save()
}   

const downloadFile = (async (url, fileName) => {
    const res = await fetch(url);

    const destination = path.resolve("./images", fileName);
    if (!fs.existsSync("./images")) fs.mkdirSync("./images"); //make downloads directory if none
    const fileStream = fs.createWriteStream(destination, { flags: 'wx' });
    await finished(Readable.fromWeb(res.body).pipe(fileStream));
    }
);

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function arrayExists(array) {
	if(Array.isArray(array) && array.length)
		return true;
	return false;
}

function getEmbedColor(p, r) {
	let embedColor = blue;
	let colorIndex = -1;
	console.log("1 "+embedColor);
	//check for +
	//three different color rotations for starry night and ssr
	if(Array.isArray(p.match(regex)) && (p.match(regex)).length)
	colorIndex = p.match(regex).length - 1;
	if(r == ssr) embedColor = gold; 
	if(r == starry_ssr) embedColor = cornsilk;
	if(r == starry) embedColor = yellow; 
	//test
	if(p.substring(0, 12) == "starry night" && colorIndex != -1){ //starry only ++
		console.log(colorIndex);
		embedColor = starryMap.get(colorIndex);
		if(colorIndex >= starryMap.size - 1)
		{
			embedColor = '0xED61BC';
			console.log("2 "+embedColor);
			return embedColor;
		}
		console.log("3 "+embedColor);
		return embedColor;
	} else if (colorIndex != -1){ // ++ only
		console.log(colorIndex);
		embedColor = plusMap.get(colorIndex);
		if(colorIndex >= plusMap.size - 1)
		{
			embedColor = white;
			console.log("2 "+embedColor);
			return embedColor;
		}
		console.log("3 "+embedColor);
		return embedColor;
	}

	return embedColor;
}
module.exports = { currency, commonSR, SSR, 
				   getLifetime, getRandomInt, 
				   addBalance, wipeBalance, getBalance, 
				   downloadFile, sleep,
				   getSnowy, getRainy, getStarnight,
				   getSnowDuration, getRainDuration, getStarnightDuration,
				   setSnowDuration, setRainDuration, setStarnightDuration,
				   setSnowy, setRainy, setStarnight,
				   getTotalPookies, setTotalPookies,
				   setHurricane, getHurricane,
				   common, ssr, starry, starry_ssr,
				   setHurricanePookie, getHurricanePookie,
				   arrayExists, getEmbedColor,
				   setWeatherClear, getWeatherClear };