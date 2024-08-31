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
	}, {
		timestamps: false,
	});
};

