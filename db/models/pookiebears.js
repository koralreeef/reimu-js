module.exports = (sequelize, DataTypes) => {
     return sequelize.define('tags', {
        name: {
            type: DataTypes.STRING,
            defaultValue: "hakurei gooner",
            unique: true,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            defaultValue: "https://shorturl.at/sQ4mY",
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userAvatar: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        usage_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        rarity: {
            type: DataTypes.STRING,
            defaultValue: "common",
            allowNull: false,
        }
    }, {
		timestamps: true,
	});
};