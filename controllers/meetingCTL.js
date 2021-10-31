const fs = require('fs')
const { Op } = require("sequelize");
const utilsTool = require('../utilsTool.js')
const db = require('../models') 
const meetingDB = db.meeting
const userDB = db.user
const userGroupDB = db.user_group
const meetingRoomDB = db.meeting_room
const meetingUserRelationshipDB = db.meeting_user_relationship
const meetingFileDB = db.meeting_file

const meetingController = {
  getMeeting: async (req, res) => {
    try {
        const meeting = await meetingDB.findAll({
          attributes: {exclude: ['MeetingRoomId', 'meetingRoomId']},
          include: [
            meetingRoomDB,
            { 
              model: meetingFileDB, 
              attributes: {exclude: ['MeetingId', 'meetingId']}
            },
            { 
              model: userDB, 
              as: 'participant_user',
              attributes:['id','account','name','email','phone'], 
              through: { attributes: [] } 
            },
            { 
              model: userGroupDB, 
              as: 'participant_group',
              attributes:['id','name'], 
              through: { attributes: [] } 
            }
          ]
        })
        if(!meeting) throw Error ('data not found')
        return res.json(utilsTool.genResponseWithListData(meeting))
    } catch(err) {
        return res.status(500).json(utilsTool.genErrorResponse(err))
    }
  },
  addMeeting: async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
        const new_meeting = await meetingDB.create({
          name: req.body.name, 
          start_date: req.body.start_date,
          end_date: req.body.end_date,
          MeetingRoomId: req.body.meeting_room,
          note: req.body.note,
          link: req.body.link,
        }, { transaction })

        if(req.body.participants) {
          const meetingUserRelationship = req.body.participants.split(',').map(item => {
            if(item.split('.')[1] === 'group') {
              return {'MeetingId': new_meeting.id, 'UserGroupId': item.split('.')[0]}
            } else {
              return {'MeetingId': new_meeting.id, 'UserId': item.split('.')[0]}
            }
          })
          if(meetingUserRelationship.length > 0) {
            await meetingUserRelationshipDB.bulkCreate(meetingUserRelationship, { transaction });
          }
        }

        // TODO: 技術債:讀檔&寫檔要改成非同步，讓寫入meeting_file table加上traction
        const { files } = req
        if (files) {
          for (const file of files) {
            fs.readFile(file.path, async (err, data) => {
              if (err) console.log('Error: ', err)
              fs.writeFile(`upload/${file.originalname}`, data, async () => {
                meetingFileDB.create({
                  name: file.originalname, 
                  mimetype: file.mimetype,
                  size: file.size,
                  type: 'meeting',
                  MeetingId: new_meeting.id
                });
              })
            })
          }
        }
        await transaction.commit();
        return res.json(utilsTool.genResponse())
    } catch(err) {
        await transaction.rollback();
        return res.status(500).json(utilsTool.genErrorResponse(err))
    }
  },
  updateMeeting: async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
        await meetingDB.update({
          name: req.body.name, 
          start_date: req.body.start_date,
          end_date: req.body.end_date,
          MeetingRoomId: req.body.meeting_room,
          note: req.body.note,
          link: req.body.link,
        }, 
        { where: {id: req.params.id} },
        { transaction })
        
        if(req.body.participants) {
          await meetingUserRelationshipDB.destroy({
            where: { MeetingId: req.params.id }
          }, { transaction });

          const meetingUserRelationship = req.body.participants.split(',').map(item => {
            if(item.split('.')[1] === 'group') {
              return {'MeetingId': req.params.id, 'UserGroupId': item.split('.')[0]}
            } else {
              return {'MeetingId': req.params.id, 'UserId': item.split('.')[0]}
            }
          })
          if(meetingUserRelationship.length > 0) {
            await meetingUserRelationshipDB.bulkCreate(meetingUserRelationship, { transaction });
          }
        }

        if(req.body.meeting_files) {
          const delete_files = await meetingFileDB.findAll({
            where: { 
              MeetingId: req.params.id, 
              type: 'meeting', 
              id: {
                [Op.notIn]: req.body.meeting_files.split(",")
              }
            }
          })
          console.log('delete_files', delete_files)
          delete_files.forEach(async (file) => {
            await meetingFileDB.destroy({
              where: { 
                MeetingId: req.params.id, 
                type: 'meeting', 
                id: file.id
              }
            });
          })
        }

        // TODO: 技術債:讀檔&寫檔要改成非同步，讓寫入meeting_file table加上traction
        const { files } = req
        if (files) {
          files.forEach(file => {
            fs.readFile(file.path, (err, data) => {
              if (err) console.log('Error: ', err)
              fs.writeFile(`upload/${file.originalname}`, data, async () => {
                await meetingFileDB.create({
                  name: file.originalname, 
                  mimetype: file.mimetype,
                  size: file.size,
                  type: 'meeting',
                  MeetingId: req.params.id
                });
              })
            })
          })
        }
        await transaction.commit();
        return res.json(utilsTool.genResponse())
    } catch(err) {
        await transaction.rollback();
        return res.status(500).json(utilsTool.genErrorResponse(err))
    }
  },
  deleteMeeting: async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
        const meeting = await meetingDB.findByPk(req.params.id)
        if(!meeting) throw Error ('data not found')

        await meetingUserRelationshipDB.destroy({
          where: { MeetingId: req.params.id }
        }, { transaction });

        await meetingFileDB.destroy({
          where: { MeetingId: req.params.id }
        }, { transaction });

        await meetingDB.destroy({
          where: { id: req.params.id }
        }, { transaction });

        await transaction.commit();
        return res.json(utilsTool.genResponse())
    } catch(err) {
        await transaction.rollback();
        return res.status(500).json(utilsTool.genErrorResponse(err))
    }
  },
  getMeetingMinute: async (req, res) => {
    try {
        const meeting = await meetingDB.findOne({
          attributes: {exclude: ['MeetingRoomId', 'meetingRoomId']},
          include: [
            meetingRoomDB,
            { 
              model: meetingFileDB, 
              attributes: {exclude: ['MeetingId', 'meetingId']}
            },
            { 
              model: userDB, 
              as: 'participant_user',
              attributes:['id','account','name','email','phone'], 
              through: { attributes: [] } 
            },
            { 
              model: userGroupDB, 
              as: 'participant_group',
              attributes:['id','name'], 
              through: { attributes: [] } 
            }
          ],
          where: { id: req.params.id }
        })
        if(!meeting) throw Error ('data not found')
        return res.json(utilsTool.genResponseWithData(meeting))
    } catch(err) {
        return res.status(500).json(utilsTool.genErrorResponse(err))
    }
  },
  updateMeetingMinute: async (req, res) => {
    try {
        const meeting = await meetingDB.findByPk(req.params.id)
        if(!meeting) throw Error ('data not found')
        console.log(req.body)
        await meetingDB.update({
          meeting_minute: req.body.meeting_minute
        }, {where: {id: req.params.id}})
        return res.json(utilsTool.genResponse())
    } catch(err) {
        return res.status(500).json(utilsTool.genErrorResponse(err))
    }
  },
  addMeetingMinuteFile: async (req, res) => {
    try {
        const meeting = await meetingDB.findByPk(req.params.id)
        if(!meeting) throw Error ('data not found')

        const { file } = req
        if (file) {
          fs.readFile(file.path, async (err, data) => {
            if (err) console.log('Error: ', err)
            fs.writeFile(`upload/${file.originalname}`, data, async () => {
              meetingFileDB.create({
                name: file.originalname, 
                mimetype: file.mimetype,
                size: file.size,
                type: 'minute',
                MeetingId: req.params.id
              });
              return res.json(utilsTool.genResponse())
            })
          })
        } else {
          return res.json(utilsTool.genResponse())
        }
    } catch(err) {
        return res.status(500).json(utilsTool.genErrorResponse(err))
    }
  },
}

module.exports = meetingController