'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class meeting_file extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      meeting_file.belongsTo(models.meeting)
    }
  };
  meeting_file.init({
    name: DataTypes.STRING,
    mimetype: DataTypes.STRING,
    size: DataTypes.INTEGER,
    type: DataTypes.STRING,
    MeetingId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'meeting_file',
  });
  return meeting_file;
};