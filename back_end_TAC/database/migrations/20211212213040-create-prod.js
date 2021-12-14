'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Prods', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {type: Sequelize.STRING, required: true},
      price: {type: Sequelize.FLOAT, required: true},
      quantity: {type: Sequelize.INTEGER, required: true},
      description: {type: Sequelize.STRING, defaultValue: ""},
      category: {type: Sequelize.STRING, defaultValue: "Outro"},
      image: {
        type: Sequelize.STRING,
        required: true
      },
      rating: {
        type: Sequelize.INTEGER,
        defaultValue: 0 
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Prods');
  }
};