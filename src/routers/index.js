'use strict'

const express = require('express')
const router = express.Router()

const { checkApiKey } = require('../auth/checkApikey')

// check ApiKey
router.use(checkApiKey)

// check permission of that key

router.use('/v1/api', require('./access'))

module.exports = router