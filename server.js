const express = require('express')
const app = express()
const dotenv = require('dotenv').config()

// a function that validates origin of request and checks it against the allow list
const createWhitelistValidator = function (allowList) {
    return function (val) {
        for (let i = 0; i < allowList.length; i++) {
            if (val === whitelist[i]) {
                return true
            }
        }
        return false
    }
}
const allowList = ['https://cobypear.github.io', 'http://localhost:8080', null]
const corsOptions = {
    allowOrigin: createAllowListValidator(allowList)
}

const handleCors = (options) => {
    return (req, res, next) => {
        if (options.allowOrigin) {
            let origin = req.headers['origin']
            console.log(origin)
            if (options.allowOrigin(origin)) {
                res.set('Access-Control-Allow-Origin', origin)
            } else {
                res.set('Access-Control-Allow-Origin', null)
            }
        }
        next()
    }
}

const PORT = process.env.PORT || 8080

app.use(express.urlencoded({ extended: true }));
app.use(express.json())

const restaurantRoutes = require('./routes/restaurantRoutes.js')
const menuRoutes = require('./routes/menuRoutes.js')

app.use(handleCors(corsOptions))

app.use('/api/restaurants', restaurantRoutes)
app.use('/api/menu', menuRoutes)

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))