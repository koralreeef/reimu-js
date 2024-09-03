module.exports = (sequelize, DataTypes) => {
	return sequelize.define('users', {
		user_id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		balance: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		lifetime: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		favoritePookie: {
			type: DataTypes.STRING,
			defaultValue: 0,
			allowNull: false,
		},
		/* unlocks with quests, quests will be rewarding things that are grindy,
			quest 1: craft any triple +++ pookie, reward: location that makes starforce easier
			quest 2: turn in 200 of any pookie, reward: location that makes doubling pookies easier
		location: {
			type: DataTypes.STRING,
			defaultValue: 0,
			allowNull: false,
		},
		*/
	}, {
		timestamps: false,
	});
};

