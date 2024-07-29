'use strict'

const apikeyModel = require("../models/apikey.model")
const crypto = require('crypto')

const findApiKey = async (key) => {
    // const test = await apikeyModel.create({key: crypto.randomBytes(20).toString('hex'), permissions: '0000'})
    // console.log(test)
    return await apikeyModel.findOne({key:key, status:true}).lean()
}

module.exports = {
    findApiKey
}