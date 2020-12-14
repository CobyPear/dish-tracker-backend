const express = require('express')
const app = express()
const url = require('url')
const dotenv = require('dotenv').config()
const redis = require('redis')
const session = require('express-session')
const RedisStore = require('connect-redis')(session)

if (process.env.NODE_ENV === 'production') {
    const redisURL = url.parse(process.env.REDIS_URL)
    const client = redis.createClient(redisURL.port, redisURL.hostname, { no_ready_check: true })
    client.auth(redisURL.auth.split(':')[1])
}

app.use(session({
    store: process.env.NODE_ENV === 'production' ? new RedisStore({
        url: process.env.REDIS_URL,
        client: client
    }) : null,
    secret: 'smokeymuffinsandteapotarethecutest1',
    resave: true,
    saveUninitialized: true
}))

const PORT = process.env.PORT || 8080

app.use(express.urlencoded({ extended: true }));
app.use(express.json())

const restaurantRoutes = require('./routes/restaurantRoutes.js')
const menuRoutes = require('./routes/menuRoutes.js')

app.use('/api/restaurants', restaurantRoutes)
app.use('/api/menu', menuRoutes)

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))