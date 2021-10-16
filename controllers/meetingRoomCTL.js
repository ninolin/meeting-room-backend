const utilsTool = require('../utilsTool.js')
const Mock = require('mockjs')
const meetingRoomController = {
  getMeetingRoom: async (req, res) => {
    try {
        const data = Mock.mock({
          'items|10': [{
            id: '@id',
            'name': '@name()',
            'capacity|1-24': 24,
            'devices|1-2': [
              {
                'name|1': ['投影機', '電視機', '電話'],
                'count|1-2': 1
              }
            ],
            'create_time': '@datetime',
            'last_update_time': '@datetime'
          }]
        })
        return res.json(utilsTool.genResponseWithListData(data.items))
    } catch(err) {
        return res.status(500).json(utilsTool.genResponse(err.detail))
    }
  }
}

module.exports = meetingRoomController