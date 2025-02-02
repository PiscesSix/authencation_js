'use strict'
const AccessService = require('../services/access.service')

class AccessController {
    signUp = async ( req, res, next ) => {
        try {
            console.log(`[P]::Sign Up`, req.body)
            return res.status(200).json(
                await AccessService.signUp(req.body)
            )
        } catch (error) {
            return error.message
        }
    }

    login = async (req, res, next) => {
        try {
            return res.status(200).json(
                await AccessService.login(req.body)
            )
        } catch (error) {
            return error.message
        }
    }

    logout = async (req, res, next) => {
        try {
            return res.status(200).json(
                await AccessService.logout(req.keyStore)
            )
        } catch (error) {
            return error.message
        }
    }

    handleRefreshToken = async (req, res, next) => {
        try {
            return res.status(200).json(
                await AccessService.handleRefreshToken({
                    refreshToken: req.refreshToken,
                    user: req.user,
                    keyStore: req.keyStore
                })
            )
        } catch (error) {
            return error.message
        }
    }
}

module.exports = new AccessController