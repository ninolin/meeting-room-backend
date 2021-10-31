'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('operation_logs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      UserId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      item: {
        allowNull: false,
        type: Sequelize.ENUM('meeting', 'meeting_room', 'user', 'user_group', 'user_role', 'setting')
      },
      item_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      action: {
        allowNull: false,
        type: Sequelize.ENUM('create', 'update', 'delete')
      },
      summary: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      raw_data: {
        allowNull: false,
        type: Sequelize.JSON
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('operation_logs');
  }
};