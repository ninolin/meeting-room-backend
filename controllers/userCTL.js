const utilsTool = require('../utilsTool.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../models') 
const userDB = db.user
const userGroupDB = db.user_group

const userController = {
  signUp: async (req, res) => {
    try {
      await userDB.create({
        account: req.body.account,
        name: req.body.account,
        phone: req.body.phone,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
      })
      return res.json(utilsTool.genResponse())
    } catch(err) {
      console.log(err)
      return res.status(500).json(utilsTool.genResponse(err.detail))
    }
  },
  signIn: async (req, res) => {
    try {
      const user = await userDB.findOne({
        attributes: {exclude: ['createdAt', 'updatedAt']}, 
        where: {account: req.body.account}
      })
      if (!user) return res.status(401).json(utilsTool.genResponse('user or password error'))
      if (!bcrypt.compareSync(req.body.password, user.password)) {
        return res.status(401).json(utilsTool.genResponse('user or password error'))
      }

      var payload = { 
        id: user.id, 
        account: user.account, 
        name: user.name, 
        email: user.email, 
        phone: user.phone, 
        permission: user.user_permission 
      }
      var token = jwt.sign(payload, 'helloAA')
      return res.json(utilsTool.genResponseWithData({token}))
    } catch(err) {
      console.log(err)
      return res.status(500).json(utilsTool.genResponse(err.detail))
    }
  },
  getUserById: async (req, res) => {
    try {
        const user = await userDB.findByPk(req.params.id,{
          attributes: {exclude: ['createdAt', 'updatedAt']},
          include: [
            { 
              model: userGroupDB, 
              as: 'user_group', 
              attributes:['id','name','description'], 
              through: { attributes: [] } 
            }
          ]
        })
        return res.json(utilsTool.genResponseWithData(user))
    } catch(err) {
        console.log(err)
        return res.status(500).json(utilsTool.genResponse(err.detail))
    }
  }
}

module.exports = userController