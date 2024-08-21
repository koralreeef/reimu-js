module.exports = (sequelize, DataTypes) => {
	return sequelize.define('osuUsers', {
		user_id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
        username: {
            type: DataTypes.STRING,
        }
	}, {
		timestamps: false,
	});
};