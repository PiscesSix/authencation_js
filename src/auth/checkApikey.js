'use trict'

const { findApiKey } = require("../services/apikey.service")
const JWT = require('jsonwebtoken')
const KeyTokenService = require("../services/keyToken.service")

const HEADERS = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization',
    CLIENT_ID: 'x-client-id',
    REFRESHTOKEN: 'x-rtoken-id'
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

const authentication = async (req, res, next) => {
    try {
        const userId = req.headers[HEADERS.CLIENT_ID]
        if(!userId){
            return res.status(403).json({
                message: 'Authen Failed'
            })
        }

        const keyToken = await KeyTokenService.findByUserId(userId)

        if(!keyToken){
            return res.status(403).json({
                message: 'Authen Failed 1'
            })
        }

        // Using refreshToken -> Take accessToken
        const refreshToken = req.headers[HEADERS.REFRESHTOKEN]
        if(refreshToken){
            try {
                JWT.verify(refreshToken, keyToken.publicKey, (err, decode) => {
                    if(err){
                        return res.status(403).json({
                            message: err
                        })
                    } else {
                        if(decode.userId !== userId){
                            return res.status(403).json({
                                message: 'Missing User 1'
                            })
                        }
                    }
                    req.user = decode
                })

                req.refreshToken = refreshToken
                req.keyStore = keyToken
                return next()

            } catch (err) {
                return err.message
            }            
        }

        const accessToken = req.headers[HEADERS.AUTHORIZATION]
        if(!accessToken){
            return res.status(403).json({
                message: 'Authen Failed 2'
            })
        }

        // const decode = JWT.verify(accessToken, keyToken.publicKey)
        // if(decode.userId !== userId){
        //     return res.status(403).json({
        //         message: 'Missing User'
        //     })
        // }

        JWT.verify(accessToken, keyToken.publicKey, (err, decode) => {
            if(err){
                return res.status(403).json({
                    message: 'Missing token'
                })
            } else {
                if(decode.userId !== userId){
                    return res.status(403).json({
                        message: 'Missing User'
                    })
                }
            }
        })

        req.keyStore = keyToken
        return next()

    } catch (error) {
        return error.message
    }
}

module.exports = {
    checkApiKey,
    authentication
}