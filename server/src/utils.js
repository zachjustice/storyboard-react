const jwt = require('jsonwebtoken');
const APP_SECRET = 'my/-baby-lemur@#-is-aw3some';

function getUserId(context) {
    // const Authorization = context.request.get('Authorization')
    // if (Authorization) {
    //     const token = Authorization.replace('Bearer ', '')
    //     const {userId} = jwt.verify(token, APP_SECRET)
    //     return userId
    // }

    // throw new Error('Not authenticated')
    return "cjsmnlk5n1bzx0b23oh9z41g8"
}

module.exports = {
    APP_SECRET,
    getUserId,
}