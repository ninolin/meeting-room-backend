const utilsTool = {
  genResponseWithListData: (data = []) => {
    return { 
        data: data,
        message: 'successs',
        total: Array.isArray(data) ? data.length : 0
    }
  },
  genResponseWithData: (data = {}) => {
    return { 
        data: data,
        message: 'successs'
    }
  },
  genResponse: (msg='successs') => {
    return { message: msg }
  },
}

module.exports = utilsTool