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
  genErrorResponse: (error) => {
    console.log(error)
    return { message: error.stack.split("\n")[0] }
  },
}

module.exports = utilsTool