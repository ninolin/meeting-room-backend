const utilsTool = require('../utilsTool.js')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const jwt = require('jsonwebtoken')
const db = require('../models') 
const userDB = db.user
const userGroupCTL = require('../controllers/userGroupCTL.js')
const userCTL = require('../controllers/userCTL.js')
const userRoleCTL = require('../controllers/userRoleCTL.js')
const meetingCTL = require('../controllers/meetingCTL.js')
const meetingRoomCTL = require('../controllers/meetingRoomCTL.js')
const operationLogCTL = require('../controllers/operationLogCTL.js')

module.exports = (app) => {
  const authenticated = (req, res, next) => {
    try {
      const header_token = req.header('Authorization')
      if(!header_token) throw Error ('permission denied')

      const token = req.header('Authorization').replace('Bearer ', '')
      jwt.verify(token, 'helloAA', async (err, decoded) => {
        if (err) throw Error ('permission denied')
        const user = await userDB.findOne({ _id: decoded.id })
        if (!user) throw Error ('user not found')
        req.token = token
        req.user = user
        next()
      })
    } catch(err) {
      console.log(err)
      return res.status(500).json(utilsTool.genErrorResponse(err))
    }
  }
  
  app.post('/auth/signup', userCTL.signUp)
  app.post('/auth/signin', userCTL.signIn)
  app.get('/user/:id', authenticated, userCTL.getUserById)
  app.get('/user', authenticated, userCTL.getUser)
  app.put('/user/profile/:id', authenticated, userCTL.updateUserProfile)
  app.put('/user/password/:id', authenticated, userCTL.updateUserPassword)
  app.put('/user/:id', authenticated, userCTL.updateUser)
  app.delete('/user/:id', authenticated, userCTL.deleteUser)
  app.get('/user_role', authenticated, userRoleCTL.getUserRole)
  app.post('/user_role', authenticated, userRoleCTL.addUserRole)
  app.put('/user_role/:id', authenticated, userRoleCTL.updateUserRole)
  app.delete('/user_role/:id', authenticated, userRoleCTL.deleteUserRole)
  app.get('/user_group', authenticated, userGroupCTL.getUserGroup)
  app.post('/user_group', authenticated, userGroupCTL.addUserGroup)
  app.put('/user_group/:id', authenticated, userGroupCTL.updateUserGroup)
  app.delete('/user_group/:id', authenticated, userGroupCTL.deleteUserGroup)

  app.get('/meeting_room', authenticated, meetingRoomCTL.getMeetingRoom)
  app.post('/meeting_room', authenticated, meetingRoomCTL.addMeetingRoom)
  app.put('/meeting_room/:id', authenticated, meetingRoomCTL.updateMeetingRoom)
  app.delete('/meeting_room/:id', authenticated, meetingRoomCTL.deleteMeetingRoom)
  app.get('/meeting', authenticated, meetingCTL.getMeeting)
  app.post('/meeting', authenticated, upload.array('file', 10), meetingCTL.addMeeting)
  app.put('/meeting/:id', authenticated, upload.array('file', 10), meetingCTL.updateMeeting)
  app.delete('/meeting/:id', authenticated, meetingCTL.deleteMeeting)
  app.put('/meeting/minute/:id', authenticated, meetingCTL.updateMeetingMinute)
  app.post('/meeting/minute/file/:id', authenticated, upload.single('file'), meetingCTL.addMeetingMinuteFile)

  app.get('/operation_log', authenticated, operationLogCTL.getOperationLog)
}
