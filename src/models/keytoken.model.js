'use strict'

const {model, Types, Schema} = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Key'
const COLLECTION_NAME = 'Keys'

var keyTokenSchema = new Schema({
    userId:{
        type:Types.ObjectId,
        required:true,
        ref:'Shop'
    },
    publicKey:{
        type:String,
        required:true,
    },
    refreshToken:{
        type:String,
        require: true
    },
    refreshTokensUsed:{
        type:Array,
        default:[]
    },
},{
    collection: COLLECTION_NAME,
    timeseries: true
});

//Export the model
module.exports = model(DOCUMENT_NAME, keyTokenSchema);