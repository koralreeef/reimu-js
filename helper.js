const { Collection } = require('discord.js');
const { Readable } = require('stream');
const { finished } = require('stream/promises');
const { Users } = require('./db/dbObjects.js')
const path = require("path");
const currency = new Collection();
const fs = require("fs");

//ssr = 100, starry = 200, starry ssr = 300, + is +3 rarity
var commonSR = 60;
var SSR = 90;
let totalPookies = 0;
let rainy = false, snowy = false, starnight = false; 

function addTotalPookies(i){
	totalPookies += i;
}

function getTotalPookies(){
	return totalPookies;
}

function getSnowy(){
	return snowy;
}

function setSnowy(bool){
	snowy = bool;
}

function getRainy(){
	return rainy;
}

function setRainy(bool){
	rainy = bool;
}

function getStarnight(){
	return starnight;
}

function setStarnight(bool){
	starnight = bool;
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

module.exports = { currency, commonSR, SSR, 
				   getLifetime, getRandomInt, 
				   addBalance, wipeBalance, getBalance, 
				   downloadFile, sleep,
				   getSnowy, getRainy, getStarnight,
				   setSnowy, setRainy, setStarnight,
				   addTotalPookies, getTotalPookies };