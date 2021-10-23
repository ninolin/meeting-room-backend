'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class meeting extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      meeting.belongsTo(models.meeting_room)
      meeting.hasMany(models.meeting_file)
      meeting.belongsToMany(models.user, {
        through: models.meeting_user_relationship,
        foreignKey: 'MeetingId',
        as: 'participant_user'
      })
      meeting.belongsToMany(models.user_group, {
        through: models.meeting_user_relationship,
        foreignKey: 'MeetingId',
        as: 'participant_group'
      })
    }
  };
  meeting.init({
    name: DataTypes.STRING,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
    meeting_minute: DataTypes.TEXT,
    note: DataTypes.TEXT,
    link: DataTypes.TEXT,
    MeetingRoomId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'meeting',
  });
  return meeting;
};