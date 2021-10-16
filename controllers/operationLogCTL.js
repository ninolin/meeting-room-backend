const utilsTool = require('../utilsTool.js')
const Mock = require('mockjs')
const operationLogController = {
  getOperationLog: async (req, res) => {
    try {
      const data = Mock.mock({
        'items|10': [{
          id: '@id',
          'user': '@name()',
          'item|1': ['meeting', 'meeting_room', 'user', 'setting'],
          'name': '@name()',
          'action|1': ['create', 'update', 'delete'],
          'summary': '@word(5, 10)',
          'create_time': '@datetime'
        }]
      })
      return res.json(utilsTool.genResponseWithData(data.items))
    } catch(err) {
        return res.status(500).json(utilsTool.genResponse(err.detail))
    }
  }
}

module.exports = operationLogController