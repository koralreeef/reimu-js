module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
      "reminders",
      {
        note: {
          type: DataTypes.STRING,
          allowNull: false,
          default: "",
        },
        date: {
          type: DataTypes.INTEGER,
          allowNull: false,
          default: 0,
        },
        channelID: {
            type: DataTypes.STRING,
            allowNull: false,
            default: "",
        },
      },
      {
        timestamps: false,
      },
    );
  };
  