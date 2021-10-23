'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class meeting_room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      meeting_room.hasMany(models.meeting)
    }
  };
  meeting_room.init({
    name: DataTypes.STRING,
    capacity: DataTypes.INTEGER,
    devices: DataTypes.JSON,
    disabled: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'meeting_room',
  });
  return meeting_room;
};