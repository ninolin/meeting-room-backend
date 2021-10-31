const utilsTool = require('../utilsTool.js')
const db = require('../models') 
const userRoleDB = db.user_role
const operationLogDB = db.operation_log

const userRoleController = {
  getUserRole: async (req, res) => {
    try {
        console.log('user', req.user.id)
        const user_roles = await userRoleDB.findAll({raw: true})
        return res.json(utilsTool.genResponseWithListData(user_roles))
    } catch(err) {
        return res.status(500).json(utilsTool.genErrorResponse(err))
    }
  },
  addUserRole: async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {

        const new_user_role = await userRoleDB.create({
          name: req.body.name, 
          description: req.body.description
        }, { transaction })

        await operationLogDB.create({
          UserId: req.user.id, 
          item: 'user_role',
          item_id: new_user_role.id,
          action: 'create',
          summary: `名稱:${req.body.name}\n描述:${req.body.description})`,
          raw_data: {new: req.body}
        }, { transaction })

        await transaction.commit();
        return res.json(utilsTool.genResponse())
    } catch(err) {
        await transaction.rollback();
        return res.status(500).json(utilsTool.genErrorResponse(err))
    }
  },
  updateUserRole: async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
        const user_role = await userRoleDB.findByPk(req.params.id)
        if(!user_role) throw Error ('data not found')

        await userRoleDB.update({
          name: req.body.name, 
          description: req.body.description
        }, 
        {where: {id: req.params.id}}, 
        {transaction})

        let summary = ''
        if(req.body.name !== user_role.name) summary = `${summary}名稱:${user_role.name}->${req.body.name}\n`
        if(req.body.description !== user_role.description) summary = `${summary}描述:${user_role.description}->${req.body.description}\n`
        if(summary === '') summary = '無異動'

        await operationLogDB.create({
          UserId: req.user.id, 
          item: 'user_role',
          item_id: user_role.id,
          action: 'update',
          summary: summary,
          raw_data: {new: req.body, old: user_role}
        }, { transaction })

        await transaction.commit();
        return res.json(utilsTool.genResponse())
    } catch(err) {
        await transaction.rollback();
        return res.status(500).json(utilsTool.genErrorResponse(err))
    }
  },
  deleteUserRole: async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
        const user_role = await userRoleDB.findByPk(req.params.id)
        if(!user_role) throw Error ('data not found')

        await userRoleDB.update({
          disabled: true
        }, {where: {id: req.params.id}}, {transaction})
        
        await operationLogDB.create({
          UserId: req.user.id, 
          item: 'user_role',
          item_id: user_role.id,
          action: 'delete',
          summary: `名稱:${user_role.name}\n描述:${user_role.description}`,
          raw_data: {delete: user_role}
        }, { transaction })
        await transaction.commit();
        return res.json(utilsTool.genResponse())
    } catch(err) {
        await transaction.rollback();
        return res.status(500).json(utilsTool.genErrorResponse(err))
    }
  }
}

module.exports = userRoleController