module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "users",
    {
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
      /* unlocks with quests, quests will be rewarding things that are grindy, (implement special quests tomorrow)
			quest 1: craft any triple +++ pookie, reward: location that makes starforce easier
			quest 2: turn in 100 of any pookie, reward: location that might double the pookie pull (25%)
			quest 3: turn in 50 of any starry night pookie, reward: location that makes starry night pookies avaliable 24/7 (at a low chance)
			quest 4: turn in 200 of any pookie, reward: location that makes doubling pookies easier
		*/
      location: {
        type: DataTypes.STRING,
        defaultValue: 0,
        allowNull: false,
      },
      questTier: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      questLifetime: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    },
  );
};
