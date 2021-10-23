'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class meeting_user_relationship extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  meeting_user_relationship.init({
    MeetingId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
    UserGroupId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'meeting_user_relationship',
  });
  return meeting_user_relationship;
};