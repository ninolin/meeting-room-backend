const utilsTool = require('../utilsTool.js')
const db = require('../models') 
const userRoleDB = db.user_role

const userRoleController = {
  getUserRole: async (req, res) => {
    try {
        const user_roles = await userRoleDB.findAll({raw: true})
        return res.json(utilsTool.genResponseWithListData(user_roles))
    } catch(err) {
        return res.status(500).json(utilsTool.genErrorResponse(err))
    }
  },
  addUserRole: async (req, res) => {
    try {
        await userRoleDB.create({name: req.body.name, description: req.body.description})
        return res.json(utilsTool.genResponse())
    } catch(err) {
        return res.status(500).json(utilsTool.genErrorResponse(err))
    }
  },
  updateUserRole: async (req, res) => {
    try {
        const user_role = await userRoleDB.findByPk(req.params.id)
        if(!user_role) throw Error ('data not found')

        await userRoleDB.update({name: req.body.name, description: req.body.description}, {where: {id: req.params.id}})
        return res.json(utilsTool.genResponse())
    } catch(err) {
        return res.status(500).json(utilsTool.genErrorResponse(err))
    }
  },
  deleteUserRole: async (req, res) => {
    try {
        const user_role = await userRoleDB.findByPk(req.params.id)
        if(!user_role) throw Error ('data not found')

        await userRoleDB.update({
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

module.exports = userRoleController