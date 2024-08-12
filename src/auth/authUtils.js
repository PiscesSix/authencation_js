'use strict'

const JWT = require('jsonwebtoken')

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '2 days'
        })

        const refreshToken = JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '7 days'
        })

        // console.log(publicKey)

        // const check = JWT.verify(accessToken, publicKey)
        // console.log(check)

        JWT.verify(accessToken, publicKey, (err, decode) => {
            if(err){
                console.log('error verify::', err)
            } else {
                console.log('decode success::', decode)
            }
        })

        return { accessToken, refreshToken }
    } catch (error) {
        return error.message
    }
}

module.exports = {
    createTokenPair
}