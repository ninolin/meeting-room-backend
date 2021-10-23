'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_role_relationship extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  user_role_relationship.init({
    UserId: DataTypes.INTEGER,
    UserRoleId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'user_role_relationship',
  });
  return user_role_relationship;
};