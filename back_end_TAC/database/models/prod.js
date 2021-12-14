'use strict';
//const { Order } = require('./order')

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Prod extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //Prod.hasMany(ProdOrder);
      //ProdOrder.belongsTo(Prod);
    }
  };
  Prod.init({
    name: {type: DataTypes.STRING, required: true},
    price: {type: DataTypes.FLOAT, required: true},
    quantity: {type: DataTypes.INTEGER, required: true},
    description: DataTypes.STRING,
    category: {type: DataTypes.STRING, defaultValue: "Outro"},
    image: {
      type: DataTypes.STRING,
      required: true
    },
    rating: {
      type: DataTypes.INTEGER,
      defaultValue: 0 
    }
  }, {
    sequelize,
    modelName: 'Prod'
  });
  return Prod;
};