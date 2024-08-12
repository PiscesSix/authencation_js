'use strict'
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const shopModel = require("../models/shop.model")
const KeyTokenService = require('./keyToken.service')
const { createTokenPair } = require('../auth/authUtils')
const { getInfoData } = require('../utils')
const RoleShop = {
    SHOP: 'SHOP',
    WRITTER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {
    static signUp = async ({ name, email, password }) => {
        try {          
            const holderShop = await shopModel.findOne({ email }).lean();
            
            if(holderShop){
                return {
                    code: 201,
                    metadata: 
                        'Shop exists'
                }
            }

            const hashPassword = await bcrypt.hash(password, 10)
            const newShop = await shopModel.create({
                name, password: hashPassword, email, roles: [RoleShop.SHOP]
            })            

            if (newShop){
                const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa', {
                    modulusLength: 4096,
                    publicKeyEncoding: {
                        type:'pkcs1',
                        format: 'pem'
                    },
                    privateKeyEncoding: {
                        type:'pkcs1',
                        format: 'pem'
                    }
                })
                
                console.log({privateKey, publicKey})
                    
                const publicKeyString = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey: publicKey
                })

                console.log(publicKeyString)

                if(!publicKeyString){
                    return {
                        code: 'xxx',
                        message: 'publicKeyString error'
                    }
                }

                const tokens = await createTokenPair({userId: newShop._id, email}, publicKeyString, privateKey)
                console.log(`Created Success Tokens::`,tokens)

                return {
                    code: 201,
                    metadata: {
                        shop: getInfoData({ fileds: ['_id', 'name', 'email'], object: newShop }),
                        tokens
                    }
                }
            }


        } catch (error) {
            return error.message
        }
    }

    static login = async ({email, password}) => {
        try {
            const foundShop = await shopModel.findOne({email})

            if (!foundShop){
                return {
                    message: "Email not registed"
                }
            }

            const matchPassword = await bcrypt.compare(password, foundShop.password)

            if(!matchPassword){
                return {
                    message: "Password incorrect!!"
                }
            }

            const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa', {
                modulusLength: 4096,
                publicKeyEncoding: {
                    type:'pkcs1',
                    format: 'pem'
                },
                privateKeyEncoding: {
                    type:'pkcs1',
                    format: 'pem'
                }
            })

            const tokens = await createTokenPair({userId: foundShop._id, email}, publicKey, privateKey)
            
            await KeyTokenService.createKeyToken({
                userId: foundShop._id,
                publicKey: publicKey,
                refreshToken: tokens.refreshToken
            })

            return {
                shop: getInfoData({ fileds: ['_id', 'name', 'email'], object: foundShop }),
                tokens
            }
        } catch (error) {
            return error.message
        }
    }

    static logout = async ({}) => {
        try {
            return {
                message: "logout"
            }
        } catch (error) {
            return error.message
        }
        
    }

    static handleRefreshToken = async ({keyStore, user, refreshToken}) => {
        try {

            const { userId, email } = user

            if(keyStore.refreshTokensUsed.includes(refreshToken)){
                return "refresh Token is Used"
            }
            
            if (keyStore.refreshToken !== refreshToken) {
                return "shop not register"
            }

            const foundShop = await shopModel.findOne({email})

            const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa', {
                modulusLength: 4096,
                publicKeyEncoding: {
                    type:'pkcs1',
                    format: 'pem'
                },
                privateKeyEncoding: {
                    type:'pkcs1',
                    format: 'pem'
                }
            })

            const tokens = await createTokenPair({userId: foundShop._id, email}, publicKey, privateKey)
            
            await keyStore.updateOne({
                $set: {
                    refreshToken: tokens.refreshToken
                },
                $addToSet: {
                    refreshTokensUsed: refreshToken
                }
            })

            return {
                userId,
                email,
                tokens
            }

        } catch (err) {
            return {
                message: err.message
            }
        }
    }
}

module.exports = AccessService