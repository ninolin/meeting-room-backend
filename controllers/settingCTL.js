const utilsTool = require('../utilsTool.js')
const db = require('../models') 
const settingDB = db.setting
const operationLogController = {
  getSetting: async (req, res) => {
    try {
      const setting = await settingDB.findAll({})
      return res.json(utilsTool.genResponseWithListData(setting))
    } catch(err) {
        return res.status(500).json(utilsTool.genResponse(err.detail))
    }
  },
  updateSetting: (req, res) => {
    try {
      const setting = req.body.setting
      setting.forEach(async (item) => {
        await settingDB.update({
          name: item.name, 
          value: item.value
        }, 
        { where: {id: item.id} })
      })
      return res.json(utilsTool.genResponse())
    } catch(err) {
        return res.status(500).json(utilsTool.genResponse(err.detail))
    }
  }
}

module.exports = operationLogController