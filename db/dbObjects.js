const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Users = require('./models/Users.js')(sequelize, Sequelize.DataTypes);
const UserPookies = require('./models/UserPookies.js')(sequelize, Sequelize.DataTypes);
const Pookiebears = require('./models/pookiebears.js')(sequelize, Sequelize.DataTypes);
const osuUsers = require('./models/osuUsers.js')(sequelize, Sequelize.DataTypes);

Pookiebears.hasMany(UserPookies, {foreignKey: 'pookie_id'});
UserPookies.belongsTo(Pookiebears, {foreignKey: 'pookie_id', as: 'pookie'});

Reflect.defineProperty(Users.prototype, 'addPookies', {
	value: async (pookie, userID, amount) => {
		const userPookie = await UserPookies.findOne({
			where: { user_id: userID, pookie_id: pookie.id },
		});

		if (userPookie) {
			userPookie.amount += amount;
			return userPookie.save();
		}

		return UserPookies.create({ user_id: userID, pookie_id: pookie.id, amount: amount });
	},
});

Reflect.defineProperty(Users.prototype, 'destroyPookies', {
	value: async (pookie, userID) => {
		const userPookie = await UserPookies.findOne({
			where: { user_id: userID, pookie_id: pookie.id },
		});

		if (userPookie) {
			console.log(pookie.pookie_name+" destroyed.");
			return userPookie.destroy();
		}
		return;
	},
});

Reflect.defineProperty(Users.prototype, 'getPookies', {
	value: async (userID) => {			
		return UserPookies.findAll({
			where: { user_id: userID },
			order: [
				['amount', 'DESC'],
			],	
			include: ['pookie'],
		});
	},
});

Reflect.defineProperty(Users.prototype, 'checkAmount', {
	value: async (pookie, userID, amount) => {			
		const userPookie = await UserPookies.findOne({
			where: { user_id: userID, pookie_id: pookie.id },
		});

		if (userPookie) {
			userPookie.amount += amount;
			if(userPookie.amount == 0) {
				return true;
			} else {
			return false;
			}
		} 

		return false;
	},
});


Reflect.defineProperty(Users.prototype, 'checkPookies', {
	value: async (pookie, userID, amount) => {			
		const userPookie = await UserPookies.findOne({
			where: { user_id: userID, pookie_id: pookie.id },
		});

		if (userPookie) {
			userPookie.amount += amount;
			console.log(userPookie.amount);
			if(userPookie.amount <= -1) {
				return false;
			} else {
			return true;
			}
		} 

		return false;
	},
});

module.exports = { Users, UserPookies, Pookiebears, osuUsers };