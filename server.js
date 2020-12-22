const express = require('express')
const app = express()
const dotenv = require('dotenv').config()

const corsOptions = {}

const handleCors = (options) => {
    return (req, res, next) => {
        res.set('Access-Control-Allow-Origin', 'https://cobypear.github.io/dish-tracker/')
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