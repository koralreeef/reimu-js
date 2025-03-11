module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "tumblrPosts",
    {
      postID: {
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
