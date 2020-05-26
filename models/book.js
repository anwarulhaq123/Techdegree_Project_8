"strict mode";
const Sequelize = require("sequelize");

module.exports = (sequelize) => {
  class Book extends Sequelize.Model {}

  Book.init(
    {
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Name is required",
          },
          notEmpty: {
            msg: "Name is required",
          },
        },
      },
      author: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Author is required",
          },
          notEmpty: {
            msg: "Author is required",
          },
        },
      },
      genre: Sequelize.STRING,
      year: Sequelize.INTEGER,
    },
    { sequelize }
  );

  return Book;
};
