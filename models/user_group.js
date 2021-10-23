'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user_group.belongsToMany(models.user, {
        through: models.user_group_relationship,
        foreignKey: 'UserGroupId',
        as: 'user'
      })
    }
  };
  user_group.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    disabled: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'user_group',
  });
  return user_group;
};