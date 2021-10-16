const utilsTool = require('../utilsTool.js')
const Mock = require('mockjs')
const meetingController = {
  getMeeting: async (req, res) => {
    try {
        const meetings = Mock.mock({
          'items|10': [{
            id: '@id',
            'name': '@name()',
            'start_date': '@date',
            'start_time': '08:00',
            'end_date': '@date',
            'end_time': '08:15',
            'location|1-24': {
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
            'create_time': '@datetime',
            'last_update_time': '@datetime'
          }]
        })
        return res.json(utilsTool.genResponseWithListData(meetings))
    } catch(err) {
        return res.status(500).json(utilsTool.genResponse(err.detail))
    }
  }
}

module.exports = meetingController