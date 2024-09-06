module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "quests",
    {
      user_id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      pookie_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      due_amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      reward: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      reward_amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      questTier: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    },
  );
};
