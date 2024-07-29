'use strict'

const keytokenModel = require("../models/keytoken.model")

class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey, refreshToken }) => {
        try {
            // 
            // const saveKeyToken = await keytokenModel.create({
            //     userId: userId,
            //     publicKey: publicKeyToString
            // })
            
            // return saveKeyToken ? saveKeyToken.publicKey : null

            const publicKeyToString = publicKey.toString()
            const filter = { userId: userId }, update = {
                publicKey: publicKeyToString, refreshTokensUsed: [], refreshToken
            }, options = { upsert:true, new: true }


            const tokens = await keytokenModel.findOneAndUpdate(filter, update, options).catch(e => console.error(e));

            return tokens ? tokens.publicKey : null
        } catch (error) {
            return {
                message: error.message
            }
        }
    }
}


module.exports = KeyTokenService