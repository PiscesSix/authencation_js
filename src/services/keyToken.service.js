'use strict'

const keytokenModel = require("../models/keytoken.model")

class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey }) => {
        try {
            const publicKeyToString = publicKey.toString()
            const saveKeyToken = await keytokenModel.create({
                userId: userId,
                publicKey: publicKeyToString
            })
            
            return saveKeyToken ? saveKeyToken.publicKey : null
        }
        catch (error) {
            return {
                message: error.message
            }
        }
    }
}

module.exports = KeyTokenService