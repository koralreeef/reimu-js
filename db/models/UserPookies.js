module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "user_pookie",
    {
      user_id: {
        type: DataTypes.STRING,
        allowNull: false,
        default: "",
      },
      pookie_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        default: 0,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        default: 0,
      },
      rarity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        default: 0,
      },
    },
    {
      timestamps: false,
    },
  );
};
