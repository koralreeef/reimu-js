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

Reflect.defineProperty(Users.prototype, 'addPookie', {
	value: async (pookie, userID) => {
		const userPookie = await UserPookies.findOne({
			where: { user_id: userID, pookie_id: pookie.id },
		});

		if (userPookie) {
			userPookie.amount += 1;
			return userPookie.save();
		}

		return UserPookies.create({ user_id: userID, pookie_id: pookie.id, amount: 1 });
	},
});

Reflect.defineProperty(Users.prototype, 'getPookies', {
	value: async (userID) => {			
		return UserPookies.findAll({
			where: { user_id: userID },
			include: ['pookie'],
		});
	},
});

module.exports = { Users, UserPookies, Pookiebears, osuUsers };