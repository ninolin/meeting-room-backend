const utilsTool = require('../utilsTool.js')
const db = require('../models') 
const userGroupDB = db.user_group

const usesrGroupController = {
  getUserGroup: async (req, res) => {
    try {
        const user_groups = await userGroupDB.findAll({raw: true})
        return res.json(utilsTool.genResponseWithListData(user_groups))
    } catch(err) {
        return res.status(500).json(utilsTool.genResponse(err.detail))
    }
  },
  addUserGroup: async (req, res) => {
    try {
        await userGroupDB.create({name: req.body.name, description: req.body.description})
        return res.json(utilsTool.genResponse())
    } catch(err) {
        return res.status(500).json(utilsTool.genResponse(err.detail))
    }
  },
  updateUserGroup: async (req, res) => {
    try {
        const user_group = await userGroupDB.findByPk(req.params.id)
        if(!user_group) return res.status(500).json(utilsTool.genResponse('data not foud'))

        await userGroupDB.update({name: req.body.name, description: req.body.description}, {where: {id: req.params.id}})
        return res.json(utilsTool.genResponse())
    } catch(err) {
        return res.status(500).json(utilsTool.genResponse(err.detail))
    }
  },
  deleteUserGroup: async (req, res) => {
    try {
        const user_group = await userGroupDB.findByPk(req.params.id)
        if(!user_group) return res.status(500).json(utilsTool.genResponse('data not foud'))
        user_group.destroy()
        return res.json(utilsTool.genResponse())
    } catch(err) {
        return res.status(500).json(utilsTool.genResponse(err.detail))
    }
  }
}

module.exports = usesrGroupController