const utilsTool = require('../utilsTool.js')
const jwt = require('jsonwebtoken')
const db = require('../models') 
const userDB = db.user
const userGroupCTL = require('../controllers/userGroupCTL.js')
const userCTL = require('../controllers/userCTL.js')
const userRoleCTL = require('../controllers/userRoleCTL.js')
const meetingCTL = require('../controllers/meetingCTL.js')
const meetingRoomCTL = require('../controllers/meetingRoomCTL.js')
const meetingMinuteCTL = require('../controllers/meetingMinuteCTL.js')
const operationLogCTL = require('../controllers/operationLogCTL.js')

module.exports = (app) => {
  const authenticated = (req, res, next) => {
    try {
      const token = req.header('Authorization').replace('Bearer ', '')
      jwt.verify(token, 'helloAA', async (err, decoded) => {
        if (err) {
          return res.status(401).json(utilsTool.genResponse('authenticate failed'))
        } else {
          const user = await userDB.findOne({ _id: decoded.id })
          if (!user) return res.status(401).json(utilsTool.genResponse('user not found'))
          req.token = token
          req.user = user
          next()
        }
      })
    } catch(err) {
      console.log(err)
      return res.status(500).json(utilsTool.genResponse(err.detail))
    }
  }
  
  app.post('/auth/signup', userCTL.signUp)
  app.post('/auth/signin', userCTL.signIn)
  app.get('/user/:id', authenticated, userCTL.getUserById)
  app.get('/user', userCTL.getUser)
  app.get('/meeting', meetingCTL.getMeeting)
  app.get('/meeting_room', meetingRoomCTL.getMeetingRoom)
  app.get('/meeting_minute/:id', meetingMinuteCTL.getMeetingMinute)
  app.get('/user_role', userRoleCTL.getUserRole)
  app.get('/user_group', authenticated, userGroupCTL.getUserGroup)
  app.post('/user_group', authenticated, userGroupCTL.addUserGroup)
  app.put('/user_group/:id', authenticated, userGroupCTL.updateUserGroup)
  app.delete('/user_group/:id', authenticated, userGroupCTL.deleteUserGroup)
  app.get('/operation_log', operationLogCTL.getOperationLog)
}
