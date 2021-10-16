const utilsTool = require('../utilsTool.js')
const Mock = require('mockjs')
const meetingMinuteController = {
  getMeetingMinute: async (req, res) => {
    try {
      const data = Mock.mock({
        id: '@id',
        'name': '@name()',
        'start_date': '@date',
        'start_time': '08:00',
        'end_date': '@date',
        'end_time': '08:15',
        'location': {
          id: '@id',
          name: '@name()'
        },
        'participants': [
          {
            id: 1,
            'name': 'hubert',
            type: 'user'
          },
          {
            id: 1,
            'name': 'PM',
            type: 'group'
          }
        ],
        'note': '線上會議連結/帳號/密碼',
        'link': 'www.kimo.com',
        'exist_files|1-2': [{
          id: '@id',
          name: '@name()'
        }],
        'minute': '會議紀錄',
        'minute_files': [{
          id: '@id',
          name: '@name()'
        }],
        'create_time': '@datetime',
        'last_update_time': '@datetime'
      })
      return res.json(utilsTool.genResponseWithData(data))
    } catch(err) {
        return res.status(500).json(utilsTool.genResponse(err.detail))
    }
  }
}

module.exports = meetingMinuteController