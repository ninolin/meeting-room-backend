'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user_role.belongsToMany(models.user, {
        through: models.user_role_relationship,
        foreignKey: 'UserRoleId',
        as: 'user'
      })
    }
  };
  user_role.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    disabled: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'user_role',
  });
  return user_role;
};