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
}

module.exports = new AccessController