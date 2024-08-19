const { Collection } = require('discord.js');
const currency = new Collection();

var commonSR = 60;
var SSR = 90;

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

	const newUser = await Users.create({ user_id: id, balance: amount, lifetime: amount });
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

module.exports = { currency, commonSR, SSR, getLifetime, getRandomInt, addBalance, wipeBalance, getBalance  };