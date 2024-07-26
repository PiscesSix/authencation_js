'use trict'

const { findApiKey } = require("../services/apikey.service")

const HEADERS = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization'
}
const checkApiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADERS.API_KEY]?.toString()
        if(!key){
            return res.status(403).json({
                message: 'Forbidden Error'
            })
        }

        const keyInDatabase = await findApiKey(key)
        if(!keyInDatabase){
            return res.status(403).json({
                message: 'Forbidden Error'
            })
        }

        return next()
    } catch (error) {
        
    }
}

module.exports = {
    checkApiKey
}