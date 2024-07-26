
const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

require('./dbs/init.mongodb')

app.use('/', require('./routers'))

app.use('/', (req, res, next) => {
    return res.status(200).json({
        message: "This is root page"
    })
})

module.exports = app
