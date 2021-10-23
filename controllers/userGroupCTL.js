const utilsTool = require('../utilsTool.js')
const db = require('../models') 
const userGroupDB = db.user_group

const usesrGroupController = {
  getUserGroup: async (req, res) => {
    try {
        const user_groups = await userGroupDB.findAll({raw: true})
        return res.json(utilsTool.genResponseWithListData(user_groups))
    } catch(err) {
        return res.status(500).json(utilsTool.genErrorResponse(err))
    }
  },
  addUserGroup: async (req, res) => {
    try {
        await userGroupDB.create({name: req.body.name, description: req.body.description})
        return res.json(utilsTool.genResponse())
    } catch(err) {
        return res.status(500).json(utilsTool.genErrorResponse(err))
    }
  },
  updateUserGroup: async (req, res) => {
    try {
        const user_group = await userGroupDB.findByPk(req.params.id)
        if(!user_group) throw Error ('data not found')

        await userGroupDB.update({name: req.body.name, description: req.body.description}, {where: {id: req.params.id}})
        return res.json(utilsTool.genResponse())
    } catch(err) {
        return res.status(500).json(utilsTool.genErrorResponse(err))
    }
  },
  deleteUserGroup: async (req, res) => {
    try {
        const user_group = await userGroupDB.findByPk(req.params.id)
        if(!user_group) throw Error ('data not found')

        await userGroupDB.update({
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

module.exports = usesrGroupController