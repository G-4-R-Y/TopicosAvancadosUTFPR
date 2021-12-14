'use strict';
const { Model } = require('sequelize');
const { Prod } = require("./prod");

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Order.init({
    status: {type: DataTypes.STRING, required: true, defaultValue: "Pagamento pendente"},
    userId: {type: DataTypes.INTEGER, allowNull: true}
  }, {
    sequelize,
    modelName: 'Order'
  });
  return Order;
};