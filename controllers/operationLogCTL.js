const utilsTool = require('../utilsTool.js')
const db = require('../models') 
const operationLogDB = db.operation_log
const userDB = db.user
const operationLogController = {
  getOperationLog: async (req, res) => {
    try {
      const operationLog = await operationLogDB.findAll({
        attributes: {exclude: ['UserId', 'userId']},
        include: [
          { 
            model: userDB, 
            attributes: {exclude: ['password']}
          }
        ]
      })
      if(!operationLog) throw Error ('data not found')
      return res.json(utilsTool.genResponseWithListData(operationLog))
    } catch(err) {
        return res.status(500).json(utilsTool.genResponse(err.detail))
    }
  }
}

module.exports = operationLogController