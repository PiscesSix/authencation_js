'use strict'

const express = require('express')
const accessController = require('../../controllers/access.controller')
const { authentication } = require('../../auth/checkApikey')

const router = express.Router()

// signUp
router.post('/shop/signup', accessController.signUp)
router.post('/shop/login', accessController.login)

// authencation
router.use(authentication)
router.post('/shop/logout', accessController.logout)
router.post('/shop/handleRefreshToken', accessController.handleRefreshToken)

module.exports = router