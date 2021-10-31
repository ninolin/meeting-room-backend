'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class operation_log extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      operation_log.belongsTo(models.user)
    }
  };
  operation_log.init({
    UserId: DataTypes.INTEGER,
    item: DataTypes.ENUM(['meeting', 'meeting_room', 'user', 'user_role', 'user_group', 'setting']),
    item_id: DataTypes.INTEGER,
    action: DataTypes.ENUM(['create', 'update', 'delete']),
    summary: DataTypes.TEXT,
    raw_data: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'operation_log',
  });
  return operation_log;
};