'use strict'

const { Schema, Types, model } = require('mongoose'); // Erase if already required

const COLLECTION_NAME = 'Apikey'
const DOCUMEMNT_NAME = 'Apikeys'

var apiKeySchema = new Schema({
    key:{
        type:String,
        required:true,
        unique:true,
    },
    status:{
        type:Boolean,
        default:true
    },
    permissions:{
        type:[String],
        enum: ['1111', '0000'],
        required:true,
    }
},{
    timestamps:true,
    collection:COLLECTION_NAME
});

module.exports = model(DOCUMEMNT_NAME, apiKeySchema);