'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user.belongsToMany(models.user_group, {
        through: models.user_group_relationship,
        foreignKey: 'UserId',
        as: 'user_group'
      })
    }
  };
  user.init({
    account: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    permission: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};