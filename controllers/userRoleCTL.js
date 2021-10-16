const utilsTool = require('../utilsTool.js') 
const userRoleController = {
  getUserRole: async (req, res) => {
    try {
        const user_roles = [{
          'id': 1,
          'name': 'Admin',
          'description': 'Admin'
        }, {
          'id': 2,
          'name': 'User',
          'description': 'User'
        }]
        return res.json(utilsTool.genResponseWithListData(user_roles))
    } catch(err) {
        return res.status(500).json(utilsTool.genResponse(err.detail))
    }
  }
}

module.exports = userRoleController