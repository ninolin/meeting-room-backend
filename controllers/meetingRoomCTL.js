const utilsTool = require('../utilsTool.js')
const db = require('../models') 
const meetingRoomDB = db.meeting_room

const meetingRoomController = {
  getMeetingRoom: async (req, res) => {
    try {
        const meeting_rooms = await meetingRoomDB.findAll({raw: true})
        return res.json(utilsTool.genResponseWithListData(meeting_rooms))
    } catch(err) {
        return res.status(500).json(utilsTool.genResponse(err.detail))
    }
  },
  addMeetingRoom: async (req, res) => {
    try {
        await meetingRoomDB.create({
          name: req.body.name, 
          capacity: req.body.capacity,
          devices: req.body.devices 
        })
        return res.json(utilsTool.genResponse())
    } catch(err) {
        return res.status(500).json(utilsTool.genErrorResponse(err))
    }
  },
  updateMeetingRoom: async (req, res) => {
    try {
        const meeting_room = await meetingRoomDB.findByPk(req.params.id)
        if(!meeting_room) throw Error ('data not found')

        await meetingRoomDB.update({
          name: req.body.name, 
          capacity: req.body.capacity,
          devices: req.body.devices
        }, {where: {id: req.params.id}})

        return res.json(utilsTool.genResponse())
    } catch(err) {
        return res.status(500).json(utilsTool.genErrorResponse(err))
    }
  },
  deleteMeetingRoom: async (req, res) => {
    try {
        const meeting_room = await meetingRoomDB.findByPk(req.params.id)
        if(!meeting_room) throw Error ('data not found')

        await meetingRoomDB.update({
          disabled: true
        }, {where: {id: req.params.id}})

        return res.json(utilsTool.genResponse())
    } catch(err) {
        return res.status(500).json(utilsTool.genErrorResponse(err))
    }
  }
}

module.exports = meetingRoomController