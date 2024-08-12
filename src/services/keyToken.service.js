'use strict'

const { Types } = require("mongoose")
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

            // const publicKeyToString = publicKey.toString()
            const filter = { userId: userId }, update = {
                publicKey: publicKey, refreshTokensUsed: [], refreshToken
            }, options = { upsert:true, new: true }


            const tokens = await keytokenModel.findOneAndUpdate(filter, update, options);

            return tokens ? tokens.publicKey : null
        } catch (error) {
            return {
                message: error.message
            }
        }
    }

    static findByUserId = async (userId) => {
        try {
            return await keytokenModel.findOne({userId: userId})
        } catch (error) {
            console.log(error.message)
            return {
                message: "Authen not found find userId"
            }
        }
    }
}


module.exports = KeyTokenService