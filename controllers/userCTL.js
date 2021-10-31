const utilsTool = require('../utilsTool.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../models')
const userDB = db.user
const userGroupDB = db.user_group
const userRoleDB = db.user_role
const userGroupRelationshipDB = db.user_group_relationship
const userRoleRelationshipDB = db.user_role_relationship

const userController = {
  signUp: async (req, res) => {
    try {
      await userDB.create({
        account: req.body.account,
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
      })
      return res.json(utilsTool.genResponse())
    } catch(err) {
      return res.status(500).json(utilsTool.genErrorResponse(err))
    }
  },
  signIn: async (req, res) => {
    try {
      const user = await userDB.findOne({
        attributes: {exclude: ['createdAt', 'updatedAt']}, 
        where: {account: req.body.account}
      })
      if (!user) throw Error ('user or password error')
      if (!bcrypt.compareSync(req.body.password, user.password)) throw Error ('user or password error')

      var payload = { 
        id: user.id, 
        account: user.account, 
        name: user.name, 
        email: user.email, 
        phone: user.phone, 
        permission: user.permission
      }
      var token = jwt.sign(payload, 'helloAA')
      return res.json(utilsTool.genResponseWithData({token}))
    } catch(err) {
      return res.status(500).json(utilsTool.genErrorResponse(err))
    }
  },
  getUserById: async (req, res) => {
    try {
        const user = await userDB.findByPk(req.params.id,{
          attributes: {exclude: ['password', 'createdAt', 'updatedAt']},
          include: [
            { 
              model: userGroupDB, 
              as: 'user_group', 
              attributes:['id','name','description'], 
              through: { attributes: [] } 
            },
            { 
              model: userRoleDB, 
              as: 'user_role', 
              attributes:['id','name','description'], 
              through: { attributes: [] } 
            }
          ]
        })
        if(!user) throw Error ('data not found')
        return res.json(utilsTool.genResponseWithData(user))
    } catch(err) {
        return res.status(500).json(utilsTool.genErrorResponse(err))
    }
  },
  getUser: async (req, res) => {
    try {
        const user = await userDB.findAll({raw: true, attributes: {exclude: ['password', 'createdAt', 'updatedAt']}})
        return res.json(utilsTool.genResponseWithListData(user))
    } catch(err) {
        return res.status(500).json(utilsTool.genErrorResponse(err))
    }
  },
  updateUser: async (req, res) => {
    const transaction = await db.sequelize.transaction();  
    try {
        const user = await userDB.findByPk(req.params.id)
        if(!user) throw Error ('data not found')
        
        const ug = await userGroupDB.findAll({ where: { id: req.body.user_group } })
        if(ug.length !== req.body.user_group.length) throw Error ('user group not found')

        const ur = await userRoleDB.findAll({ where: { id: req.body.user_role } })
        if(ur.length !== req.body.user_role.length) throw Error ('user role not found')

        await userDB.update({
          name: req.body.name, 
          email: req.body.email, 
          phone: req.body.phone
        }, 
        { where: {id: req.params.id} },
        { transaction })
        
        // reset user group
        await userGroupRelationshipDB.destroy({
          where: { UserId: req.params.id }
        }, { transaction });
        const userGroupRelationship = req.body.user_group.map(item => {
          return {'UserId': req.params.id, 'UserGroupId': item}
        })
        if(userGroupRelationship.length > 0) {
          await userGroupRelationshipDB.bulkCreate(userGroupRelationship, { transaction });
        }
        
        // reset user role
        await userRoleRelationshipDB.destroy({
          where: { UserId: req.params.id }
        }, { transaction });
        const userRoleRelationship = req.body.user_role.map(item => {
          return {'UserId': req.params.id, 'UserRoleId': item}
        })
        if(userRoleRelationship.length > 0) {
          await userRoleRelationshipDB.bulkCreate(userRoleRelationship, { transaction });
        }

        await transaction.commit();
        return res.json(utilsTool.genResponse())
    } catch(err) {
        await transaction.rollback();
        return res.status(500).json(utilsTool.genErrorResponse(err))
    }
  },
  updateUserProfile: async (req, res) => {
    try {
        const user = await userDB.findByPk(req.params.id)
        if(!user) throw Error ('data not found')

        await userDB.update({
          name: req.body.name, 
          email: req.body.email, 
          phone: req.body.phone
        }, { 
          where: {id: req.params.id} 
        })
        return res.json(utilsTool.genResponse())
    } catch(err) {
        return res.status(500).json(utilsTool.genErrorResponse(err))
    }
  },
  updateUserPassword: async (req, res) => {
    try {
        const user = await userDB.findByPk(req.params.id)
        if(!user) throw Error ('data not found')

        if (!bcrypt.compareSync(req.body.old_password, user.password)) throw Error ('old password error')

        await userDB.update({
          password: bcrypt.hashSync(req.body.new_password, bcrypt.genSaltSync(10), null)
        }, { 
          where: {id: req.params.id} 
        })
        return res.json(utilsTool.genResponse())
    } catch(err) {
        return res.status(500).json(utilsTool.genErrorResponse(err))
    }
  },
  deleteUser: async (req, res) => {
    try {
        const user = await userDB.findByPk(req.params.id)
        if(!user) throw Error ('data not found')

        await userDB.update({
          disabled: true
        }, { 
          where: {id: req.params.id} 
        })
        return res.json(utilsTool.genResponse())
    } catch(err) {
        return res.status(500).json(utilsTool.genErrorResponse(err))
    }
  }
}

module.exports = userController